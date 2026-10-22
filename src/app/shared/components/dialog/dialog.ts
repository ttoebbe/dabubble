import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

let nextDialogId = 0;

/**
 * Shared modal frame (Figma `37. Add channel`, `65. Profile view other users`): white card with
 * a heading, a close button and projected content. Built on the native `<dialog>`, which keeps
 * focus inside and closes on Escape. The parent owns the `open` state and reacts to `closed`.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  readonly open = input(false);
  readonly heading = input.required<string>();
  readonly closed = output<void>();
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
