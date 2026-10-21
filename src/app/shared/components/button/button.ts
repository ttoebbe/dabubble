import { Component, input } from '@angular/core';

/** Visual variants of the shared button (Figma sets `10. Button primary`, `11. Button secondary`). */
export type ButtonVariant = 'primary' | 'secondary';

/** Native button types the shared button supports. */
export type ButtonType = 'button' | 'submit';

/**
 * Shared pill button. The label is projected; clicks bubble from the native
 * button to the host, so `(click)` works on `<app-button>` directly.
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
}
