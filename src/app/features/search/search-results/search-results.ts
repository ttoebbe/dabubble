import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { MessageFeed } from '../../chat/message-feed';
import { optionId } from '../../chat/mention-trigger';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { HitGroup, SearchHit } from '../search-hits';

/** A group with the list index of its first hit, for `aria-activedescendant`. */
interface IndexedGroup extends HitGroup {
  readonly start: number;
}

/**
 * Hits of the search as a list box (Figma `21. Channels submenu`, `30. Channels submenu` in
 * `116174:20661`): channels with `#`, people with avatar and presence, messages with channel or
 * person, author, time and the text around the hit. `headings` names the groups; `active` is the
 * index of the hit the arrow keys point at and stays in view. While `messages` loads or fails, a
 * line says so. `plain` drops the card for the mobile search view (`116184:22571`).
 */
@Component({
  selector: 'app-search-results',
  imports: [Avatar],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  host: { '[class.results--plain]': 'plain()' },
})
export class SearchResults {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly listId = input.required<string>();
  readonly groups = input.required<readonly HitGroup[]>();
  readonly messages = input.required<MessageFeed<unknown>>();
  readonly headings = input(false);
  readonly plain = input(false);
  readonly active = input(0);
  readonly picked = output<SearchHit>();
  readonly errorText = AUTH_ERRORS.generic;
  readonly empty = computed(() => !this.groups().length && this.messages().state === 'ready');
  readonly indexed = computed(() => {
    let start = 0;
    return this.groups().map((group): IndexedGroup => {
      const indexedGroup = { ...group, start };
      start += group.hits.length;
      return indexedGroup;
    });
  });

  /** Scrolls the hit the arrow keys point at into view. */
  constructor() {
    afterRenderEffect(() => {
      const id = this.optionId(this.active());
      this.host.nativeElement
        .querySelector(`#${CSS.escape(id)}`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  /** Element id of the hit at `index`. */
  optionId(index: number): string {
    return optionId(this.listId(), index);
  }
}
