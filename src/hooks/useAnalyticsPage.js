import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchAnalytics, fetchAllTools, fetchUserTools } from "../lib/api";

const FREQ_SCORE = { daily: 4, weekly: 3, monthly: 2, rarely: 1 };

function deterministicNoise(index) {
  const seeds = [120, -200, 340, -150, 280, -90, 410, -180];
  return seeds[index % seeds.length];
}

function buildMonthlySpend(current, previous, monthlyLimit) {
  const now = new Date();
  const months = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1);
    return d.toLocaleString("default", { month: "short" });
  });

  const base = previous * 0.78;
  return months.map((month, i) => {
    const t = i / (months.length - 1);
    const trend = base + (current - base) * t;
    return {
      month,
      spend: Math.round(trend + deterministicNoise(i)),
      budget: monthlyLimit,
    };
  });
}

export function useAnalyticsPage() {
  const [timeRange, setTimeRange] = useState(30);

  const analyticsQuery = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    staleTime: 1000 * 60 * 5,
  });

  const toolsQuery = useQuery({
    queryKey: ["tools"],
    queryFn: fetchAllTools,
    staleTime: 1000 * 60 * 5,
  });

  const userToolsQuery = useQuery({
    queryKey: ["user_tools"],
    queryFn: fetchUserTools,
    staleTime: 5 * 60 * 1000,
  });

  const derived = useMemo(() => {
    const analytics = analyticsQuery.data;
    const tools = toolsQuery.data ?? [];
    const userTools = userToolsQuery.data ?? [];

    if (!analytics) return null;

    const budgetOverview = analytics.budget_overview ?? {};
    const kpiTrends = analytics.kpi_trends ?? {};
    const costAnalytics = analytics.cost_analytics ?? {};

    const current = budgetOverview.current_month_total ?? 0;
    const previous = budgetOverview.previous_month_total ?? 0;
    const monthlyLimit = budgetOverview.monthly_limit ?? 0;

    const utilizationPct =
      monthlyLimit > 0 ? Math.round((current / monthlyLimit) * 100) : 0;

    const allMonths = buildMonthlySpend(current, previous, monthlyLimit);
    const monthlySpend =
      timeRange === 30
        ? allMonths.slice(-4)
        : timeRange === 90
          ? allMonths.slice(-6)
          : allMonths;

    const deptMap = {};
    tools.forEach((t) => {
      const dept = (t.owner_department || "Other")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());
      deptMap[dept] = (deptMap[dept] || 0) + Number(t.monthly_cost || 0);
    });
    const departmentCosts = Object.entries(deptMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const topTools = [...tools]
      .filter((t) => t.monthly_cost > 0)
      .sort((a, b) => b.monthly_cost - a.monthly_cost)
      .slice(0, 6)
      .map((t) => {
        const name = t.name ?? "Unnamed tool";
        return {
          id: t.id,
          name: name.length > 20 ? name.slice(0, 20) + "…" : name,
          fullName: name,
          cost: t.monthly_cost,
          status: t.status,
        };
      });

    const unusedTools = tools.filter(
      (t) => t.status === "unused" && t.monthly_cost > 0,
    );
    const expiringTools = tools.filter((t) => t.status === "expiring");
    const unusedCost = unusedTools.reduce(
      (sum, t) => sum + Number(t.monthly_cost || 0),
      0,
    );
    const budgetHeadroom = monthlyLimit - current;

    // Most Used Tools: weighted score by usage_frequency, top 8
    const toolScoreMap = {};
    for (const ut of userTools) {
      toolScoreMap[ut.tool_id] =
        (toolScoreMap[ut.tool_id] ?? 0) + (FREQ_SCORE[ut.usage_frequency] ?? 1);
    }
    const mostUsedTools = Object.entries(toolScoreMap)
      .map(([toolId, score]) => {
        const tool = tools.find((t) => t.id === Number(toolId));
        if (!tool) return null; // ← skip tools not in catalog
        const fullName = tool.name ?? `Tool #${toolId}`;
        const name =
          fullName.length > 22 ? fullName.slice(0, 19) + "…" : fullName;
        return { name, fullName, score };
      })
      .filter(Boolean) // ← remove nulls
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    // Department Activity: total weighted score per department
    const deptScoreMap = {};
    for (const ut of userTools) {
      const tool = tools.find((t) => t.id === ut.tool_id);
      const dept = tool?.owner_department
        ? tool.owner_department.trim().replace(/^\w/, (c) => c.toUpperCase())
        : "Other";
      deptScoreMap[dept] =
        (deptScoreMap[dept] ?? 0) + (FREQ_SCORE[ut.usage_frequency] ?? 1);
    }
    const deptActivity = Object.entries(deptScoreMap)
      .map(([dept, score]) => ({ dept, score }))
      .sort((a, b) => b.score - a.score);

    return {
      kpis: {
        totalSpend: current,
        monthlyLimit,
        utilizationPct,
        budgetTrend: kpiTrends.budget_change,
        costPerUser: costAnalytics.cost_per_user,
        costPerUserTrend: kpiTrends.cost_per_user_change,
        activeUsers: costAnalytics.active_users,
        totalUsers: costAnalytics.total_users,
        toolsTrend: kpiTrends.tools_change,
      },
      monthlySpend,
      departmentCosts,
      topTools,
      insights: {
        unusedTools,
        expiringTools,
        unusedCost,
        budgetHeadroom,
      },
      mostUsedTools,
      deptActivity,
    };
  }, [analyticsQuery.data, toolsQuery.data, userToolsQuery.data, timeRange]);

  return {
    derived,
    loading:
      analyticsQuery.isLoading ||
      toolsQuery.isLoading ||
      userToolsQuery.isLoading,
    error: analyticsQuery.error || toolsQuery.error || userToolsQuery.error,
    timeRange,
    setTimeRange,
  };
}
