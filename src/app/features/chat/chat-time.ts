/** Time of day as the chat shows it, e.g. `14:25 Uhr` (Figma `48. Messages main chat`). */
export function formatTime(timestamp: number): string {
  const time = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${time.format(timestamp)} Uhr`;
}

/** Same for all timestamps of one calendar day in the local time zone. */
export function dayKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Label of a date separator: "Heute" or e.g. `Dienstag, 14 Januar` (Figma `210:1106`). */
export function formatDay(timestamp: number, now: number): string {
  if (dayKey(timestamp) === dayKey(now)) {
    return 'Heute';
  }
  const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(timestamp);
  const date = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' });
  return `${weekday}, ${date.format(timestamp).replace('.', '')}`;
}
