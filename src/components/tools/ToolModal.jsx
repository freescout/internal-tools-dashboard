import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DEPARTMENTS = [
  "engineering",
  "design",
  "marketing",
  "sales",
  "hr",
  "finance",
  "operations",
  "product",
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

const EMPTY = {
  name: "",
  vendor: "",
  description: "",
  category: "",
  owner_department: "",
  status: "active",
  active_users_count: "",
  monthly_cost: "",
  website_url: "",
};

export default function ToolModal({
  open,
  onClose,
  onSubmit,
  initial,
  loading,
}) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.owner_department) e.owner_department = "Required";
    if (!form.category) e.category = "Required";
    if (form.active_users_count !== "" && isNaN(+form.active_users_count))
      e.active_users_count = "Must be a number";
    if (form.monthly_cost !== "" && isNaN(+form.monthly_cost))
      e.monthly_cost = "Must be a number";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      ...form,
      active_users_count:
        form.active_users_count !== "" ? +form.active_users_count : null,
      monthly_cost: form.monthly_cost !== "" ? +form.monthly_cost : null,
      updated_at: new Date().toISOString(),
    });
  };

  const isEdit = !!initial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              {isEdit ? "Edit Tool" : "Add New Tool"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {isEdit
                ? "Update tool information"
                : "Add a new SaaS tool to your catalog"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tool Name" error={errors.name} required>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Figma"
                className={inp(errors.name)}
              />
            </Field>
            <Field label="Vendor">
              <input
                value={form.vendor}
                onChange={(e) => set("vendor", e.target.value)}
                placeholder="e.g. Figma Inc."
                className={inp()}
              />
            </Field>
          </div>

          <Field label="Description (optional)">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description…"
              rows={2}
              className={inp() + " resize-none"}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" error={errors.category} required>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inp(errors.category)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Department" error={errors.owner_department} required>
              <select
                value={form.owner_department}
                onChange={(e) => set("owner_department", e.target.value)}
                className={inp(errors.owner_department)}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d === "hr" ? "HR" : capitalize(d)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Status">
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border capitalize transition-colors ${
                    form.status === s
                      ? statusActive(s)
                      : "border-border text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Active Users" error={errors.active_users_count}>
              <input
                type="number"
                min="0"
                value={form.active_users_count}
                onChange={(e) => set("active_users_count", e.target.value)}
                placeholder="0"
                className={inp(errors.active_users_count)}
              />
            </Field>
            <Field label="Monthly Cost (€)" error={errors.monthly_cost}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.monthly_cost}
                onChange={(e) => set("monthly_cost", e.target.value)}
                placeholder="0.00"
                className={inp(errors.monthly_cost)}
              />
            </Field>
          </div>

          <Field label="Website URL">
            <input
              type="url"
              value={form.website_url}
              onChange={(e) => set("website_url", e.target.value)}
              placeholder="https://…"
              className={inp()}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Tool"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-secondary">
        {label}
        {required && <span className="text-accent-pink ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-status-unused">{error}</p>}
    </div>
  );
}

const inp = (err) =>
  `w-full bg-background border ${
    err ? "border-status-unused/60" : "border-border"
  } rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors`;

const statusActive = (s) =>
  ({
    active: "border-status-active   text-status-active   bg-status-active/10",
    expiring:
      "border-status-expiring text-status-expiring bg-status-expiring/10",
    unused: "border-status-unused   text-status-unused   bg-status-unused/10",
  })[s];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
