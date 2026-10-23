import { Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { EmojiPicker } from '../emoji-picker/emoji-picker';

/** Longest message the Firestore rules accept (ttoebbe/dabubble#1). */
const MAX_LENGTH = 4000;

/**
 * Message box of a chat (Figma `61. Message box main`): text field, emoji picker and send
 * button. Enter sends, Shift+Enter starts a new line, an empty message cannot be sent
 * (the button stays disabled). A failed `submit` shows its message below the box and keeps
 * the text. Whenever `focusKey` changes (the chat was switched) the field is emptied, so no
 * draft lands in the wrong chat, and gets the focus (DA checklist Schreiben US1).
 */
@Component({
  selector: 'app-message-composer',
  imports: [EmojiPicker],
  templateUrl: './message-composer.html',
  styleUrl: './message-composer.scss',
})
export class MessageComposer {
  private readonly field = viewChild<ElementRef<HTMLTextAreaElement>>('field');
  readonly placeholder = input.required<string>();
  readonly focusKey = input.required<string>();
  readonly submit = input.required<(text: string) => Promise<void>>();
  readonly maxLength = MAX_LENGTH;
  readonly text = signal('');
  readonly error = signal('');
  readonly sending = signal(false);
  readonly canSend = computed(() => this.text().trim().length > 0 && !this.sending());

  /** Starts every chat with an empty field and the focus in it. */
  constructor() {
    effect(() => {
      this.focusKey();
      this.text.set('');
      this.error.set('');
      this.field()?.nativeElement.focus();
    });
  }

  /** Follows the typed text and clears an old error. */
  onInput(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value);
    this.error.set('');
  }

  /** Sends on Enter; Shift+Enter and the composition of an input method keep their meaning. */
  onEnter(event: Event): void {
    const key = event as KeyboardEvent;
    if (key.shiftKey || key.isComposing) {
      return;
    }
    event.preventDefault();
    this.send();
  }

  /** Inserts an emoji at the cursor, replacing a selection. */
  insertEmoji(emoji: string): void {
    const element = this.field()?.nativeElement;
    if (!element) {
      return;
    }
    element.setRangeText(emoji, element.selectionStart, element.selectionEnd, 'end');
    this.text.set(element.value);
    element.focus();
  }

  /** Sends the text; on success the field is empty again, on failure the text stays. */
  async send(): Promise<void> {
    if (!this.canSend()) {
      return;
    }
    this.sending.set(true);
    try {
      await this.submit()(this.text().trim());
      this.text.set('');
    } catch {
      this.error.set(AUTH_ERRORS.generic);
    }
    this.sending.set(false);
    this.field()?.nativeElement.focus();
  }
}
