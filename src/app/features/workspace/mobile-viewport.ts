import { DOCUMENT, DestroyRef, Signal, inject, signal } from '@angular/core';

/** The mobile breakpoint of `_breakpoints.scss`: below 768 px. */
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Whether the window shows the mobile layout, live. Call it in an injection context; the
 * listener ends together with the caller.
 */
export function watchMobile(): Signal<boolean> {
  const media = inject(DOCUMENT).defaultView?.matchMedia(MOBILE_QUERY);
  const mobile = signal(media?.matches ?? false);
  if (media) {
    const update = () => mobile.set(media.matches);
    media.addEventListener('change', update);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change', update));
  }
  return mobile.asReadonly();
}
