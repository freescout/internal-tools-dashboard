import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Communication",
];
const STATUSES = ["active", "expiring", "unused"];
const CATEGORIES = [
  "Communication",
  "Development",
  "Design",
  "Productivity",
  "Security",
  "Analytics",
  "Sales & Marketing",
  "Project Management",
];

const formatLabel = (s) =>
  s === "hr" ? "HR" : s.charAt(0).toUpperCase() + s.slice(1);

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wider"
      >
        {title}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && <div className="px-4 pb-4 space-y-1">{children}</div>}
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
        active
          ? "bg-accent-purple/15 text-accent-purple border border-accent-purple/30"
          : "text-text-secondary hover:bg-white/5 hover:text-text-primary border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

export default function ToolsSidebar({
  filters,
  onChange,
  totalCount,
  filteredCount,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) {
  const activeCount = [
    filters.department,
    filters.status,
    filters.category,
    filters.costMin || filters.costMax,
  ].filter(Boolean).length;

  const clearAll = () =>
    onChange({
      department: "",
      status: "",
      category: "",
      costMin: "",
      costMax: "",
    });

  if (collapsed) {
    return (
      <div className="hidden md:block w-10 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg border border-border hover:bg-white/5 transition-colors text-text-muted hover:text-text-primary"
          title="Open filters"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>
    );
  }

  const sidebarContent = (
    <aside className="w-full md:w-56 shrink-0 bg-surface border border-border rounded-2xl overflow-hidden self-start md:sticky md:top-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-accent-purple font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onCloseMobile ?? onToggleCollapse}
            className="p-1 rounded text-text-muted hover:text-text-primary transition-colors"
            title="Close filters"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-2.5 border-b border-border bg-white/2">
        <p className="text-xs text-text-muted">
          {filteredCount === totalCount ? (
            <>
              <span className="text-text-primary font-medium">
                {totalCount}
              </span>{" "}
              tools
            </>
          ) : (
            <>
              <span className="text-text-primary font-medium">
                {filteredCount}
              </span>
              {" of "}
              <span className="text-text-primary font-medium">
                {totalCount}
              </span>
              {" tools"}
            </>
          )}
        </p>
      </div>

      {/* Status */}
      <Section title="Status">
        <FilterChip
          label="All statuses"
          active={!filters.status}
          onClick={() => onChange({ ...filters, status: "" })}
        />
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filters.status === s}
            onClick={() =>
              onChange({ ...filters, status: filters.status === s ? "" : s })
            }
          />
        ))}
      </Section>

      {/* Department */}
      <Section title="Department">
        <FilterChip
          label="All departments"
          active={!filters.department}
          onClick={() => onChange({ ...filters, department: "" })}
        />
        {DEPARTMENTS.map((d) => (
          <FilterChip
            key={d}
            label={formatLabel(d)}
            active={filters.department === d}
            onClick={() =>
              onChange({
                ...filters,
                department: filters.department === d ? "" : d,
              })
            }
          />
        ))}
      </Section>

      {/* Category */}
      <Section title="Category" defaultOpen={false}>
        <FilterChip
          label="All categories"
          active={!filters.category}
          onClick={() => onChange({ ...filters, category: "" })}
        />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={filters.category === c}
            onClick={() =>
              onChange({
                ...filters,
                category: filters.category === c ? "" : c,
              })
            }
          />
        ))}
      </Section>

      {/* Cost range */}
      <Section title="Monthly Cost" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted text-xs">
              €
            </span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.costMin}
              onChange={(e) =>
                onChange({ ...filters, costMin: e.target.value })
              }
              className="w-full bg-background border border-border rounded-lg pl-6 pr-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>
          <span className="text-text-muted text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted text-xs">
              €
            </span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.costMax}
              onChange={(e) =>
                onChange({ ...filters, costMax: e.target.value })
              }
              className="w-full bg-background border border-border rounded-lg pl-6 pr-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-purple transition-colors"
            />
          </div>
        </div>
      </Section>
    </aside>
  );

  if (mobileOpen) {
    return (
      <div className="fixed inset-0 z-40 md:hidden">
        <button
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onCloseMobile}
          aria-label="Close filters"
        />
        <div className="absolute inset-x-4 top-20 bottom-4 overflow-y-auto">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block">{sidebarContent}</div>
  );
}
