import { Routes } from '@angular/router';
import { LEGAL_ROUTES } from '../legal/legal.routes';

/** Routes of area A (Thomas): intro, login, sign-up, avatar, password reset, legal pages. */
export const AUTH_ROUTES: Routes = [
  {
    path: 'intro',
    title: 'DABubble',
    loadComponent: () => import('./intro/intro').then((module) => module.Intro),
  },
  ...LEGAL_ROUTES,
];
