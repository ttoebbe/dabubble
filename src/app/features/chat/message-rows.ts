import { ChatMessage } from '../../core/models/message';
import { dayKey, formatDay } from './chat-time';

/** One line of the message list: a date separator or a message. */
export type ChatRow =
  | { readonly kind: 'day'; readonly key: string; readonly label: string }
  | { readonly kind: 'message'; readonly key: string; readonly message: ChatMessage };

/** Puts a date separator in front of the first message of each day. */
export function buildRows(messages: readonly ChatMessage[], now: number): ChatRow[] {
  const rows: ChatRow[] = [];
  let lastDay = '';
  for (const message of messages) {
    const day = dayKey(message.createdAt);
    if (day !== lastDay) {
      rows.push({ kind: 'day', key: `day-${day}`, label: formatDay(message.createdAt, now) });
      lastDay = day;
    }
    rows.push({ kind: 'message', key: message.id, message });
  }
  return rows;
}
