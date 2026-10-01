export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function formatKickoff(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
}

export function formatDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.round(
    (new Date(d.toDateString()).getTime() - new Date(today.toDateString()).getTime()) / 86_400_000,
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: diff < -300 ? 'numeric' : undefined });
}

export function formatStat(v: number, format: 'number' | 'percent' | 'decimal' = 'number') {
  if (format === 'percent') return `${Math.round(v)}%`;
  if (format === 'decimal') return String(+v.toFixed(2));
  return String(v);
}

export function timeAgo(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`;
  const h = Math.round(minutes / 60);
  return `${h} h ago`;
}
