const statusConfig = {
  active: {
    label: "Active",
    dot: "bg-status-active",
    text: "text-status-active",
    bg: "bg-status-active/10",
  },
  expiring: {
    label: "Expiring",
    dot: "bg-status-expiring",
    text: "text-status-expiring",
    bg: "bg-status-expiring/10",
  },
  unused: {
    label: "Unused",
    dot: "bg-status-unused",
    text: "text-status-unused",
    bg: "bg-status-unused/10",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] ?? statusConfig.unused;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
