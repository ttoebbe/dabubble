import { Component, input } from '@angular/core';

/** How long a toast stays before the page moves on (Figma: after 1.3 s). */
const TOAST_DURATION_MS = 1300;

/** Resolves once a toast has been on screen long enough to be read. */
export function waitForToast(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, TOAST_DURATION_MS));
}

/**
 * Success message of the account pages (Figma `03B-Overlay One` 182:281, `04B-Overlay Two`
 * 182:544, `05B-Overlay Three` 182:546; mobile 609:17301, 609:17303, 609:17308). It slides in
 * at the bottom right; the page navigates on after `waitForToast()`.
 */
@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  host: { role: 'status' },
})
export class Toast {
  readonly message = input.required<string>();
  readonly withSendIcon = input(false);
}
