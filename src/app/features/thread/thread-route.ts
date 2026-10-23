import { ConversationKind } from '../../core/services/message.service';

/** Navigation commands that show the thread of a message in the outlet `thread` (`chat.routes.ts`). */
export function threadCommands(
  kind: ConversationKind,
  conversationId: string,
  messageId: string,
): unknown[] {
  return [{ outlets: { thread: ['thread', kind, conversationId, messageId] } }];
}

/** Navigation commands that close the outlet `thread`. */
export function closeThreadCommands(): unknown[] {
  return [{ outlets: { thread: null } }];
}
