// Currency formatter — €2,450
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === 0) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatter — 1,234
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "—";
  return new Intl.NumberFormat("fr-FR").format(num);
};

// Date formatter — 12 Jan 2024
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Truncate long text — "Very long tool name..."
export const truncateText = (text, maxLength = 30) => {
  if (!text) return "—";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Sanitize tools — remove garbage data from API
export const sanitizeTools = (tools) => {
  const garbage = ["tutu", "titi", "lkjlkmj", "test", "xxx"];

  return tools.filter((tool) => {
    if (!tool.name || tool.name.trim().length === 0) return false;
    if (garbage.includes(tool.name.trim().toLowerCase())) return false;
    if (tool.name.trim().length > 50) return false;
    if (!tool.category && !tool.owner_department && !tool.vendor) return false;
    return true;
  });
};
