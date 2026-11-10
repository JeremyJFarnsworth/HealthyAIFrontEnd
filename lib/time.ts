const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** "Just now", "2h ago", "Yesterday", "Nov 2". Backend timestamps are UTC. */
export function relativeTime(iso: string, now = new Date()): string {
  // SQLite drops the tz suffix; treat naive timestamps as UTC.
  const d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`);
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (d >= startOfToday) return `${Math.floor(mins / 60)}h ago`;
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  if (d >= startOfYesterday) return "Yesterday";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
