import {
  CATEGORY_ICONS,
  STATUS_CONFIG,
  formatDaysLabel,
  formatExpiryDate,
} from "@/lib/productHelpers";
import { useAppStore } from "@/store/useAppStore";
import type { Product, ProductCategory } from "@/types";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const categoryTabs: Array<{
  key: ProductCategory | "Expired";
  label: string;
  icon: string;
}> = [
  { key: "Food", label: "Food", icon: "🥦" },
  { key: "Medicine", label: "Medicine", icon: "💊" },
  { key: "Daily", label: "Daily", icon: "🧴" },
  { key: "Expired", label: "Expired", icon: "⚠️" },
];

function CategoryProductCard({
  product,
  index,
}: { product: Product; index: number }) {
  const config = STATUS_CONFIG[product.status];
  const daysRemaining = Math.ceil((product.expiryDate - Date.now()) / 86400000);

  const progress = Math.max(
    0,
    Math.min(100, ((daysRemaining + 30) / 60) * 100),
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`categories.item.${index + 1}`}
    >
      <Link to="/product/$id" params={{ id: product.id }}>
        <div className="card-neumorphic p-4 flex flex-col gap-3 active:scale-[0.97] transition-smooth">
          {/* Icon + name */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.bgClass} flex-shrink-0`}
            >
              <span className="text-2xl" aria-hidden="true">
                {CATEGORY_ICONS[product.category] ?? "📦"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-sm text-foreground truncate">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.location}
              </p>
            </div>
            <span className={config.badgeClass}>
              {formatDaysLabel(daysRemaining)}
            </span>
          </div>

          {/* Expiry date + progress */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Expires {formatExpiryDate(product.expiryDate)}</span>
              <span className={config.textClass}>{config.label}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: index * 0.05 + 0.2,
                }}
                className={`h-full rounded-full ${config.bgClass.replace("/10", "")}`}
                style={{ backgroundColor: config.color }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<ProductCategory | "Expired">(
    "Food",
  );
  const getProductsByCategory = useAppStore((s) => s.getProductsByCategory);

  const products = useMemo(
    () =>
      getProductsByCategory(activeTab).sort(
        (a, b) => a.expiryDate - b.expiryDate,
      ),
    [getProductsByCategory, activeTab],
  );

  return (
    <div
      className="flex flex-col flex-1 bg-background"
      data-ocid="categories.page"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-0 sticky top-0 z-40">
        <h1 className="text-heading-sm text-foreground mb-3">Categories</h1>

        {/* Category tabs */}
        <div
          className="flex gap-1"
          role="tablist"
          aria-label="Product categories"
        >
          {categoryTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              data-ocid={`categories.tab.${key.toLowerCase()}`}
              className={[
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-smooth border-b-2 rounded-t-lg",
                activeTab === key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <span className="text-base" aria-hidden="true">
                {icon}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
            data-ocid="categories.empty_state"
          >
            <span className="text-5xl" aria-hidden="true">
              🎉
            </span>
            <p className="font-display font-semibold text-foreground">
              {activeTab === "Expired"
                ? "No expired items!"
                : `No ${activeTab} products yet`}
            </p>
            <p className="text-sm text-muted-foreground">
              {activeTab === "Expired"
                ? "Great job keeping everything fresh."
                : "Add products to start tracking."}
            </p>
            <Link
              to="/add"
              className="btn-primary mt-2 text-sm px-5 py-2.5"
              data-ocid="categories.add_button"
            >
              + Add Product
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((product, i) => (
              <CategoryProductCard
                key={product.id}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
