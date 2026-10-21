import { Routes } from '@angular/router';

/** Routes of area A for the legal pages, reachable without login. */
export const LEGAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./legal-layout/legal-layout').then((module) => module.LegalLayout),
    children: [
      {
        path: 'impressum',
        title: 'Impressum – DABubble',
        loadComponent: () => import('./imprint/imprint').then((module) => module.Imprint),
      },
      {
        path: 'datenschutz',
        title: 'Datenschutz – DABubble',
        loadComponent: () =>
          import('./privacy-policy/privacy-policy').then((module) => module.PrivacyPolicy),
      },
    ],
  },
];
