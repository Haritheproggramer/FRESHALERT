import {
  CATEGORY_ICONS,
  LOCATION_ICONS,
  STATUS_CONFIG,
  formatDaysLabel,
  formatExpiryDate,
} from "@/lib/productHelpers";
import { useAppStore } from "@/store/useAppStore";
import type { Product } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Mic, Plus, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

function StatCard({
  count,
  label,
  bgClass,
  textClass,
}: {
  count: number;
  label: string;
  bgClass: string;
  textClass: string;
}) {
  return (
    <div
      className={`card-neumorphic flex-1 p-3 ${bgClass} text-center min-w-0`}
    >
      <p className={`text-2xl font-display font-bold ${textClass}`}>{count}</p>
      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 font-medium">
        {label}
      </p>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const deleteProduct = useAppStore((s) => s.deleteProduct);
  const [swiped, setSwiped] = useState(false);
  const config = STATUS_CONFIG[product.status];
  const navigate = useNavigate();

  const handleDelete = useCallback(() => {
    deleteProduct(product.id);
    toast.success(`${product.name} removed`, { duration: 3000 });
  }, [product.id, product.name, deleteProduct]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative overflow-hidden rounded-2xl"
      data-ocid={`product.item.${index + 1}`}
    >
      {/* Swipe-reveal delete layer */}
      <AnimatePresence>
        {swiped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-danger/90 flex items-center justify-end pr-6 rounded-2xl z-10"
          >
            <button
              type="button"
              onClick={handleDelete}
              className="flex flex-col items-center gap-1 text-white"
              data-ocid={`product.delete_button.${index + 1}`}
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 size={22} />
              <span className="text-xs font-semibold">Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ x: swiped ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="card-neumorphic p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-smooth"
        onClick={() => {
          if (swiped) {
            setSwiped(false);
            return;
          }
          navigate({ to: "/product/$id", params: { id: product.id } });
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setSwiped(!swiped);
        }}
      >
        {/* Product icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgClass}`}
        >
          <span className="text-2xl" aria-hidden="true">
            {CATEGORY_ICONS[product.category] ?? "📦"}
          </span>
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {product.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-muted-foreground">
              {LOCATION_ICONS[product.location] ?? "📦"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {product.location}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatExpiryDate(product.expiryDate)}
          </p>
        </div>

        {/* Days badge */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={config.badgeClass}>
            {formatDaysLabel(
              Math.ceil((product.expiryDate - Date.now()) / 86400000),
            )}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSwiped(!swiped);
            }}
            className="text-muted-foreground/50 hover:text-danger transition-colors p-1"
            data-ocid={`product.swipe_reveal.${index + 1}`}
            aria-label={`Reveal actions for ${product.name}`}
          >
            ···
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DashboardPage() {
  const getSummaryStats = useAppStore((s) => s.getSummaryStats);
  const products = useAppStore((s) => s.products);
  const stats = getSummaryStats();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "expired" | "soon" | "safe"
  >("all");

  const filtered = useMemo(() => {
    let list = products;
    if (activeFilter !== "all") {
      list = list.filter((p) =>
        activeFilter === "soon"
          ? p.status === "soon"
          : activeFilter === "expired"
            ? p.status === "expired"
            : p.status === "safe",
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.expiryDate - b.expiryDate);
  }, [products, searchQuery, activeFilter]);

  const filterTabs = [
    { key: "all" as const, label: "All", count: stats.total },
    { key: "expired" as const, label: "Expired", count: stats.expired },
    { key: "soon" as const, label: "Soon", count: stats.soon },
    { key: "safe" as const, label: "Fresh", count: stats.fresh },
  ];

  return (
    <div
      className="flex flex-col flex-1 bg-background"
      data-ocid="dashboard.page"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-3 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-heading-sm text-foreground">FreshAlert 🌿</h1>
            <p className="text-body-sm text-muted-foreground">
              {stats.expired > 0 && (
                <span className="text-danger font-semibold">
                  {stats.expired} expired ·{" "}
                </span>
              )}
              {stats.soon} expiring soon
            </p>
          </div>
          <Link
            to="/settings"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-smooth"
            data-ocid="dashboard.settings_link"
            aria-label="Settings"
          >
            <span className="text-lg" aria-hidden="true">
              👤
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-9 pr-10 py-2.5 text-sm h-10"
            data-ocid="dashboard.search_input"
            aria-label="Search products"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            data-ocid="dashboard.voice_search_button"
            aria-label="Voice search"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-4">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mt-4 mb-4"
          data-ocid="dashboard.stats_section"
        >
          <StatCard
            count={stats.expired}
            label="Expired"
            bgClass="bg-danger/8"
            textClass="text-danger"
          />
          <StatCard
            count={stats.soon}
            label="Expiring Soon"
            bgClass="bg-warning/8"
            textClass="text-warning"
          />
          <StatCard
            count={stats.fresh}
            label="Fresh"
            bgClass="bg-success/8"
            textClass="text-success"
          />
        </motion.div>

        {/* Expiry warning banner */}
        {stats.expired > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-2xl px-4 py-3 mb-4"
            data-ocid="dashboard.expired_warning"
          >
            <AlertTriangle size={18} className="text-danger flex-shrink-0" />
            <p className="text-sm text-danger font-semibold">
              {stats.expired} product{stats.expired > 1 ? "s" : ""} expired —
              check &amp; dispose
            </p>
          </motion.div>
        )}

        {/* Filter tabs */}
        <div
          className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide"
          data-ocid="dashboard.filter_tabs"
        >
          {filterTabs.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              data-ocid={`dashboard.filter.${key}`}
              className={[
                "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth border",
                activeFilter === key
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30",
              ].join(" ")}
            >
              {label}
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  activeFilter === key
                    ? "bg-primary-foreground/20"
                    : "bg-muted",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Product list */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-3 text-center"
            data-ocid="dashboard.empty_state"
          >
            <span className="text-5xl" aria-hidden="true">
              🎉
            </span>
            <p className="font-display font-semibold text-foreground">
              All clear!
            </p>
            <p className="text-sm text-muted-foreground">
              No products match your filter.
            </p>
          </motion.div>
        ) : (
          <div
            className="flex flex-col gap-3"
            data-ocid="dashboard.product_list"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        to="/add"
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 transition-smooth hover:scale-110 active:scale-95"
        style={{ background: "var(--gradient-safe)" }}
        data-ocid="dashboard.add_fab"
        aria-label="Add new product"
      >
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
