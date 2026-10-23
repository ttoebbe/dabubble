import { Component, ElementRef, inject, output, signal } from '@angular/core';

/**
 * "More" button of the reaction bar on own messages (Figma `52. Reaction bar` variant `option`,
 * `53B.`) with the menu "Nachricht bearbeiten" (`76. Edit message button`) below it. Closes after
 * the choice, on Escape and on a click elsewhere.
 */
@Component({
  selector: 'app-message-options',
  templateUrl: './message-options.html',
  styleUrl: './message-options.scss',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(keydown.escape)': 'open.set(false)',
  },
})
export class MessageOptions {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly editRequested = output();
  readonly open = signal(false);

  /** Reports the wish to edit and closes the menu. */
  requestEdit(): void {
    this.open.set(false);
    this.editRequested.emit();
  }

  /** Closes the menu when the click landed outside of it. */
  closeOnOutsideClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
