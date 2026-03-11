import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConfirmModal from "../components/tools/ConfirmModal";

describe("ConfirmModal", () => {
  it("does not render when closed", () => {
    render(
      <ConfirmModal open={false} onClose={() => {}} onConfirm={() => {}} />,
    );
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("renders title and message when open", () => {
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="This will delete Slack."
      />,
    );
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This will delete Slack.")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    render(<ConfirmModal open={true} onClose={onClose} onConfirm={() => {}} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when Delete is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal open={true} onClose={() => {}} onConfirm={onConfirm} />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("shows custom confirmLabel", () => {
    render(
      <ConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        confirmLabel="Delete 3 tools"
      />,
    );
    expect(screen.getByText("Delete 3 tools")).toBeInTheDocument();
  });
});
