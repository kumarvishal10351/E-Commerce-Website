/** SECTION: Price formatting — INR display helpers for product cards and checkout */

// ─── Full currency format (e.g. ₹12,999) ───
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// ─── Compact format for large amounts (K / L suffixes) ───
export const formatINRCompact = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatINR(amount);
};
