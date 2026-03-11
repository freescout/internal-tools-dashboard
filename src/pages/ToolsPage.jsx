import { useState, useMemo } from "react";
import { Plus, Trash2, Search, X } from "lucide-react";
import ToolsTable from "../components/tools/ToolsTable";
import ToolsSidebar from "../components/tools/ToolsSidebar";
import {
  useBulkDeleteTools,
  useCreateTool,
  useDeleteTool,
  useTools,
  useUpdateTool,
} from "../hooks/useTools";
import ToolModal from "../components/tools/ToolModal";
import ConfirmModal from "../components/tools/ConfirmModal";
import ToolDetailModal from "../components/tools/ToolDetailModal";

export default function ToolsPage() {
  const { data: tools = [], isLoading, isError } = useTools();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    category: "",
    costMin: "",
    costMax: "",
  });
  const [viewTarget, setViewTarget] = useState(null);

  const createMutation = useCreateTool();
  const updateMutation = useUpdateTool();
  const deleteMutation = useDeleteTool();
  const bulkDeleteMutation = useBulkDeleteTools();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const handleAdd = async (data) => {
    await createMutation.mutateAsync(data);
    setAddOpen(false);
  };

  const handleEdit = async (data) => {
    await updateMutation.mutateAsync({ id: editTarget.id, data });
    setEditTarget(null);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget.id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    await bulkDeleteMutation.mutateAsync([...selected]);
    setSelected(new Set());
    setBulkDeleteOpen(false);
  };

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.vendor?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.owner_department?.toLowerCase().includes(q);

      const matchDept =
        !filters.department || t.owner_department === filters.department;
      const matchStatus = !filters.status || t.status === filters.status;
      const matchCategory =
        !filters.category || t.category === filters.category;
      const matchCostMin =
        !filters.costMin || (t.monthly_cost ?? 0) >= +filters.costMin;
      const matchCostMax =
        !filters.costMax || (t.monthly_cost ?? 0) <= +filters.costMax;

      return (
        matchSearch &&
        matchDept &&
        matchStatus &&
        matchCategory &&
        matchCostMin &&
        matchCostMax
      );
    });
  }, [tools, search, filters]);

  const handleFiltersChange = (next) => {
    setFilters(next);
    setSelected(new Set());
  };

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelected(
      selected.size === filtered.length
        ? new Set()
        : new Set(filtered.map((t) => t.id)),
    );

  return (
    <div className="mx-auto max-w-6xl w-full px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Tools Catalog
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage your organisation's SaaS stack
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-status-unused/40 text-status-unused hover:bg-status-unused/10 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Delete {selected.size}
            </button>
          )}
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg transition-colors"
          >
            <Plus size={15} />
            Add Tool
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(new Set());
          }}
          placeholder="Search tools, vendors, categories…"
          className="w-full bg-surface border border-border rounded-lg pl-9 pr-9 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {(filters.status || filters.department || filters.category) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Active filters:</span>
          {[
            filters.status && { key: "status", label: filters.status },
            filters.department && {
              key: "department",
              label: filters.department,
            },
            filters.category && { key: "category", label: filters.category },
          ]
            .filter(Boolean)
            .map(({ key, label }) => (
              <span
                key={key}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent-purple/10 text-accent-purple border border-accent-purple/20 capitalize"
              >
                {label}
                <button
                  onClick={() => handleFiltersChange({ ...filters, [key]: "" })}
                  className="hover:text-white transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Body: sidebar + table */}
      <div className="flex gap-5 items-start">
        <ToolsSidebar
          filters={filters}
          onChange={handleFiltersChange}
          totalCount={tools.length}
          filteredCount={filtered.length}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        <div className="flex-1 min-w-0 bg-surface border border-border rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-text-muted">
              Loading…
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-sm text-status-unused">
              Failed to load tools.
            </div>
          ) : (
            <ToolsTable
              tools={filtered}
              showPagination
              selected={selected}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onView={(tool) => setViewTarget(tool)}
              onEdit={(tool) => setEditTarget(tool)}
              onDelete={(tool) => setDeleteTarget(tool)}
              onReset={() => {
                setFilters({
                  department: "",
                  status: "",
                  category: "",
                  costMin: "",
                  costMax: "",
                });
                setSearch("");
              }}
            />
          )}
        </div>
      </div>
      {/* Modals */}

      <ToolModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        loading={createMutation.isPending}
      />

      <ToolModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initial={editTarget}
        loading={updateMutation.isPending}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title="Delete tool"
        message={`"${deleteTarget?.name}" will be permanently deleted.`}
      />

      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        loading={bulkDeleteMutation.isPending}
        title="Delete selected tools"
        count={selected.size}
        confirmLabel={`Delete ${selected.size} tools`}
      />

      <ToolDetailModal
        open={!!viewTarget}
        tool={viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={(tool) => {
          setViewTarget(null);
          setEditTarget(tool);
        }}
        onDelete={(tool) => {
          setViewTarget(null);
          setDeleteTarget(tool);
        }}
      />
    </div>
  );
}
