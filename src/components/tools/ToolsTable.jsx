import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import { formatCurrency, truncateText } from "../../utils/formatters";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Palette,
  Zap,
  FileText,
  Brush,
  Video,
  Wrench,
  Briefcase,
  Box,
  Shield,
  Building2,
  Terminal,
  Layout,
  Eye,
} from "lucide-react";
import Checkbox from "./Checkbox";

const COLUMNS = [
  { key: "name", label: "Tool" },
  { key: "category", label: "Category" },
  { key: "owner_department", label: "Department" },
  { key: "active_users_count", label: "Users" },
  { key: "monthly_cost", label: "Monthly Cost" },
  { key: "status", label: "Status" },
];

const toolIconMap = {
  slack: {
    icon: MessageSquare,
    bg: "bg-purple-500/10",
    color: "text-purple-400",
  },
  figma: { icon: Palette, bg: "bg-pink-500/10", color: "text-pink-400" },
  github: { icon: Zap, bg: "bg-yellow-500/10", color: "text-yellow-400" },
  notion: { icon: FileText, bg: "bg-gray-500/10", color: "text-gray-400" },
  "adobe cc": { icon: Brush, bg: "bg-red-500/10", color: "text-red-400" },
  zoom: { icon: Video, bg: "bg-blue-500/10", color: "text-blue-400" },
  jira: { icon: Wrench, bg: "bg-blue-600/10", color: "text-blue-500" },
  salesforce: { icon: Briefcase, bg: "bg-cyan-500/10", color: "text-cyan-400" },
  "mueller security": {
    icon: Shield,
    bg: "bg-green-500/10",
    color: "text-green-400",
  },
  "johnston inc securite": {
    icon: Building2,
    bg: "bg-orange-500/10",
    color: "text-orange-400",
  },
  nvim: { icon: Terminal, bg: "bg-emerald-500/10", color: "text-emerald-400" },
  "office 365": { icon: Layout, bg: "bg-red-500/10", color: "text-red-400" },
};

const getToolIcon = (name) => {
  const key = name?.toLowerCase().trim();
  return (
    toolIconMap[key] ?? {
      icon: Box,
      bg: "bg-accent-purple/10",
      color: "text-accent-purple",
    }
  );
};

const ITEMS_PER_PAGE = 10;

export default function ToolsTable({
  tools = [],
  showPagination = false,
  selected, // Set<id> — if passed, enables checkboxes
  onToggleSelect, // (id) => void
  onToggleSelectAll, // () => void
  onView,
  onEdit,
  onDelete,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const hasSelection = selected instanceof Set;

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sorted = [...tools].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    if (typeof av === "number" && typeof bv === "number")
      return sortOrder === "asc" ? av - bv : bv - av;
    return sortOrder === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = showPagination
    ? sorted.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : sorted;

  const allPageSelected =
    hasSelection &&
    paginated.length > 0 &&
    paginated.every((t) => selected.has(t.id));
  const someSelected =
    hasSelection &&
    paginated.some((t) => selected.has(t.id)) &&
    !allPageSelected;

  const colSpan =
    COLUMNS.length +
    (hasSelection ? 1 : 0) +
    (onView || onEdit || onDelete ? 1 : 0);

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {hasSelection && (
                <th className="px-4 py-3 w-10">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={someSelected}
                    onChange={onToggleSelectAll}
                  />
                </th>
              )}
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key ? (
                      sortOrder === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      )
                    ) : (
                      <ChevronUp size={12} className="opacity-20" />
                    )}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <Box size={28} className="opacity-30" />
                    <span className="text-sm">No tools found</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((tool, i) => {
                const isSelected = hasSelection && selected.has(tool.id);
                const { icon: Icon, bg, color } = getToolIcon(tool.name);
                return (
                  <tr
                    key={tool.id}
                    className={`border-b transition-colors ${
                      i === paginated.length - 1
                        ? "border-b-0"
                        : "border-border/50"
                    } ${isSelected ? "bg-accent-purple/5" : "hover:bg-white/5"}`}
                  >
                    {hasSelection && (
                      <td className="px-4 py-3 w-10">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleSelect(tool.id)}
                        />
                      </td>
                    )}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-7 w-7 rounded-md ${bg} flex items-center justify-center shrink-0`}
                        >
                          <Icon size={14} className={color} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary leading-tight">
                            {truncateText(tool.name, 25)}
                          </p>
                          {tool.vendor && (
                            <p className="text-xs text-text-muted">
                              {tool.vendor}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-secondary border border-border">
                        {tool.category ?? "—"}
                      </span>
                      {/*                       <span className="text-xs px-2 py-1 rounded-md bg-surface border border-border text-text-secondary">
                        {tool.category}
                      </span> */}
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary capitalize">
                        {tool.owner_department ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        {tool.active_users_count ?? "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-text-secondary">
                        {tool.monthly_cost
                          ? formatCurrency(tool.monthly_cost)
                          : "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={tool.status ?? "unused"} />
                    </td>

                    {(onView || onEdit || onDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-xs">
                          {onView && (
                            <button
                              onClick={() => onView(tool)}
                              className="text-text-muted hover:text-text-primary transition-colors"
                              title="View details"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(tool)}
                              className="text-xs text-accent-blue hover:underline"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(tool)}
                              className="text-xs text-status-unused hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-text-muted">
            Page {currentPage} of {totalPages} · {sorted.length} tools
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} className="text-text-secondary" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-border hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} className="text-text-secondary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
