import { Component, input, output } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { MentionChar, MentionOption, optionId } from '../mention-trigger';

/**
 * List of people (`@`) or channels (`#`) that opens above the message box while a mention is
 * typed (Figma `21. Channels submenu`, appears by `#` searching). It is the listbox of the
 * message box, which keeps the focus and names the active option through
 * `aria-activedescendant`. A click picks an option. With `below` it opens under its field, as
 * for the address field of "Neue Nachricht".
 */
@Component({
  selector: 'app-mention-menu',
  imports: [Avatar],
  templateUrl: './mention-menu.html',
  styleUrl: './mention-menu.scss',
  host: { '[class.mention--below]': 'below()' },
})
export class MentionMenu {
  readonly listId = input.required<string>();
  readonly char = input.required<MentionChar>();
  readonly options = input.required<readonly MentionOption[]>();
  readonly active = input.required<number>();
  readonly below = input(false);
  readonly picked = output<MentionOption>();

  /** Id of the option at `index`, referenced by the message box. */
  optionId(index: number): string {
    return optionId(this.listId(), index);
  }
}
