import { useState, useMemo } from "react";
import { Plus, Trash2, Search, X } from "lucide-react";
import ToolsTable from "../components/tools/ToolsTable";
import { useTools } from "../hooks/useTools";

export default function ToolsPage() {
  const { data: tools = [], isLoading, isError } = useTools();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    if (!search) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.vendor?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.owner_department?.toLowerCase().includes(q),
    );
  }, [tools, search]);

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
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-status-unused/40 text-status-unused hover:bg-status-unused/10 rounded-lg transition-colors">
              <Trash2 size={14} />
              Delete {selected.size}
            </button>
          )}
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg transition-colors">
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

      {/* Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
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
            onView={(tool) => console.log("view", tool)}
            onEdit={(tool) => console.log("edit", tool)}
            onDelete={(tool) => console.log("delete", tool)}
          />
        )}
      </div>
    </div>
  );
}
