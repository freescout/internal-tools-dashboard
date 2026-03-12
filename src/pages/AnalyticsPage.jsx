import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  PiggyBank,
  ArrowRight,
} from "lucide-react";
import KPICard from "../components/ui/KPICard";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useAnalyticsPage } from "../hooks/useAnalyticsPage";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_RANGES = [
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "1y", value: 365 },
];

const PIE_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
];

// ─── Tooltip components ───────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-text-secondary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: €{p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs">
      <p style={{ color: d.payload.fill }} className="font-semibold mb-0.5">
        {d.name}
      </p>
      <p className="text-text-primary">€{d.value?.toLocaleString()} / mo</p>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Insights card ────────────────────────────────────────────────────────────

function InsightCard({
  icon: Icon,
  iconClass,
  label,
  value,
  description,
  linkLabel,
  onLink,
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconClass}`}
        >
          <Icon size={15} className="text-white" />
        </div>
        <span className="text-xs font-medium text-text-secondary">{label}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      {onLink && (
        <button
          onClick={onLink}
          className="flex items-center gap-1 text-xs text-accent-purple hover:text-accent-purple/80 transition-colors mt-auto"
        >
          {linkLabel}
          <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { derived, loading, error, timeRange, setTimeRange } =
    useAnalyticsPage();

  if (error) {
    return (
      <div className="mx-auto max-w-6xl w-full px-6 py-16 text-center">
        <p className="text-sm text-status-unused">Failed to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-6 py-6 space-y-6">
      {/* Page header + time range picker */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Analytics</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Costs, usage and insights across your SaaS stack
          </p>
        </div>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                timeRange === r.value
                  ? "bg-accent-purple text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      {loading || !derived ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Monthly Spend"
            value={`€${derived.kpis.totalSpend?.toLocaleString()}`}
            subValue={`€${(derived.kpis.monthlyLimit / 1000).toFixed(0)}k`}
            trend={derived.kpis.budgetTrend ?? "—"}
            icon={DollarSign}
            variant="purple"
          />
          <KPICard
            title="Budget Used"
            value={`${derived.kpis.utilizationPct}%`}
            trend={
              derived.kpis.utilizationPct >= 90 ? "⚠ Near limit" : "On track"
            }
            icon={TrendingUp}
            variant={derived.kpis.utilizationPct >= 90 ? "red" : "success"}
          />
          <KPICard
            title="Cost / User"
            value={`€${derived.kpis.costPerUser}`}
            trend={derived.kpis.costPerUserTrend ?? "—"}
            icon={Users}
            variant="blue"
          />
          <KPICard
            title="Active Users"
            value={derived.kpis.activeUsers}
            subValue={derived.kpis.totalUsers}
            trend={derived.kpis.toolsTrend ?? "—"}
            icon={Users}
            variant="pink"
          />
        </div>
      )}

      {/* Monthly spend — full width */}
      {loading || !derived ? (
        <SkeletonCard className="h-64 rounded-xl" />
      ) : (
        <ChartCard
          title="Monthly Spend Evolution"
          subtitle="Derived from current and previous month anchors"
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={derived.monthlySpend}
              margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2d3e"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                width={44}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="spend"
                name="Spend"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#spendGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#8b5cf6" }}
              />
              <Area
                type="monotone"
                dataKey="budget"
                name="Budget"
                stroke="#2a2d3e"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Budget Progress */}
      {!loading && derived && (
        <ChartCard
          title="Budget Progress"
          subtitle={`${derived.kpis.utilizationPct}% du budget mensuel utilisé`}
        >
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="h-2 rounded-full bg-linear-to-r from-accent-purple to-accent-blue transition-all"
              style={{ width: `${derived.kpis.utilizationPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted">
            <span>€{derived.kpis.totalSpend?.toLocaleString()}</span>
            <span>€{derived.kpis.monthlyLimit?.toLocaleString()}</span>
          </div>
        </ChartCard>
      )}

      {/* 2-col: donut + bars */}
      {loading || !derived ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkeletonCard className="h-72 rounded-xl" />
          <SkeletonCard className="h-72 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Department cost donut */}
          <ChartCard
            title="Cost by Department"
            subtitle="Monthly spend per owner department"
          >
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={derived.departmentCosts}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {derived.departmentCosts.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {derived.departmentCosts.map((d, i) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-xs text-text-secondary truncate max-w-24">
                        {d.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      €{d.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Top expensive tools bar chart */}
          <ChartCard
            title="Top Expensive Tools"
            subtitle="Click a bar to view in Tools catalog"
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={derived.topTools}
                layout="vertical"
                margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
                onClick={(e) => {
                  if (e?.activePayload?.[0]) {
                    const toolName = e.activePayload[0].payload.fullName;
                    navigate(`/tools?search=${encodeURIComponent(toolName)}`);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2a2d3e"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `€${(v / 1000).toFixed(1)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="cost"
                  name="Monthly Cost"
                  radius={[0, 4, 4, 0]}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Insights strip */}
      {loading || !derived ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-36" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InsightCard
            icon={AlertTriangle}
            iconClass="bg-gradient-to-br from-status-unused to-orange-400"
            label="Unused tools costing money"
            value={`€${derived.insights.unusedCost.toLocaleString()} / mo`}
            description={`${derived.insights.unusedTools.length} tool${derived.insights.unusedTools.length !== 1 ? "s" : ""} are unused but still billed`}
            linkLabel="Review unused tools"
            onLink={() => navigate("/tools?status=unused")}
          />
          <InsightCard
            icon={Clock}
            iconClass="bg-gradient-to-br from-status-expiring to-yellow-300"
            label="Expiring soon"
            value={`${derived.insights.expiringTools.length} tool${derived.insights.expiringTools.length !== 1 ? "s" : ""}`}
            description="Licenses expiring — review before auto-renewal"
            linkLabel="Review expiring tools"
            onLink={() => navigate("/tools?status=expiring")}
          />
          <InsightCard
            icon={PiggyBank}
            iconClass="bg-gradient-to-br from-accent-green to-teal-400"
            label="Budget headroom"
            value={`€${derived.insights.budgetHeadroom.toLocaleString()}`}
            description={`${derived.kpis.utilizationPct}% of monthly budget used`}
            linkLabel="View full budget"
            onLink={() => navigate("/")}
          />
        </div>
      )}

      {/* Usage Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Outils les plus utilisés"
          subtitle="Score pondéré : daily×4, weekly×3, monthly×2, rarely×1"
        >
          {loading || !derived ? (
            <SkeletonCard />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={derived.mostUsedTools}
                layout="vertical"
                margin={{ left: 12, right: 32, top: 4, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{
                    fill: "var(--color-text-secondary)",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={175}
                  tick={{
                    fill: "var(--color-text-secondary)",
                    fontSize: 12,
                  }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="score"
                  fill="var(--color-accent-purple)"
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(d) =>
                    navigate(`/tools?search=${encodeURIComponent(d.fullName)}`)
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Activité par département"
          subtitle="Score d'usage agrégé sur tous les outils"
        >
          {loading || !derived ? (
            <SkeletonCard />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={derived.deptActivity}
                layout="vertical"
                margin={{ left: 12, right: 32, top: 4, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{
                    fill: "var(--color-text-secondary)",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  dataKey="dept"
                  type="category"
                  width={120}
                  tick={{
                    fill: "var(--color-text-secondary)",
                    fontSize: 12,
                  }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="score"
                  fill="var(--color-accent-blue)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
