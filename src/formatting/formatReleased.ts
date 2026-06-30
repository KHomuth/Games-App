/** ISO date (YYYY-MM-DD) to DD.MM.YYYY, matching card display across the app. */
export function formatReleased(iso: string | null, tba = false): string {
  if (tba) return 'TBA';
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}
