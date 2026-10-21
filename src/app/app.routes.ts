import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { CHAT_ROUTES } from './features/chat/chat.routes';

/**
 * Root routes. This file only combines the route lists of the two areas;
 * each area adds its own routes in its own file (docs/arbeitsteilung.md).
 */
export const routes: Routes = [...AUTH_ROUTES, ...CHAT_ROUTES];
