import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KPICard from "../components/ui/KPICard";
import { TrendingUp } from "lucide-react";

describe("KPICard", () => {
  it("renders title and value", () => {
    render(
      <KPICard
        title="Monthly Budget"
        value="€17,928"
        trend="+2%"
        trendUp={true}
        icon={TrendingUp}
        variant="success"
      />,
    );
    expect(screen.getByText("Monthly Budget")).toBeInTheDocument();
    expect(screen.getByText("€17,928")).toBeInTheDocument();
  });

  it("renders trend value", () => {
    render(
      <KPICard
        title="Active Tools"
        value="65"
        trend="+9"
        trendUp={true}
        icon={TrendingUp}
        variant="purple"
      />,
    );
    expect(screen.getByText("+9")).toBeInTheDocument();
  });

  it("renders subValue when provided", () => {
    render(
      <KPICard
        title="Monthly Budget"
        value="€17,928"
        subValue="€30k"
        trend="+2%"
        trendUp={true}
        icon={TrendingUp}
        variant="success"
      />,
    );
    expect(screen.getByText("/€30k")).toBeInTheDocument();
  });
});
