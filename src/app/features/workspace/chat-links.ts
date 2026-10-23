import { PRIMARY_OUTLET, UrlTree } from '@angular/router';

/** Route of the workspace frame; the chat views of area B hang below it (`chat.routes.ts`). */
const WORKSPACE_PATH = 'workspace';

/** Route of a channel view of area B. */
export function channelLink(channelId: string): string[] {
  return ['/', WORKSPACE_PATH, 'channel', channelId];
}

/** Route of the direct message with a person; `uid` is the other person. */
export function directMessageLink(uid: string): string[] {
  return ['/', WORKSPACE_PATH, 'dm', uid];
}

/**
 * Route of a chat with the thread of one of its messages open next to it, e.g. for a search hit.
 * `chat` is the channel id or the uid of the other person, `conversationId` the channel id or the
 * id of the direct chat.
 */
export function messageLink(
  kind: 'channel' | 'dm',
  chat: string,
  conversationId: string,
  messageId: string,
): unknown[] {
  const thread = ['thread', kind, conversationId, messageId];
  return ['/', WORKSPACE_PATH, { outlets: { primary: [kind, chat], thread } }];
}

/** Route of "Neue Nachricht". */
export function newMessageLink(): string[] {
  return ['/', WORKSPACE_PATH, 'new-message'];
}

/**
 * Channel id or uid of the chat that is open, e.g. `abc` for `/workspace/channel/abc`, also when
 * a thread is open next to it (`/workspace/(channel/abc//thread:thread/x)`); otherwise null.
 */
export function activeEntryOf(tree: UrlTree): string | null {
  const workspace = tree.root.children[PRIMARY_OUTLET];
  const chat = workspace?.children[PRIMARY_OUTLET];
  const [area, kind, id] = [...(workspace?.segments ?? []), ...(chat?.segments ?? [])].map(
    (segment) => segment.path,
  );
  return area === WORKSPACE_PATH && (kind === 'channel' || kind === 'dm') && id ? id : null;
}
