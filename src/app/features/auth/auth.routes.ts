import { Routes } from '@angular/router';
import { LEGAL_ROUTES } from '../legal/legal.routes';

/** Routes of area A (Thomas): intro, login, sign-up, avatar, password reset, legal pages. */
export const AUTH_ROUTES: Routes = [
  {
    path: 'intro',
    title: 'DABubble',
    loadComponent: () => import('./intro/intro').then((module) => module.Intro),
  },
  {
    path: '',
    loadComponent: () => import('./auth-layout/auth-layout').then((module) => module.AuthLayout),
    children: [
      {
        path: 'login',
        title: 'Anmeldung – DABubble',
        loadComponent: () => import('./login/login').then((module) => module.Login),
      },
      {
        path: 'registrieren',
        title: 'Konto erstellen – DABubble',
        loadComponent: () => import('./sign-up/sign-up').then((module) => module.SignUp),
      },
    ],
  },
  ...LEGAL_ROUTES,
];
