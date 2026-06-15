/**
 * Title match: every word in the query must appear in the game name (case-insensitive).
 * Stricter than RAWG's default fuzzy search (e.g. "grand" won't match "Gran Turismo").
 */
export function matchesTitleQuery(name: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const words = q.split(/\s+/).filter(Boolean);
  const normalized = name.toLowerCase();
  return words.every((word) => normalized.includes(word));
}
