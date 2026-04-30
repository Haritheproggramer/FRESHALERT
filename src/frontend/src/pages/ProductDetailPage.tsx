import {
  CATEGORY_ICONS,
  LOCATION_ICONS,
  STATUS_CONFIG,
  formatDaysLabel,
  formatExpiryDate,
} from "@/lib/productHelpers";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarIcon, Edit3, Share2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const products = useAppStore((s) => s.products);
  const deleteProduct = useAppStore((s) => s.deleteProduct);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4 px-4"
        data-ocid="product_detail.not_found"
      >
        <span className="text-5xl" aria-hidden="true">
          🔍
        </span>
        <p className="font-display font-semibold text-foreground">
          Product not found
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="btn-outline text-sm px-5 py-2.5"
          data-ocid="product_detail.back_button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const config = STATUS_CONFIG[product.status];
  const daysRemaining = Math.ceil((product.expiryDate - Date.now()) / 86400000);

  const handleDelete = () => {
    deleteProduct(product.id);
    toast.success("Product removed", { duration: 2500 });
    navigate({ to: "/" });
  };

  const handleShare = () => {
    const text = `${product.name} expires ${formatExpiryDate(product.expiryDate)} — tracked with FreshAlert`;
    if (navigator.share) {
      navigator.share({ title: "FreshAlert", text }).catch(() => null);
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success("Copied to clipboard!"));
    }
  };

  return (
    <div
      className="flex flex-col flex-1 bg-background"
      data-ocid="product_detail.page"
    >
      {/* Hero header */}
      <div
        className={`px-4 pt-4 pb-8 relative overflow-hidden ${config.bgClass}`}
        style={{
          background: `var(--gradient-${product.status === "safe" ? "safe" : product.status === "soon" ? "warning" : "danger"})`,
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-smooth"
            data-ocid="product_detail.back_button"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-smooth"
              data-ocid="product_detail.share_button"
              aria-label="Share product"
            >
              <Share2 size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Product icon + name */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shadow-lg"
          >
            <span className="text-5xl" aria-hidden="true">
              {CATEGORY_ICONS[product.category] ?? "📦"}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center"
          >
            <h1 className="text-heading-sm text-white font-display">
              {product.name}
            </h1>
            <p className="text-white/80 text-sm mt-0.5">
              {product.category} · {product.location}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
        style={{ marginTop: "-1.5rem" }}
      >
        {/* Status card — overlapping hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-4 flex items-center justify-between"
          data-ocid="product_detail.status_card"
        >
          <div>
            <p className="text-xs text-muted-foreground font-medium">Status</p>
            <p className={`font-display font-bold text-lg ${config.textClass}`}>
              {config.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium">
              Time left
            </p>
            <p className={`font-display font-bold text-lg ${config.textClass}`}>
              {formatDaysLabel(daysRemaining)}
            </p>
          </div>
          <span
            className={`text-3xl px-2 py-1 rounded-xl ${config.bgClass}`}
            aria-hidden="true"
          >
            {product.status === "safe"
              ? "✅"
              : product.status === "soon"
                ? "⚠️"
                : "❌"}
          </span>
        </motion.div>

        {/* Details list */}
        <div
          className="card-neumorphic divide-y divide-border"
          data-ocid="product_detail.details_section"
        >
          <DetailRow
            icon={<CalendarIcon size={16} />}
            label="Expiry Date"
            value={formatExpiryDate(product.expiryDate)}
          />
          <DetailRow
            icon={
              <span className="text-base" aria-hidden="true">
                {LOCATION_ICONS[product.location] ?? "📦"}
              </span>
            }
            label="Location"
            value={product.location}
          />
          <DetailRow
            icon={
              <span className="text-base" aria-hidden="true">
                {CATEGORY_ICONS[product.category]}
              </span>
            }
            label="Category"
            value={product.category}
          />
          {product.openedDate && (
            <DetailRow
              icon={
                <span className="text-base" aria-hidden="true">
                  📂
                </span>
              }
              label="Opened"
              value={formatExpiryDate(product.openedDate)}
            />
          )}
          <DetailRow
            icon={
              <span className="text-base" aria-hidden="true">
                📅
              </span>
            }
            label="Added"
            value={formatExpiryDate(product.createdAt)}
          />
        </div>

        {/* Notes */}
        {product.notes && (
          <div
            className="card-neumorphic p-4"
            data-ocid="product_detail.notes_section"
          >
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
              Notes
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {product.notes}
            </p>
          </div>
        )}

        {/* Use Now CTA for expiring soon */}
        {product.status !== "safe" && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              toast.success("Reminder set! Use it today.", { duration: 3000 })
            }
            className="btn-primary w-full"
            data-ocid="product_detail.use_now_button"
          >
            {product.status === "expired" ? "⚠️ Dispose Safely" : "🍽️ Use Now"}
          </motion.button>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              toast.info("Edit feature coming soon!", { duration: 2000 })
            }
            className="btn-outline flex-1 flex items-center justify-center gap-2 text-sm"
            data-ocid="product_detail.edit_button"
          >
            <Edit3 size={15} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-danger/40 text-danger rounded-full px-6 py-3 text-sm font-semibold transition-smooth hover:bg-danger/10 active:scale-95"
            data-ocid="product_detail.delete_button"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>

        {/* Branding */}
        <p className="text-center text-[11px] text-muted-foreground/60 pb-4">
          © {new Date().getFullYear()}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-end justify-center pb-4"
          onClick={() => setShowDeleteConfirm(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowDeleteConfirm(false)}
          role="presentation"
          data-ocid="product_detail.dialog"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-card rounded-2xl p-6 mx-4 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
            aria-labelledby="delete-title"
          >
            <h2
              id="delete-title"
              className="font-display font-bold text-lg text-foreground mb-2"
            >
              Delete Product?
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Remove <strong>{product.name}</strong> from your list. This cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-outline flex-1 text-sm"
                data-ocid="product_detail.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-danger text-white rounded-full py-3 text-sm font-semibold hover:bg-danger/90 active:scale-95 transition-smooth"
                data-ocid="product_detail.confirm_button"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-muted-foreground flex-shrink-0 w-5 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-sm text-muted-foreground flex-1">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value}
      </span>
    </div>
  );
}
