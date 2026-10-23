import { Routes } from '@angular/router';

/** Lazy-loads the placeholder view; the real views replace it route by route. */
const loadView = () =>
  import('./chat-placeholder/chat-placeholder').then((module) => module.ChatPlaceholder);

/** Lazy-loads the channel view. */
const loadChannel = () =>
  import('./channel-chat/channel-chat').then((module) => module.ChannelChat);

/** Lazy-loads the direct message view. */
const loadDirectChat = () =>
  import('./direct-chat/direct-chat').then((module) => module.DirectChat);

/** Lazy-loads the thread view. */
const loadThread = () =>
  import('../thread/thread-view/thread-view').then((module) => module.ThreadView);

/**
 * Routes of area B (Yannic), mounted as children of `/workspace`: channel, direct message
 * (`:uid` is the other person) and new-message views in the primary outlet, the thread
 * of a message in the outlet `thread`. `kind` is `channel` or `dm`, `conversationId` the
 * channel id or the id of the direct chat (ttoebbe/dabubble#1), e.g.
 * `/workspace/(channel/x//thread:thread/channel/x/messageId)`.
 */
export const CHAT_ROUTES: Routes = [
  { path: 'channel/:channelId', loadComponent: loadChannel },
  { path: 'dm/:uid', loadComponent: loadDirectChat },
  { path: 'new-message', loadComponent: loadView, data: { view: 'Neue Nachricht' } },
  {
    path: 'thread/:kind/:conversationId/:messageId',
    outlet: 'thread',
    loadComponent: loadThread,
  },
];
