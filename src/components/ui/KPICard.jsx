import { TrendingUp, TrendingDown } from "lucide-react";

const variants = {
  success: {
    iconBg: "bg-gradient-to-br from-accent-green to-teal-400",
    trendBg: "bg-accent-green",
    trendColor: "text-white",
  },
  purple: {
    iconBg: "bg-gradient-to-br from-accent-purple to-accent-blue",
    trendBg: "bg-accent-purple",
    trendColor: "text-white",
  },
  pink: {
    iconBg: "bg-gradient-to-br from-accent-pink to-orange-400",
    trendBg: "bg-accent-pink",
    trendColor: "text-white",
  },
  blue: {
    iconBg: "bg-gradient-to-br from-accent-blue to-cyan-400",
    trendBg: "bg-accent-blue",
    trendColor: "text-white",
  },
  red: {
    iconBg: "bg-gradient-to-br from-status-unused to-orange-400",
    trendBg: "bg-status-unused",
    trendColor: "text-white",
  },
};

export default function KPICard({
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  variant = "purple",
}) {
  const styles = variants[variant] ?? variants.purple;

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 h-32 hover:border-border/80 transition-colors">
      {/* Title + Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-text-secondary">{title}</span>
        <div
          className={`h-8 w-8 rounded-lg ${styles.iconBg} flex items-center justify-center`}
        >
          {Icon && <Icon size={16} className="text-white" />}
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {subValue && (
          <span className="text-2xl font-medium text-text-muted">
            /{subValue}
          </span>
        )}
      </div>

      {/* Trend badge */}
      <div className="flex items-center">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${styles.trendBg} ${styles.trendColor}`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
