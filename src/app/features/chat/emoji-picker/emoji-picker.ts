import {
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CHAT_EMOJIS } from '../chat-emojis';

/**
 * Emoji button of the message box (Figma `60. Icons text box aux`, `sentiment_satisfied`)
 * with the list of emojis above it. As `reaction` it is the add-reaction button of the
 * reaction bar (Figma `59. add reaction`) and the list opens below it, to the left of the
 * button (`openRight`: to the right on wide screens). Closes after a pick, on Escape and on
 * a click elsewhere; a list that opens out of view is scrolled into view. While `disabled`
 * the button cannot be used and the list stays closed.
 */
@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.html',
  styleUrl: './emoji-picker.scss',
  host: {
    '[class.picker--reaction]': 'reaction()',
    '[class.picker--open-right]': 'openRight()',
    '(document:click)': 'closeOnOutsideClick($event)',
    '(keydown.escape)': 'close()',
  },
})
export class EmojiPicker {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly reaction = input(false);
  readonly openRight = input(false);
  readonly disabled = input(false);
  readonly picked = output<string>();
  readonly open = signal(false);
  readonly emojis = CHAT_EMOJIS;

  /** Scrolls the list into view when it opens. */
  constructor() {
    afterRenderEffect(() => this.panel()?.nativeElement.scrollIntoView({ block: 'nearest' }));
  }

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
