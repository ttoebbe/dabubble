import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

/**
 * Application-wide providers: global error listeners and the router. The router keeps the
 * route after `#` (e.g. `/#/login`), because the DA web space does not send unknown paths to
 * `index.html`; direct links and reloads work that way (decision Thomas 22.10.2026).
 */
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes, withHashLocation())],
};
