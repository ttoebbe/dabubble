import { Component, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { AppUser } from '../../../core/models/app-user';
import { ChatMessage, Message } from '../../../core/models/message';
import { AVATAR_PLACEHOLDER, AuthService } from '../../../core/services/auth.service';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { toAvatarStatus } from '../../profile/profile-details';
import { ProfileViewer } from '../../profile/profile-viewer';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { formatClock, formatReplies, formatTime } from '../chat-time';
import { MessageEditor } from '../message-editor/message-editor';
import { MessageText } from '../message-text/message-text';
import { MessageReactions } from '../message-reactions/message-reactions';
import { ReactionBar } from '../reaction-bar/reaction-bar';
import { MAX_REACTIONS, buildChips } from '../reaction-chips';
import { RecentEmojis } from '../recent-emojis';

/** Name shown for an author without profile, e.g. a guest who has logged out. */
const UNKNOWN_AUTHOR_NAME = 'Gast';

/**
 * One message of a chat (Figma `48. Messages main chat`): avatar, name, time and bubble. Own
 * messages sit on the right. A click on avatar or name opens the profile; an author without
 * profile shows "Gast" with the placeholder avatar and cannot be clicked. The reaction bar
 * shows on hover and focus, on touch after a tap on the message; the reactions sit under the
 * bubble. `react` toggles the own reaction of a message by emoji id. A message with replies
 * shows "<n> Antworten" and the time of the last one; both that link and the thread button of
 * the bar report the message in `threadOpened`. Inside a thread (`inThread`) there is neither,
 * and at most seven reactions show. With `edit` an own message offers "Nachricht bearbeiten"
 * in the bar; the bubble then turns into the editor until it is saved or cancelled.
 */
@Component({
  selector: 'app-message-item',
  imports: [Avatar, MessageEditor, MessageReactions, MessageText, ReactionBar],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
  host: { '(document:click)': 'tap($event)' },
})
export class MessageItem {
  private readonly profiles = inject(ProfileViewer);
  private readonly recent = inject(RecentEmojis);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly selfUid = inject(AuthService).uid;
  readonly message = input.required<ChatMessage>();
  readonly author = input<AppUser | null>(null);
  readonly people = input<ReadonlyMap<string, AppUser>>(new Map());
  readonly own = input(false);
  readonly inThread = input(false);
  readonly react = input.required<(messageId: string, emojiId: string) => Promise<void>>();
  readonly edit = input<((messageId: string, text: string) => Promise<void>) | null>(null);
  readonly threadOpened = output<string>();
  readonly barShown = signal(false);
  readonly editing = signal(false);
  readonly editable = computed(() => this.own() && this.edit() !== null);
  readonly failed = signal(false);
  readonly errorText = AUTH_ERRORS.generic;
  readonly quick = computed(() => (this.own() ? [] : this.recent.quick()));
  readonly chips = computed(() =>
    buildChips(this.message().reactions, this.selfUid(), (uid) => this.people().get(uid)?.name),
  );
  readonly name = computed(() => this.author()?.name ?? UNKNOWN_AUTHOR_NAME);
  readonly avatarUrl = computed(() => this.author()?.avatarUrl || AVATAR_PLACEHOLDER);
  readonly status = computed(() => {
    const author = this.author();
    return author ? toAvatarStatus(author.presence) : null;
  });
  readonly time = computed(() => formatTime(this.message().createdAt));
  readonly replies = computed(() => {
    const { replyCount, lastReplyAt } = this.message() as Partial<Message>;
    if (this.inThread() || !replyCount) {
      return null;
    }
    const last = lastReplyAt ? ` ${formatClock(lastReplyAt)}` : '';
    return { label: formatReplies(replyCount), last: `Letzte Antwort${last}` };
  });

  /** Stores the edited text of this message. */
  readonly saveEdit = (text: string): Promise<void> =>
    this.edit()?.(this.message().id, text) ?? Promise.resolve();

  /** Opens the profile of the author. */
  showProfile(): void {
    this.profiles.show(this.message().authorId);
  }

  /** Toggles the own reaction; remembers an added emoji as recent. A failure shows a note. */
  async toggleReaction(emojiId: string): Promise<void> {
    const reactions = this.message().reactions;
    const added = !reactions[emojiId]?.includes(this.selfUid() ?? '');
    if (added && !reactions[emojiId] && Object.keys(reactions).length >= MAX_REACTIONS) {
      return;
    }
    this.failed.set(false);
    try {
      await this.react()(this.message().id, emojiId);
      if (added) {
        this.recent.use(emojiId);
      }
    } catch {
      this.failed.set(true);
    }
  }

  /** On touch the bar shows after a tap on the message and hides after a tap elsewhere. */
  tap(event: Event): void {
    const target = event.target as Element;
    const inside = this.host.nativeElement.contains(target) && !target.closest('button');
    this.barShown.set(inside && !this.barShown());
  }
}
