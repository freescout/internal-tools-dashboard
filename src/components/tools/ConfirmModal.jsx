import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  count,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-status-unused/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-status-unused" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <p className="px-6 pb-5 text-sm text-text-secondary">
          {message ??
            `This will permanently delete ${
              count && count > 1 ? `${count} tools` : "this tool"
            }. This action cannot be undone.`}
        </p>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-status-unused hover:bg-status-unused/90 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
