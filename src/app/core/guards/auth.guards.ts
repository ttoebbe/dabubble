import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Lets only signed-in people into the workspace; everybody else lands on the login. */
export const signedInGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return (await auth.isSignedIn()) || router.createUrlTree(['/login']);
};

/** Sends signed-in people from the account pages straight to the workspace. */
export const signedOutGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return !(await auth.isSignedIn()) || router.createUrlTree(['/workspace']);
};
