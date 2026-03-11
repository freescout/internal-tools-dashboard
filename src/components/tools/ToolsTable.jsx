import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import { formatCurrency, truncateText } from "../../utils/formatters";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Box,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Checkbox from "./Checkbox";
import { getToolIcon } from "../../utils/toolIcons";

const COLUMNS = [
  { key: "name", label: "Tool" },
  { key: "owner_department", label: "Department" },
  { key: "active_users_count", label: "Users" },
  { key: "monthly_cost", label: "Monthly Cost" },
  { key: "status", label: "Status" },
];

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
  onReset,
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
                <th className="px-3 py-3.5 w-10">
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
                <td colSpan={colSpan} className="px-3 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <Box size={28} className="opacity-30" />
                    <p className="text-sm">No tools match your filters</p>
                    {onReset && (
                      <button
                        onClick={onReset}
                        className="text-xs text-accent-purple hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((tool, i) => {
                const isSelected = hasSelection && selected.has(tool.id);
                const {
                  icon: Icon,
                  bg,
                  color,
                  url,
                } = getToolIcon(tool.name, tool.icon_url);
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
                      <td className="px-3 py-3.5 w-10">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => onToggleSelect(tool.id)}
                        />
                      </td>
                    )}

                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-7 w-7 rounded-md ${bg} flex items-center justify-center shrink-0`}
                        >
                          {url ? (
                            <img
                              src={url}
                              alt={tool.name}
                              className="h-4 w-4 object-contain rounded"
                            />
                          ) : (
                            <Icon size={14} className={color} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary leading-tight">
                            {truncateText(tool.name, 25)}
                          </p>
                          {tool.vendor && (
                            <p className="text-xs text-text-muted truncate max-w-30">
                              {tool.vendor}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="text-sm text-text-muted capitalize">
                        {tool.owner_department ?? "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="text-sm text-text-secondary">
                        {tool.active_users_count ?? "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="text-sm text-text-secondary">
                        {tool.monthly_cost
                          ? formatCurrency(tool.monthly_cost)
                          : "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <StatusBadge status={tool.status ?? "unused"} />
                    </td>

                    {(onView || onEdit || onDelete) && (
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          {onView && (
                            <button
                              onClick={() => onView(tool)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                              title="View details"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(tool)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent-blue transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(tool)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-status-unused transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
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
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} of{" "}
            {sorted.length} tools
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
