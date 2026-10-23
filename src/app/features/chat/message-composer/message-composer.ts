import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { UserService } from '../../../core/services/user.service';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { toMenuContacts } from '../../workspace/workspace-menu/menu-entries';
import { EmojiPicker } from '../emoji-picker/emoji-picker';
import { MentionMenu } from '../mention-menu/mention-menu';
import { MentionOption, filterOptions, findTrigger, optionId } from '../mention-trigger';

/** Longest message the Firestore rules accept (ttoebbe/dabubble#1). */
const MAX_LENGTH = 4000;

/** Gives every message box its own list id, so two boxes on one page do not clash. */
let nextListId = 0;

/**
 * Message box of a chat (Figma `61. Message box main`): text field, emoji picker, "@" button
 * and send button. Enter sends, Shift+Enter starts a new line, an empty message cannot be sent
 * (the button stays disabled). A failed `submit` shows its message below the box and keeps
 * the text. Whenever `focusKey` changes (the chat was switched) the field is emptied, so no
 * draft lands in the wrong chat, and gets the focus (DA checklist Schreiben US1).
 * Typing `@` or `#` opens a list of people or channels (DA checklist Schreiben US5) that
 * narrows while typing; arrow keys move, Enter or Tab insert, Escape closes it. The field is
 * its combobox, the list its listbox. While `disabled` is set (e.g. "Neue Nachricht" without
 * recipient) nothing can be sent.
 */
@Component({
  selector: 'app-message-composer',
  imports: [EmojiPicker, MentionMenu],
  templateUrl: './message-composer.html',
  styleUrl: './message-composer.scss',
})
export class MessageComposer {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly channels = inject(ChannelService);
  private readonly field = viewChild<ElementRef<HTMLTextAreaElement>>('field');
  readonly placeholder = input.required<string>();
  readonly focusKey = input.required<string>();
  readonly submit = input.required<(text: string) => Promise<void>>();
  readonly disabled = input(false);
  readonly maxLength = MAX_LENGTH;
  readonly listId = `mention-list-${nextListId++}`;
  readonly text = signal('');
  readonly caret = signal(0);
  readonly focused = signal(false);
  readonly dismissed = signal<number | null>(null);
  readonly error = signal('');
  readonly sending = signal(false);
  readonly canSend = computed(
    () => this.text().trim().length > 0 && !this.sending() && !this.disabled(),
  );
  private readonly trigger = computed(() => findTrigger(this.text(), this.caret()));
  private readonly people = computed<MentionOption[]>(() =>
    toMenuContacts(this.users.users(), this.auth.uid()).map((person) => ({
      id: person.id,
      label: person.name,
      avatarUrl: person.avatarUrl,
    })),
  );
  readonly menu = computed(() => {
    const trigger = this.trigger();
    if (!trigger || !this.focused() || this.dismissed() === trigger.start) {
      return null;
    }
    const channels = this.channels.channels().map(({ id, name }) => ({ id, label: name }));
    const options = filterOptions(trigger.char === '@' ? this.people() : channels, trigger.query);
    return options.length ? { char: trigger.char, options } : null;
  });
  readonly active = linkedSignal({ source: this.menu, computation: () => 0 });
  readonly activeId = computed(() => (this.menu() ? optionId(this.listId, this.active()) : null));

  /** Starts every chat with an empty field and the focus in it. */
  constructor() {
    effect(() => {
      this.focusKey();
      this.text.set('');
      this.caret.set(0);
      this.error.set('');
      this.field()?.nativeElement.focus();
    });
  }

  /** Follows the typed text, clears an old error and lets a list closed by Escape open again. */
  onInput(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value);
    this.dismissed.set(null);
    this.syncCaret();
    this.error.set('');
  }

  /** Remembers where the cursor is, which decides whether a mention is being typed. */
  syncCaret(): void {
    this.caret.set(this.field()?.nativeElement.selectionStart ?? 0);
  }

  /** Steers the open mention list by keyboard; otherwise Enter sends. */
  onKeydown(event: KeyboardEvent): void {
    if (event.isComposing) {
      return;
    }
    if (this.menu() && this.navigate(event)) {
      event.preventDefault();
    } else if (event.key === 'Enter') {
      this.onEnter(event);
    }
  }

  /** Sends on Enter; Shift+Enter keeps its meaning. */
  onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) {
      return;
    }
    event.preventDefault();
    this.send();
  }

  /** Inserts an emoji at the cursor, replacing a selection. */
  insertEmoji(emoji: string): void {
    this.replaceRange(emoji);
  }

  /** The "@" button: inserts `@` at the cursor, which opens the list of people. */
  insertAt(): void {
    const element = this.field()?.nativeElement;
    const before = element?.value.slice(0, element.selectionStart) ?? '';
    this.dismissed.set(null);
    this.replaceRange(before && !/\s$/.test(before) ? ' @' : '@');
  }

  /** Replaces the typed `@…` or `#…` with the chosen person or channel and a space. */
  pick(option: MentionOption): void {
    const trigger = this.trigger();
    if (trigger) {
      this.replaceRange(`${trigger.char}${option.label} `, trigger.start);
    }
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

  /** Arrow keys, Enter, Tab and Escape of the mention list; false for any other key. */
  private navigate(event: KeyboardEvent): boolean {
    const count = this.menu()?.options.length ?? 0;
    const step: Record<string, number | undefined> = { ArrowDown: 1, ArrowUp: -1 };
    if (event.key in step) {
      this.active.update((index) => (index + (step[event.key] ?? 0) + count) % count);
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      this.pick(this.menu()?.options[this.active()] as MentionOption);
    } else if (event.key === 'Escape') {
      this.dismissed.set(this.trigger()?.start ?? null);
    } else {
      return false;
    }
    return true;
  }

  /** Writes `value` over the selection (or from `from` to the cursor) and keeps the focus. */
  private replaceRange(value: string, from?: number): void {
    const element = this.field()?.nativeElement;
    if (!element) {
      return;
    }
    element.setRangeText(value, from ?? element.selectionStart, element.selectionEnd, 'end');
    this.text.set(element.value);
    this.syncCaret();
    element.focus();
  }
}
