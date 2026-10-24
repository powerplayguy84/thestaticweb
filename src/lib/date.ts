/**
 * Parse date string into timestamp for reliable sorting
 * Supports DD-MM-YYYY, YYYY-MM-DD, and standard ISO formats
 */
export function parseDateTimestamp(dateString: string): number {
  if (!dateString) return 0;
  
  // Check if it's DD-MM-YYYY format
  const ddmmyyyyMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)).getTime();
  }

  // Check if it's YYYY-MM-DD format
  const yyyymmddMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)).getTime();
  }

  const parsed = new Date(dateString).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format date from DD-MM-YYYY or YYYY-MM-DD to a readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  // Check if it's DD-MM-YYYY format
  const ddmmyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(ddmmyyyyPattern);

  if (match) {
    const [, day, month, year] = match;
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Check if it's YYYY-MM-DD format
  const yyyymmddPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const matchIso = dateString.match(yyyymmddPattern);

  if (matchIso) {
    const [, year, month, day] = matchIso;
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Fallback: return as-is
  return dateString;
}
