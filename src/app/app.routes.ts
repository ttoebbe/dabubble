import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { WORKSPACE_ROUTES } from './features/workspace/workspace.routes';

/**
 * Root routes. This file only combines the route lists of the two areas; each area adds
 * its own routes in its own file (docs/arbeitsteilung.md). The routes of area B are
 * mounted inside the workspace frame. Until login exists, the start page is the workspace.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'workspace' },
  ...AUTH_ROUTES,
  ...WORKSPACE_ROUTES,
];
