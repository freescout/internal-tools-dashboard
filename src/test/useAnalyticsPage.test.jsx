import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalyticsPage } from "../hooks/useAnalyticsPage";
import { fetchAnalytics, fetchAllTools, fetchUserTools } from "../lib/api";

vi.mock("../lib/api", () => ({
  fetchAnalytics: vi.fn(),
  fetchAllTools: vi.fn(),
  fetchUserTools: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const analyticsData = {
  budget_overview: {
    current_month_total: 17928,
    previous_month_total: 16000,
    monthly_limit: 30000,
  },
  kpi_trends: {
    budget_change: "+2%",
    cost_per_user_change: "+6",
    tools_change: "+9",
  },
  cost_analytics: {
    cost_per_user: 276,
    active_users: 65,
    total_users: 66,
  },
};

describe("useAnalyticsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchUserTools.mockResolvedValue([]);
  });

  it("derives KPI and cost data from analytics and tools", async () => {
    fetchAnalytics.mockResolvedValue(analyticsData);
    fetchAllTools.mockResolvedValue([
      {
        id: 1,
        name: "Jira",
        owner_department: "Communication",
        monthly_cost: "3200",
        status: "active",
      },
      {
        id: 2,
        name: "Slack",
        owner_department: "Engineering",
        monthly_cost: "1800.5",
        status: "unused",
      },
      {
        id: 3,
        name: "VSCode",
        owner_department: "Engineering",
        monthly_cost: 400,
        status: "expiring",
      },
    ]);
    fetchUserTools.mockResolvedValue([
      { user_id: 1, tool_id: 1, usage_frequency: "daily" },
      { user_id: 2, tool_id: 1, usage_frequency: "weekly" },
      { user_id: 3, tool_id: 2, usage_frequency: "monthly" },
      { user_id: 4, tool_id: 3, usage_frequency: "rarely" },
    ]);

    const { result } = renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.derived).not.toBeNull());

    expect(result.current.derived.kpis).toMatchObject({
      totalSpend: 17928,
      monthlyLimit: 30000,
      utilizationPct: 60,
      budgetTrend: "+2%",
      costPerUser: 276,
      costPerUserTrend: "+6",
      activeUsers: 65,
      totalUsers: 66,
      toolsTrend: "+9",
    });
    expect(result.current.derived.departmentCosts).toEqual([
      { name: "Communication", value: 3200 },
      { name: "Engineering", value: 2200.5 },
    ]);
    expect(result.current.derived.topTools.map((tool) => tool.name)).toEqual([
      "Jira",
      "Slack",
      "VSCode",
    ]);
    expect(result.current.derived.insights.unusedCost).toBe(1800.5);
    expect(result.current.derived.insights.expiringTools).toHaveLength(1);
    expect(result.current.derived.insights.budgetHeadroom).toBe(12072);
    expect(result.current.derived.mostUsedTools).toEqual([
      { name: "Jira", fullName: "Jira", score: 7 },
      { name: "Slack", fullName: "Slack", score: 2 },
      { name: "VSCode", fullName: "VSCode", score: 1 },
    ]);
    expect(result.current.derived.deptActivity).toEqual([
      { dept: "Communication", score: 7 },
      { dept: "Engineering", score: 3 },
    ]);
  });

  it("returns derived data when tools are empty", async () => {
    fetchAnalytics.mockResolvedValue(analyticsData);
    fetchAllTools.mockResolvedValue([]);

    const { result } = renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.derived).not.toBeNull());

    expect(result.current.derived.departmentCosts).toEqual([]);
    expect(result.current.derived.topTools).toEqual([]);
    expect(result.current.derived.insights.unusedTools).toEqual([]);
    expect(result.current.derived.insights.expiringTools).toEqual([]);
    expect(result.current.derived.insights.unusedCost).toBe(0);
  });

  it("changes monthly spend length when the time range changes", async () => {
    fetchAnalytics.mockResolvedValue(analyticsData);
    fetchAllTools.mockResolvedValue([]);

    const { result } = renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.derived).not.toBeNull());

    expect(result.current.derived.monthlySpend).toHaveLength(4);

    act(() => {
      result.current.setTimeRange(90);
    });
    expect(result.current.derived.monthlySpend).toHaveLength(6);

    act(() => {
      result.current.setTimeRange(365);
    });
    expect(result.current.derived.monthlySpend).toHaveLength(8);
  });
});

it("handles null tool name without throwing", async () => {
  fetchAnalytics.mockResolvedValue(analyticsData);
  fetchAllTools.mockResolvedValue([
    {
      id: 1,
      name: null,
      monthly_cost: 500,
      status: "active",
      owner_department: "Design",
    },
  ]);
  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(result.current.derived).not.toBeNull());
  expect(result.current.derived.topTools[0].fullName).toBe("Unnamed tool");
});

it("returns error state when analytics fetch fails", async () => {
  fetchAnalytics.mockRejectedValue(new Error("Network error"));
  fetchAllTools.mockResolvedValue([]);
  fetchUserTools.mockResolvedValue([]);
  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.error).toBeTruthy();
  expect(result.current.derived).toBeNull();
});

it("handles partial analytics response without throwing", async () => {
  fetchAnalytics.mockResolvedValue({});
  fetchAllTools.mockResolvedValue([]);

  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.derived).not.toBeNull());

  expect(result.current.derived.kpis.totalSpend).toBe(0);
  expect(result.current.derived.kpis.monthlyLimit).toBe(0);
  expect(result.current.derived.kpis.utilizationPct).toBe(0);
});

it("falls back to Other when owner_department is missing", async () => {
  fetchAnalytics.mockResolvedValue(analyticsData);
  fetchAllTools.mockResolvedValue([
    { id: 1, name: "Tool", monthly_cost: 500, status: "active" },
  ]);

  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.derived).not.toBeNull());

  expect(result.current.derived.departmentCosts[0].name).toBe("Other");
});

it("truncates tool names longer than 20 characters", async () => {
  fetchAnalytics.mockResolvedValue(analyticsData);
  fetchAllTools.mockResolvedValue([
    {
      id: 1,
      name: "A Very Long Tool Name That Exceeds Limit",
      monthly_cost: 500,
      status: "active",
      owner_department: "Engineering",
    },
  ]);

  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.derived).not.toBeNull());

  expect(result.current.derived.topTools[0].name).toBe("A Very Long Tool Nam…");
  expect(result.current.derived.topTools[0].fullName).toBe(
    "A Very Long Tool Name That Exceeds Limit",
  );
});

it("coerces string monthly_cost to number in unusedCost reduce", async () => {
  fetchAnalytics.mockResolvedValue(analyticsData);
  fetchAllTools.mockResolvedValue([
    {
      id: 1,
      name: "Slack",
      monthly_cost: "1200",
      status: "unused",
      owner_department: "Communication",
    },
    {
      id: 2,
      name: "Zoom",
      monthly_cost: "800",
      status: "unused",
      owner_department: "Engineering",
    },
  ]);

  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.derived).not.toBeNull());

  expect(result.current.derived.insights.unusedCost).toBe(2000);
});

it("derives usage analytics from user tools and skips unknown tool ids", async () => {
  fetchAnalytics.mockResolvedValue(analyticsData);
  fetchAllTools.mockResolvedValue([
    {
      id: 1,
      name: "Zoom",
      monthly_cost: 500,
      status: "active",
      owner_department: " communication ",
    },
    {
      id: 2,
      name: "A Very Long Tool Name For Usage Ranking",
      monthly_cost: 400,
      status: "active",
      owner_department: "engineering",
    },
  ]);
  fetchUserTools.mockResolvedValue([
    { user_id: 1, tool_id: 1, usage_frequency: "daily" },
    { user_id: 2, tool_id: 1, usage_frequency: "weekly" },
    { user_id: 3, tool_id: 2, usage_frequency: "monthly" },
    { user_id: 4, tool_id: 2, usage_frequency: "rarely" },
    { user_id: 5, tool_id: 999, usage_frequency: "daily" },
    { user_id: 6, tool_id: 2, usage_frequency: "unknown" },
  ]);

  const { result } = renderHook(() => useAnalyticsPage(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.derived).not.toBeNull());

  expect(result.current.derived.mostUsedTools).toEqual([
    { name: "Zoom", fullName: "Zoom", score: 7 },
    {
      name: "A Very Long Tool Na…",
      fullName: "A Very Long Tool Name For Usage Ranking",
      score: 4,
    },
  ]);
  expect(result.current.derived.deptActivity).toEqual([
    { dept: "Communication", score: 7 },
    { dept: "Engineering", score: 4 },
    { dept: "Other", score: 4 },
  ]);
});
