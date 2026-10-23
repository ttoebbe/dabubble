import { Component, input, output } from '@angular/core';
import { CHAT_EMOJIS, ChatEmoji } from '../chat-emojis';
import { EmojiPicker } from '../emoji-picker/emoji-picker';
import { MessageOptions } from '../message-options/message-options';

/**
 * Reaction bar of a message (Figma `52B. Reaction bar`, `53B.` without quick emojis): the
 * two quick emojis and the button that opens the emoji list. Reports the id of the chosen
 * emoji. With `threadable` the thread button (Figma comment icon, "Thread starten") follows;
 * with `editable` (own messages) the "more" button with "Nachricht bearbeiten".
 */
@Component({
  selector: 'app-reaction-bar',
  imports: [EmojiPicker, MessageOptions],
  templateUrl: './reaction-bar.html',
  styleUrl: './reaction-bar.scss',
})
export class ReactionBar {
  readonly quick = input<readonly ChatEmoji[]>([]);
  readonly openRight = input(false);
  readonly threadable = input(false);
  readonly editable = input(false);
  readonly chosen = output<string>();
  readonly threadStarted = output();
  readonly editRequested = output();

  /** Reports the emoji picked in the list by its id. */
  pickChar(char: string): void {
    const emoji = CHAT_EMOJIS.find((entry) => entry.char === char);
    if (emoji) {
      this.chosen.emit(emoji.id);
    }
  }
}
