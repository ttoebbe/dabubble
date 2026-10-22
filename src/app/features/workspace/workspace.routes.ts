import { Routes } from '@angular/router';
import { CHAT_ROUTES } from '../chat/chat.routes';

/**
 * Routes of area A (Thomas) for the workspace frame. The routes of area B are mounted
 * as children: chat views in the primary outlet, threads with `outlet: 'thread'`.
 */
export const WORKSPACE_ROUTES: Routes = [
  {
    path: 'workspace',
    title: 'DABubble',
    loadComponent: () =>
      import('./workspace-layout/workspace-layout').then((module) => module.WorkspaceLayout),
    children: CHAT_ROUTES,
  },
];
