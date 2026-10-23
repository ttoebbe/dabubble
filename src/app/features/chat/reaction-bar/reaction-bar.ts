import { Component, input, output } from '@angular/core';
import { CHAT_EMOJIS, ChatEmoji } from '../chat-emojis';
import { EmojiPicker } from '../emoji-picker/emoji-picker';

/**
 * Reaction bar of a message (Figma `52B. Reaction bar`, `53B.` without quick emojis): the
 * two quick emojis and the button that opens the emoji list. Reports the id of the chosen
 * emoji. Thread and "more" buttons of the design follow with threads and editing.
 */
@Component({
  selector: 'app-reaction-bar',
  imports: [EmojiPicker],
  templateUrl: './reaction-bar.html',
  styleUrl: './reaction-bar.scss',
})
export class ReactionBar {
  readonly quick = input<readonly ChatEmoji[]>([]);
  readonly openRight = input(false);
  readonly chosen = output<string>();

  /** Reports the emoji picked in the list by its id. */
  pickChar(char: string): void {
    const emoji = CHAT_EMOJIS.find((entry) => entry.char === char);
    if (emoji) {
      this.chosen.emit(emoji.id);
    }
  }
}
