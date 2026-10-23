import { dayKey, formatDate } from './chat-time';

/** Who created a channel and when, e.g. `Du hast diesen Channel heute erstellt.` */
export function describeCreation(
  creatorName: string,
  byMe: boolean,
  createdAt: number,
  now: number,
): string {
  if (byMe && dayKey(createdAt) === dayKey(now)) {
    return 'Du hast diesen Channel heute erstellt.';
  }
  const date = formatDate(createdAt, now);
  return byMe
    ? `Du hast diesen Channel am ${date} erstellt.`
    : `${creatorName} hat diesen Channel am ${date} erstellt.`;
}
