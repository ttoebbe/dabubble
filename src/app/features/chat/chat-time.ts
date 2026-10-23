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

/** Label of a date separator: "Heute", "Gestern" or e.g. `Dienstag, 14. Januar` (Figma `210:1106`). */
export function formatDay(timestamp: number, now: number): string {
  if (dayKey(timestamp) === dayKey(now)) {
    return 'Heute';
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dayKey(timestamp) === dayKey(yesterday.getTime())) {
    return 'Gestern';
  }
  const weekday = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(timestamp);
  return `${weekday}, ${formatDate(timestamp, now)}`;
}

/** Calendar date, e.g. `23. Oktober`; the year only follows when it is not the year of `now`. */
export function formatDate(timestamp: number, now: number): string {
  const sameYear = new Date(timestamp).getFullYear() === new Date(now).getFullYear();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat(
    'de-DE',
    sameYear ? options : { ...options, year: 'numeric' },
  ).format(timestamp);
}
