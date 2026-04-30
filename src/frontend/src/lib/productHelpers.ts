import type { ProductStatus } from "@/types";

export function getDaysRemaining(expiryDate: number): number {
  const now = Date.now();
  const diffMs = expiryDate - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getProductStatus(expiryDate: number): ProductStatus {
  const days = getDaysRemaining(expiryDate);
  if (days < 0) return "expired";
  if (days <= 7) return "soon";
  return "safe";
}

export function formatDaysLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
}

export function formatExpiryDate(expiryDate: number): string {
  return new Date(expiryDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const STATUS_CONFIG: Record<
  ProductStatus,
  {
    label: string;
    color: string;
    bgClass: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  safe: {
    label: "Fresh",
    color: "#4CAF50",
    bgClass: "bg-success/10",
    textClass: "text-success",
    badgeClass: "badge-safe",
  },
  soon: {
    label: "Expiring Soon",
    color: "#FF9800",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    badgeClass: "badge-warning",
  },
  expired: {
    label: "Expired",
    color: "#F44336",
    bgClass: "bg-danger/10",
    textClass: "text-danger",
    badgeClass: "badge-danger",
  },
};

export const CATEGORY_ICONS: Record<string, string> = {
  Food: "🥦",
  Medicine: "💊",
  Daily: "🧴",
};

export const LOCATION_ICONS: Record<string, string> = {
  Fridge: "❄️",
  Pantry: "🗄️",
  Cabinet: "🗃️",
  Freezer: "🧊",
  Bathroom: "🛁",
};
