import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { MessageSearchService, PlacedMessage } from '../../../core/services/message-search.service';
import { UserService } from '../../../core/services/user.service';
import { MessageFeed, toFeed } from '../../chat/message-feed';
import { optionId } from '../../chat/mention-trigger';
import { ProfileViewer } from '../../profile/profile-viewer';
import { channelLink } from '../../workspace/chat-links';
import { toMenuContacts } from '../../workspace/workspace-menu/menu-entries';
import { SearchHit, SearchSources, findHits } from '../search-hits';
import { readSearch } from '../search-query';
import { SearchResults } from '../search-results/search-results';

/** Feed while no messages are wanted: nothing to search, nothing loading. */
const NO_MESSAGES: MessageFeed<PlacedMessage> = { state: 'ready', messages: [] };

/** Counts the instances, so every search has its own list id. */
let searchCount = 0;

/**
 * Search of the workspace (DA checklist Schreiben US6, Figma Note 5): on desktop the bar
 * "Devspace durchsuchen" in the header (`116174:20661`), on mobile the field "Gehe zu..." at the
 * top of the menu (`678:15602`), which opens the view "Search" with a close button
 * (`116184:22571`, `116184:23002`, Note 2M). `#` lists the own channels, `@` the people, any other
 * text channels, people and the messages of the own channels and direct chats; the list follows
 * every key and every new message. A channel opens, a person shows the profile, a message opens its
 * chat with its thread next to it.
 */
@Component({
  selector: 'app-workspace-search',
  imports: [SearchResults],
  templateUrl: './workspace-search.html',
  styleUrl: './workspace-search.scss',
  host: { '[class.search--mobile]': 'mobile()' },
})
export class WorkspaceSearch {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly channels = inject(ChannelService);
  private readonly search = inject(MessageSearchService);
  private readonly profiles = inject(ProfileViewer);
  private readonly router = inject(Router);
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('searchField');
  readonly mobile = input(false);
  readonly listId = `search-results-${++searchCount}`;
  readonly value = signal('');
  readonly focused = signal(false);
  readonly dismissed = signal(false);
  readonly viewOpen = signal(false);
  private keepViewClosed = false;
  readonly query = computed(() => readSearch(this.value()));
  readonly placeholder = computed(() => (this.mobile() ? 'Gehe zu...' : 'Devspace durchsuchen'));
  private readonly wantsMessages = computed(() => this.query()?.char === null);
  readonly messages = toSignal(
    toObservable(this.wantsMessages).pipe(
      switchMap((wanted) => (wanted ? toFeed(this.search.watchAll()) : of(NO_MESSAGES))),
    ),
    { initialValue: NO_MESSAGES },
  );
  readonly groups = computed(() => {
    const query = this.query();
    return query ? findHits(query, this.sources()) : [];
  });
  private readonly hits = computed(() => this.groups().flatMap((group) => group.hits));
  private readonly hitKeys = computed(() =>
    this.hits()
      .map(({ key }) => key)
      .join('|'),
  );
  readonly active = linkedSignal({ source: this.hitKeys, computation: () => 0 });
  readonly open = computed(() => {
    const shown = this.mobile() ? this.viewOpen() : this.focused() && !this.dismissed();
    return shown && this.query() !== null;
  });
  readonly listShown = computed(() => this.open() && this.hits().length > 0);
  readonly activeId = computed(() =>
    this.listShown() ? optionId(this.listId, this.active()) : null,
  );

  /** Follows the typed text and shows the list again after Escape. */
  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.dismissed.set(false);
    this.viewOpen.set(this.mobile());
  }

  /** Marks the field as focused; on mobile the search view opens. */
  onFocus(): void {
    this.focused.set(true);
    this.viewOpen.set(this.mobile() && !this.keepViewClosed);
  }

  /** Arrow keys move through the hits, Enter picks one, Escape closes the list or the view. */
  onKeydown(event: KeyboardEvent): void {
    if (event.isComposing || !this.steer(event.key)) {
      return;
    }
    event.preventDefault();
  }

  /** Opens what the hit stands for and empties the search. */
  pick(hit: SearchHit): void {
    this.reset();
    if (hit.type === 'channel') {
      void this.router.navigate(channelLink(hit.id));
    } else if (hit.type === 'person') {
      this.profiles.show(hit.contact.id);
    } else {
      void this.router.navigate(hit.link);
    }
  }

  /** Empties the search, closes the list and the mobile view; the focus returns to the field. */
  close(): void {
    this.reset();
    this.keepViewClosed = true;
    this.field().nativeElement.focus();
    this.keepViewClosed = false;
  }

  /** Empties the search and closes the list and the mobile view without keeping the focus. */
  private reset(): void {
    this.value.set('');
    this.viewOpen.set(false);
    this.field().nativeElement.blur();
  }

  /** Handles one key of the open list; false when the key is not one of the list. */
  private steer(key: string): boolean {
    const count = this.hits().length;
    if (key === 'Escape') {
      this.dismissOrClose();
    } else if (!this.open() || !count) {
      return false;
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      this.active.update((index) => (index + (key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (key === 'Enter') {
      this.pick(this.hits()[this.active()]);
    } else {
      return false;
    }
    return true;
  }

  /** Escape closes the mobile view, on desktop it only hides the list. */
  private dismissOrClose(): void {
    if (this.mobile()) {
      this.close();
    } else {
      this.dismissed.set(true);
    }
  }

  /** Channels, people and messages the hits are taken from. */
  private sources(): SearchSources {
    const users = this.users.users();
    const selfUid = this.auth.uid() ?? '';
    return {
      channels: this.channels.channels(),
      people: toMenuContacts(users, selfUid),
      messages: this.messages().messages,
      users: new Map(users.map((user) => [user.uid, user])),
      selfUid,
      now: Date.now(),
    };
  }
}
