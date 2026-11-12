import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

let nextDialogId = 0;

/**
 * Shared modal frame (Figma `37. Add channel`, `65. Profile view other users`): white card with
 * a heading, a close button and projected content. Built on the native `<dialog>`, which keeps
 * focus inside and closes on Escape or a press on the backdrop. The parent owns the `open` state and reacts to `closed`.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  readonly open = input(false);
  readonly heading = input.required<string>();
  /** From 768 px: top right below the header, square top-right corner (Figma `Profile view main`). */
  readonly corner = input(false);
  /** While set, a press on the backdrop reports `blocked` instead of closing (unsaved input). */
  readonly keepOpen = input(false);
  readonly closed = output<void>();
  readonly blocked = output<void>();
  readonly headingId = `dialog-heading-${++nextDialogId}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  /** Keeps the native dialog in line with the `open` input. */
  constructor() {
    effect(() => this.syncOpenState());
  }

  /** Asks the parent to close the dialog. */
  requestClose(): void {
    this.closed.emit();
  }

  /** Turns Escape into a close request, so the `open` input stays the single source. */
  handleCancel(event: Event): void {
    event.preventDefault();
    this.requestClose();
  }

  /** A press outside the card, i.e. on the backdrop, closes the dialog or reports `blocked`. */
  handleBackdrop(event: PointerEvent): void {
    const box = this.dialog().nativeElement.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (inside) {
      return;
    }
    if (this.keepOpen()) {
      this.blocked.emit();
    } else {
      this.requestClose();
    }
  }

  /** Opens or closes the native dialog to match the `open` input. */
  private syncOpenState(): void {
    const element = this.dialog().nativeElement;
    if (this.open() && !element.open) {
      element.showModal();
    } else if (!this.open() && element.open) {
      element.close();
    }
  }
}
