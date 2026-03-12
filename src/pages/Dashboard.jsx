import { Building2, TrendingUp, Users, Wrench } from "lucide-react";
import KPICard from "../components/ui/KPICard";
import SkeletonCard from "../components/ui/SkeletonCard";
import ToolsTable from "../components/tools/ToolsTable";
import { useAnalytics } from "../hooks/useAnalytics";
import { useRecentTools } from "../hooks/useRecentTools";

export default function Dashboard() {
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useAnalytics();
  const {
    data: tools = [],
    isLoading: toolsLoading,
    isError: toolsError,
  } = useRecentTools();

  const budget = analytics?.budget_overview;
  const trends = analytics?.kpi_trends;
  const costs = analytics?.cost_analytics;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Internal Tools Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Monitor and manage your organization's software tools and expenses
        </p>
      </div>

      {/* KPI Cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : analyticsError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">
            Failed to load KPI data. Please try again.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Monthly Budget"
            value={`€${budget?.current_month_total?.toLocaleString() ?? "—"}`}
            subValue={`€${(budget?.monthly_limit / 1000).toFixed(0)}k`}
            trend={trends?.budget_change ?? "—"}
            trendUp={true}
            icon={TrendingUp}
            variant="success"
          />
          <KPICard
            title="Active Tools"
            value={costs?.active_users ?? "—"}
            trend={trends?.tools_change ?? "—"}
            trendUp={true}
            icon={Wrench}
            variant="purple"
          />
          <KPICard
            title="Departments"
            value="5"
            trend={trends?.departments_change ?? "—"}
            trendUp={true}
            icon={Building2}
            variant="red"
          />
          <KPICard
            title="Cost/User"
            value={`€${costs?.cost_per_user ?? "—"}`}
            trend={trends?.cost_per_user_change ?? "—"}
            icon={Users}
            variant="pink"
          />
        </div>
      )}

      {/* Recent Tools */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">
            Recent Tools
          </h2>
          <span className="text-xs text-text-muted">Last 30 days</span>
        </div>
        {toolsLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 rounded bg-border animate-pulse" />
            ))}
          </div>
        ) : toolsError ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-red-400">
              Failed to load tools. Please try again.
            </p>
          </div>
        ) : (
          <ToolsTable
            tools={tools}
            showPagination={false}
            showFilters={false}
          />
        )}
      </div>
    </div>
  );
}
