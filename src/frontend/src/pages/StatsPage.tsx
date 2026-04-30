import { useAppStore } from "@/store/useAppStore";
import {
  BarChart2,
  DollarSign,
  Download,
  Leaf,
  TrendingDown,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

function StatBadge({
  icon,
  label,
  value,
  colorClass,
  bgClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className={`card-neumorphic p-4 flex flex-col gap-2 ${bgClass}`}>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass} bg-current/10`}
      >
        {icon}
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-medium leading-tight">
        {label}
      </p>
    </div>
  );
}

export function StatsPage() {
  const getSummaryStats = useAppStore((s) => s.getSummaryStats);
  const products = useAppStore((s) => s.products);
  const stats = getSummaryStats();

  const pieData = [
    { name: "Fresh", value: stats.fresh, color: "#4CAF50" },
    { name: "Expiring", value: stats.soon, color: "#FF9800" },
    { name: "Expired", value: stats.expired, color: "#F44336" },
  ].filter((d) => d.value > 0);

  const categoryData = ["Food", "Medicine", "Daily"].map((cat) => ({
    name: cat,
    total: products.filter((p) => p.category === cat).length,
    expired: products.filter(
      (p) => p.category === cat && p.status === "expired",
    ).length,
  }));

  const wasteAvoided = stats.fresh + stats.soon;
  const savingsEstimate = wasteAvoided * 4.5;

  const handleExport = () => {
    const rows = [
      ["Name", "Category", "Location", "Expiry Date", "Status"],
      ...products.map((p) => [
        p.name,
        p.category,
        p.location,
        new Date(p.expiryDate).toLocaleDateString(),
        p.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "freshalert-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!", { duration: 3000 });
  };

  return (
    <div className="flex flex-col flex-1 bg-background" data-ocid="stats.page">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-heading-sm text-foreground">
            Stats &amp; Reports
          </h1>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold transition-smooth hover:bg-primary/20"
            data-ocid="stats.export_button"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        {/* Summary cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
          data-ocid="stats.summary_section"
        >
          <StatBadge
            icon={<Leaf size={18} className="text-success" />}
            label="Products Tracked"
            value={String(stats.total)}
            colorClass="text-success"
            bgClass=""
          />
          <StatBadge
            icon={<DollarSign size={18} className="text-primary" />}
            label="Est. Savings"
            value={`$${savingsEstimate.toFixed(0)}`}
            colorClass="text-primary"
            bgClass=""
          />
          <StatBadge
            icon={<TrendingDown size={18} className="text-warning" />}
            label="Expiring Soon"
            value={String(stats.soon)}
            colorClass="text-warning"
            bgClass=""
          />
          <StatBadge
            icon={<BarChart2 size={18} className="text-danger" />}
            label="Already Expired"
            value={String(stats.expired)}
            colorClass="text-danger"
            bgClass=""
          />
        </motion.div>

        {/* Pie chart */}
        {pieData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="card-neumorphic p-4"
            data-ocid="stats.pie_chart"
          >
            <h2 className="text-sm font-display font-semibold text-foreground mb-4">
              Product Status Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bar chart by category */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-neumorphic p-4"
          data-ocid="stats.bar_chart"
        >
          <h2 className="text-sm font-display font-semibold text-foreground mb-4">
            By Category
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={categoryData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="total"
                fill="oklch(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Total"
              />
              <Bar
                dataKey="expired"
                fill="oklch(var(--accent))"
                radius={[4, 4, 0, 0]}
                name="Expired"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

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
    </div>
  );
}
