import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { directChatId } from '../../../core/services/direct-chat.service';
import { MessageService } from '../../../core/services/message.service';
import { UserService } from '../../../core/services/user.service';
import { ChatHeader } from '../../chat/chat-header/chat-header';
import { MentionMenu } from '../../chat/mention-menu/mention-menu';
import { MentionOption, filterOptions, optionId } from '../../chat/mention-trigger';
import { MessageComposer } from '../../chat/message-composer/message-composer';
import { channelLink, directMessageLink } from '../../workspace/chat-links';
import { Recipient, matchPeople, readAddress } from '../recipients';

/** Placeholder of the address field (Figma `723:10986`; mobile `754:12776` without e-mail). */
const ADDRESS_HINT = 'An: #channel, oder @jemand oder E-Mail Adresse';
const ADDRESS_HINT_MOBILE = 'An: #channel, oder @jemand';
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * "Neue Nachricht" (DA checklist Schreiben US4, Figma `11-…new message`, mobile `09-New
 * message`, Note 9): the address field lists the own channels after `#`, the people after `@`
 * (other guests stay hidden as in the menu) and finds people by name or e-mail address otherwise;
 * arrow keys, Enter, Tab and Escape steer the list. Sending works once a recipient is chosen;
 * the message goes to that channel or direct chat, which then opens.
 */
@Component({
  selector: 'app-new-message-view',
  imports: [ChatHeader, MentionMenu, MessageComposer],
  templateUrl: './new-message-view.html',
  styleUrl: './new-message-view.scss',
})
export class NewMessageView {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly channels = inject(ChannelService);
  private readonly messages = inject(MessageService);
  private readonly router = inject(Router);
  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('addressField');
  readonly listId = 'recipient-list';
  readonly address = signal('');
  readonly recipient = signal<Recipient | null>(null);
  readonly focused = signal(false);
  readonly dismissed = signal(false);
  readonly mobile = signal(false);
  readonly placeholder = computed(() => (this.mobile() ? ADDRESS_HINT_MOBILE : ADDRESS_HINT));
  private readonly people = computed(() =>
    this.users.users().filter((user) => !user.isGuest || user.uid === this.auth.uid()),
  );
  readonly menu = computed(() => {
    const query = readAddress(this.address());
    if (!query || this.recipient() || !this.focused() || this.dismissed()) {
      return null;
    }
    const channels = this.channels.channels().map(({ id, name }) => ({ id, label: name }));
    const options =
      query.char === '#' ? filterOptions(channels, query.query) : matchPeople(this.people(), query);
    return options.length ? { char: query.char, options } : null;
  });
  readonly active = linkedSignal({ source: this.menu, computation: () => 0 });
  readonly activeId = computed(() => (this.menu() ? optionId(this.listId, this.active()) : null));

  /** Starts with the focus in the address field and follows the mobile breakpoint. */
  constructor() {
    afterNextRender(() => this.field().nativeElement.focus());
    this.followMobile();
  }

  /** Follows the typed address; any change drops a chosen recipient. */
  onInput(event: Event): void {
    this.address.set((event.target as HTMLInputElement).value);
    this.recipient.set(null);
    this.dismissed.set(false);
  }

  /** Steers the open list by keyboard. */
  onKeydown(event: KeyboardEvent): void {
    if (this.menu() && !event.isComposing && this.steer(event.key)) {
      event.preventDefault();
    }
  }

  /** Takes the chosen channel or person as recipient and shows it in the field. */
  pick(option: MentionOption): void {
    const char = this.menu()?.char ?? '@';
    this.recipient.set({ kind: char === '#' ? 'channel' : 'dm', id: option.id });
    this.address.set(`${char}${option.label}`);
  }

  /** Sends the message to the recipient and opens that chat; the box shows a failure. */
  readonly send = async (text: string): Promise<void> => {
    const recipient = this.recipient();
    if (!recipient) {
      return;
    }
    if (recipient.kind === 'channel') {
      await this.messages.send('channel', recipient.id, text);
      await this.router.navigate(channelLink(recipient.id));
    } else {
      await this.messages.send('dm', directChatId(this.auth.uid() ?? '', recipient.id), text);
      await this.router.navigate(directMessageLink(recipient.id));
    }
  };

  /** Arrow keys move, Enter and Tab pick, Escape closes the list; false for any other key. */
  private steer(key: string): boolean {
    const count = this.menu()?.options.length ?? 0;
    const step: Record<string, number | undefined> = { ArrowDown: 1, ArrowUp: -1 };
    if (key in step) {
      this.active.update((index) => (index + (step[key] ?? 0) + count) % count);
    } else if (key === 'Enter' || key === 'Tab') {
      this.pick(this.menu()?.options[this.active()] as MentionOption);
    } else if (key === 'Escape') {
      this.dismissed.set(true);
    } else {
      return false;
    }
    return true;
  }

  /** Keeps `mobile` in line with the mobile breakpoint of `_breakpoints.scss`. */
  private followMobile(): void {
    const media = inject(DOCUMENT).defaultView?.matchMedia(MOBILE_QUERY);
    if (!media) {
      return;
    }
    const update = () => this.mobile.set(media.matches);
    update();
    media.addEventListener('change', update);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change', update));
  }
}
