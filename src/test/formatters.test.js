import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  truncateText,
  sanitizeTools,
  formatNumber,
  formatDate,
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

describe("formatCurrency", () => {
  it("returns — for null", () => expect(formatCurrency(null)).toBe("—"));
  it("returns — for 0", () => expect(formatCurrency(0)).toBe("—"));
  it("formats a number", () => expect(formatCurrency(2450)).toContain("2,450"));
});

describe("formatNumber", () => {
  it("returns — for null", () => expect(formatNumber(null)).toBe("—"));
  it("returns — for undefined", () =>
    expect(formatNumber(undefined)).toBe("—"));
  it("formats a number", () => expect(formatNumber(1234)).toBeTruthy());
});

describe("formatDate", () => {
  it("returns — for empty string", () => expect(formatDate("")).toBe("—"));
  it("returns — for null", () => expect(formatDate(null)).toBe("—"));
  it("formats a valid date", () =>
    expect(formatDate("2024-01-12")).toContain("2024"));
});

describe("truncateText", () => {
  it("returns — for null", () => expect(truncateText(null)).toBe("—"));
  it("returns full text if short", () =>
    expect(truncateText("Hello")).toBe("Hello"));
  it("truncates long text", () =>
    expect(truncateText("a".repeat(31))).toContain("..."));
});

describe("sanitizeTools", () => {
  it("removes tools with no name", () =>
    expect(sanitizeTools([{ name: "" }])).toHaveLength(0));
  it("removes garbage names", () =>
    expect(sanitizeTools([{ name: "tutu" }])).toHaveLength(0));
  it("keeps valid tools", () =>
    expect(
      sanitizeTools([{ name: "Slack", category: "Communication" }]),
    ).toHaveLength(1));
});
