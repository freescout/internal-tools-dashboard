import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "../components/ui/StatusBadge";

describe("StatusBadge", () => {
  it("renders Active badge", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders Expiring badge", () => {
    render(<StatusBadge status="expiring" />);
    expect(screen.getByText("Expiring")).toBeInTheDocument();
  });

  it("renders Unused badge", () => {
    render(<StatusBadge status="unused" />);
    expect(screen.getByText("Unused")).toBeInTheDocument();
  });

  it("falls back to unused for unknown status", () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText("Unused")).toBeInTheDocument();
  });
});
