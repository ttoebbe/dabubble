import { Routes } from '@angular/router';

/** Lazy-loads the placeholder view; the real views replace it route by route. */
const loadView = () =>
  import('./chat-placeholder/chat-placeholder').then((module) => module.ChatPlaceholder);

/**
 * Routes of area B (Yannic), mounted as children of `/workspace`: channel, direct message
 * (`:uid` is the other person) and new-message views in the primary outlet, the thread
 * of a message in the outlet `thread` (URL `/workspace/(channel/x//thread:thread/messageId)`).
 */
export const CHAT_ROUTES: Routes = [
  { path: 'channel/:channelId', loadComponent: loadView, data: { view: 'Channel' } },
  { path: 'dm/:uid', loadComponent: loadView, data: { view: 'Direktnachricht' } },
  { path: 'new-message', loadComponent: loadView, data: { view: 'Neue Nachricht' } },
  {
    path: 'thread/:messageId',
    outlet: 'thread',
    loadComponent: loadView,
    data: { view: 'Thread' },
  },
];
