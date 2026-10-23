import { Component, ElementRef, inject, output, signal } from '@angular/core';
import { CHAT_EMOJIS } from '../chat-emojis';

/**
 * Emoji button of the message box (Figma `60. Icons text box aux`, `sentiment_satisfied`)
 * with the list of emojis above it. Closes after a pick, on Escape and on a click elsewhere.
 */
@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.html',
  styleUrl: './emoji-picker.scss',
  host: { '(document:click)': 'closeOnOutsideClick($event)', '(keydown.escape)': 'close()' },
})
export class EmojiPicker {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly picked = output<string>();
  readonly open = signal(false);
  readonly emojis = CHAT_EMOJIS;

  /** Shows or hides the list. */
  toggle(): void {
    this.open.update((open) => !open);
  }

  /** Hides the list. */
  close(): void {
    this.open.set(false);
  }

  /** Reports the chosen emoji and hides the list. */
  pick(emoji: string): void {
    this.picked.emit(emoji);
    this.close();
  }

  /** Hides the list when the click landed outside of the picker. */
  closeOnOutsideClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}
