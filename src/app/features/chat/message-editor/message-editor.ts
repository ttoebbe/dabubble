import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { EmojiPicker } from '../emoji-picker/emoji-picker';

/** Longest message the Firestore rules accept (ttoebbe/dabubble#1). */
const MAX_LENGTH = 4000;

/** Gives every editor its own error id, so a chat and its thread can edit at the same time. */
let nextEditorId = 0;

/**
 * Edit mode of an own message (Figma `48. Messages main chat` variant `Edit message`
 * `1823:16282`, `61. Message box main` `1817:20369`, icons `60B.`): the text in a box with the
 * emoji picker, "Abbrechen" and "Speichern". The field gets the focus with the cursor at the
 * end. Enter saves, Shift+Enter starts a new line, Escape cancels. "Speichern" works once the
 * text is not empty and differs from the stored one; a failed `save` shows a message and keeps
 * the edit open.
 */
@Component({
  selector: 'app-message-editor',
  imports: [Button, EmojiPicker],
  templateUrl: './message-editor.html',
  styleUrl: './message-editor.scss',
})
export class MessageEditor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly field = viewChild.required<ElementRef<HTMLTextAreaElement>>('field');
  readonly text = input.required<string>();
  readonly save = input.required<(text: string) => Promise<void>>();
  readonly closed = output();
  readonly maxLength = MAX_LENGTH;
  readonly errorId = `message-editor-error-${nextEditorId++}`;
  readonly draft = linkedSignal(() => this.text());
  readonly saving = signal(false);
  readonly error = signal('');
  readonly canSave = computed(() => {
    const draft = this.draft().trim();
    return draft.length > 0 && draft !== this.text() && !this.saving();
  });

  /** Puts the focus into the field, with the cursor after the text, and shows the whole box. */
  constructor() {
    afterNextRender(() => {
      const element = this.field().nativeElement;
      element.focus({ preventScroll: true });
      element.setSelectionRange(element.value.length, element.value.length);
      this.host.nativeElement.scrollIntoView({ block: 'nearest' });
    });
  }

  /** Follows the typed text and clears an old error. */
  onInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
    this.error.set('');
  }

  /** Enter saves, Shift+Enter keeps its meaning, Escape cancels. */
  onKeydown(event: KeyboardEvent): void {
    if (event.isComposing) {
      return;
    }
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.closed.emit();
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  /** Inserts an emoji at the cursor, replacing a selection. */
  insertEmoji(emoji: string): void {
    const element = this.field().nativeElement;
    element.setRangeText(emoji, element.selectionStart, element.selectionEnd, 'end');
    this.draft.set(element.value);
    element.focus();
  }

  /** Stores the new text and leaves the edit mode; a failure keeps it open with a message. */
  async submit(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    this.saving.set(true);
    try {
      await this.save()(this.draft().trim());
      this.closed.emit();
    } catch {
      this.error.set(AUTH_ERRORS.generic);
    }
    this.saving.set(false);
  }
}
