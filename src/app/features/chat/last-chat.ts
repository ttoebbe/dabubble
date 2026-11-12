import { DOCUMENT, effect, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FIREBASE_AUTH } from '../../core/services/firebase';

/** Prefix of the browser storage key for the last opened chat, one entry per person. */
const LAST_CHAT_KEY = 'dabubble.lastChat.';

/** The mobile breakpoint of `_breakpoints.scss`, as in `workspace/mobile-viewport.ts`. */
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Remembers the chat a view shows (e.g. `channel/abc` or `dm/xyz`) in the browser, so the
 * next visit of the workspace opens it again. Call it in an injection context.
 */
export function rememberChat(path: () => string): void {
  const auth = inject(AuthService);
  effect(() => {
    const uid = auth.uid();
    if (uid && path()) {
      localStorage.setItem(LAST_CHAT_KEY + uid, path());
    }
  });
}

/**
 * Never leaves the chat area empty: entering the workspace (after the login or a reload)
 * opens the last chat, at first the chat with oneself. On mobile, `/workspace` reached from
 * inside the workspace stays the menu page (back arrow thread → chat → menu).
 */
export const openStartChat: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(FIREBASE_AUTH);
  const mobile = inject(DOCUMENT).defaultView?.matchMedia(MOBILE_QUERY).matches ?? false;
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;
  if (!uid || (mobile && router.url.startsWith('/workspace'))) {
    return true;
  }
  const last = localStorage.getItem(LAST_CHAT_KEY + uid) ?? `dm/${uid}`;
  return router.parseUrl(`/workspace/${last}`);
};
