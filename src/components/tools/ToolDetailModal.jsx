import {
  X,
  ExternalLink,
  Users,
  DollarSign,
  Building2,
  Tag,
  Calendar,
} from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { formatCurrency } from "../../utils/formatters";
import { getToolIcon } from "../../utils/toolIcons";

export default function ToolDetailModal({
  open,
  tool,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!open || !tool) return null;

  const lastUpdated = tool.updated_at
    ? new Date(tool.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const costDelta =
    tool.monthly_cost && tool.previous_month_cost
      ? tool.monthly_cost - tool.previous_month_cost
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            {(() => {
              const {
                icon: Icon,
                bg,
                color,
                url,
              } = getToolIcon(tool.name, tool.icon_url);
              return (
                <div
                  className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
                >
                  {url ? (
                    <img
                      src={url}
                      alt={tool.name}
                      className="h-6 w-6 object-contain rounded"
                    />
                  ) : (
                    <Icon size={18} className={color} />
                  )}
                </div>
              );
            })()}
            <div>
              <h2 className="text-base font-semibold text-text-primary leading-tight">
                {tool.name}
              </h2>
              {tool.vendor && (
                <p className="text-xs text-text-muted mt-0.5">{tool.vendor}</p>
              )}
              <div className="mt-2">
                <StatusBadge status={tool.status ?? "unused"} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Description */}
        {tool.description && (
          <div className="px-6 py-3 border-b border-border">
            <p className="text-sm text-text-secondary leading-relaxed">
              {tool.description}
            </p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-px bg-border mx-6 my-4 rounded-xl overflow-hidden text-lg font-semibold">
          <Stat
            icon={DollarSign}
            label="Monthly Cost"
            color="text-accent-green"
          >
            <span className="text-sm font-semibold text-text-primary">
              {tool.monthly_cost ? formatCurrency(tool.monthly_cost) : "—"}
            </span>
            {costDelta !== null && (
              <span
                className={`text-xs ml-1.5 ${costDelta > 0 ? "text-status-unused" : "text-status-active"}`}
              >
                {costDelta > 0 ? "+" : ""}
                {formatCurrency(costDelta)}
              </span>
            )}
          </Stat>

          <Stat icon={Users} label="Active Users" color="text-accent-blue">
            <span className="text-sm font-semibold text-text-primary">
              {tool.active_users_count ?? "—"}
            </span>
          </Stat>

          <Stat icon={Building2} label="Department" color="text-accent-purple">
            <span className="text-sm font-semibold text-text-primary capitalize">
              {tool.owner_department ?? "—"}
            </span>
          </Stat>

          <Stat icon={Tag} label="Category" color="text-accent-pink">
            <span className="text-sm font-semibold text-text-primary">
              {tool.category ?? "—"}
            </span>
          </Stat>
        </div>

        {/* Meta */}
        <div className="px-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar size={11} />
            <span>Updated on {lastUpdated}</span>
          </div>
          {tool.website_url && (
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-accent-blue hover:underline"
            >
              Visit site <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={() => {
              onDelete(tool);
              onClose();
            }}
            className="px-4 py-2 text-sm border border-status-unused/40 text-status-unused hover:bg-status-unused/10 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => {
              onEdit(tool);
              onClose();
            }}
            className="px-5 py-2 text-sm font-medium bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg transition-colors"
          >
            Edit Tool
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, color, children }) {
  return (
    <div className="bg-surface px-4 py-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className={color} />
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className="flex items-baseline">{children}</div>
    </div>
  );
}
