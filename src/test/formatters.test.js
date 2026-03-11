import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  truncateText,
  sanitizeTools,
} from "../utils/formatters";

describe("formatCurrency", () => {
  it("formats number to euro currency", () => {
    expect(formatCurrency(2226)).toBe("€2,226");
  });

  it("returns — for zero", () => {
    expect(formatCurrency(0)).toBe("—");
  });

  it("returns — for null", () => {
    expect(formatCurrency(null)).toBe("—");
  });
});

describe("truncateText", () => {
  it("truncates long text", () => {
    expect(
      truncateText(
        "This is a very long tool name that should be truncated",
        20,
      ),
    ).toBe("This is a very long ...");
  });

  it("does not truncate short text", () => {
    expect(truncateText("Slack", 30)).toBe("Slack");
  });

  it("returns — for null", () => {
    expect(truncateText(null)).toBe("—");
  });
});

describe("sanitizeTools", () => {
  it("filters out garbage tool names", () => {
    const tools = [
      {
        name: "Slack",
        category: "communication",
        owner_department: "Engineering",
        vendor: "Slack",
      },
      {
        name: "tutu",
        category: "communication",
        owner_department: "Engineering",
        vendor: "test",
      },
      { name: "titi", category: null, owner_department: null, vendor: null },
    ];
    const result = sanitizeTools(tools);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Slack");
  });

  it("filters out tools with no department, category or vendor", () => {
    const tools = [
      {
        name: "ValidTool",
        category: "productivity",
        owner_department: "Engineering",
        vendor: "Microsoft",
      },
      {
        name: "FakeTool",
        category: null,
        owner_department: null,
        vendor: null,
      },
    ];
    const result = sanitizeTools(tools);
    expect(result).toHaveLength(1);
  });
});
