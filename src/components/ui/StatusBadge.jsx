const styles = {
  active: {
    label: "Active",
    bg: "bg-emerald-500",
  },
  expiring: {
    label: "Expiring",
    bg: "bg-amber-500",
  },
  unused: {
    label: "Unused",
    bg: "bg-red-500",
  },
};

export default function StatusBadge({ status = "active" }) {
  const config = styles[status] || styles.unused;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium text-white ${config.bg}`}
    >
      {config.label}
    </span>
  );
}
