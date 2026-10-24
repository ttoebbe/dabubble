import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, filter, of, switchMap } from 'rxjs';
import { Message } from '../../../core/models/message';
import { AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { ConversationKind, MessageService } from '../../../core/services/message.service';
import { UserService } from '../../../core/services/user.service';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { ChatHeader } from '../../chat/chat-header/chat-header';
import { formatReplies } from '../../chat/chat-time';
import { chatPersonName } from '../../chat/direct-chat/direct-chat';
import { LOADING_FEED, toFeed } from '../../chat/message-feed';
import { MessageComposer } from '../../chat/message-composer/message-composer';
import { MessageItem } from '../../chat/message-item/message-item';
import { MessageList } from '../../chat/message-list/message-list';
import { activeEntryOf } from '../../workspace/chat-links';
import { closeThreadCommands } from '../thread-route';

/**
 * Thread of one message (DA checklist Schreiben US5, Figma `210:752`, mobile `742:12168`): header
 * with "Thread", where it belongs and a close button, the message the thread started from, the
 * number of replies, the replies live and a message box for the next reply that gets the focus
 * when the thread opens. Reactions work on the message and on every reply. The route is
 * `thread/:kind/:conversationId/:messageId` in the outlet `thread`. It closes itself when another
 * chat is opened, so no thread of a foreign chat stays next to it.
 */
@Component({
  selector: 'app-thread-view',
  imports: [ChatHeader, MessageComposer, MessageItem, MessageList],
  templateUrl: './thread-view.html',
  styleUrl: './thread-view.scss',
})
export class ThreadView {
  private readonly messages = inject(MessageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly channels = inject(ChannelService);
  private readonly params = toSignal(this.route.paramMap, { requireSync: true });
  readonly kind = computed(() => this.params().get('kind') as ConversationKind);
  readonly conversationId = computed(() => this.params().get('conversationId') ?? '');
  readonly messageId = computed(() => this.params().get('messageId') ?? '');
  private readonly source = computed(() => ({
    kind: this.kind(),
    id: this.conversationId(),
    messageId: this.messageId(),
  }));
  readonly origin = toSignal(
    toObservable(this.source).pipe(
      switchMap(({ kind, id, messageId }) =>
        this.messages.watchMessage(kind, id, messageId).pipe(catchError(() => of(null))),
      ),
    ),
    { initialValue: null as Message | null },
  );
  readonly feed = toSignal(
    toObservable(this.source).pipe(
      switchMap(({ kind, id, messageId }) =>
        toFeed(this.messages.watchReplies(kind, id, messageId)),
      ),
    ),
    { initialValue: LOADING_FEED },
  );
  readonly people = computed(() => new Map(this.users.users().map((user) => [user.uid, user])));
  readonly own = computed(() => this.origin()?.authorId === this.auth.uid());
  readonly repliesLabel = computed(() => formatReplies(this.feed().messages.length));
  readonly errorText = AUTH_ERRORS.generic;
  readonly focusKey = computed(() => `${this.kind()}/${this.conversationId()}/${this.messageId()}`);
  readonly isChannel = computed(() => this.kind() === 'channel');
  readonly contextName = computed(() =>
    this.isChannel() ? this.channelName() : this.personName(),
  );

  /** Closes the thread as soon as the chat next to it is a different one. */
  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(({ urlAfterRedirects }) => {
        if (!this.belongsTo(activeEntryOf(this.router.parseUrl(urlAfterRedirects)))) {
          this.close();
        }
      });
  }

  /** Closes the thread; on mobile that returns to the chat. */
  close(): void {
    this.router.navigate(closeThreadCommands(), { relativeTo: this.route.parent });
  }

  /** Sends a reply to the message of this thread; the message box shows a failure. */
  readonly sendReply = (text: string): Promise<void> =>
    this.messages.reply(this.kind(), this.conversationId(), this.messageId(), text);

  /** Toggles the own reaction on the message the thread started from. */
  readonly reactToMessage = (messageId: string, emojiId: string): Promise<void> =>
    this.messages.toggleReaction(this.kind(), this.conversationId(), messageId, emojiId);

  /** Stores the new text of the own message the thread started from. */
  readonly editMessage = (messageId: string, text: string): Promise<void> =>
    this.messages.edit(this.kind(), this.conversationId(), messageId, text);

  /** Stores the new text of an own reply. */
  readonly editReply = (replyId: string, text: string): Promise<void> =>
    this.messages.editReply(this.kind(), this.conversationId(), this.messageId(), replyId, text);

  /** Toggles the own reaction on a reply. */
  readonly reactToReply = (replyId: string, emojiId: string): Promise<void> =>
    this.messages.toggleReplyReaction(
      this.kind(),
      this.conversationId(),
      this.messageId(),
      replyId,
      emojiId,
    );

  /** Whether the open chat (channel id or uid of the other person) is the one of this thread. */
  private belongsTo(activeEntry: string | null): boolean {
    if (this.isChannel()) {
      return activeEntry === this.conversationId();
    }
    return activeEntry !== null && this.conversationId().split('_').includes(activeEntry);
  }

  /** Name of the channel the thread belongs to. */
  private channelName(): string {
    const channel = this.channels.allChannels().find((entry) => entry.id === this.conversationId());
    return channel?.name ?? '';
  }

  /** Name of the other person of the direct chat as in its header ("(Du)" in the chat with oneself). */
  private personName(): string {
    const self = this.auth.uid();
    const other = this.conversationId()
      .split('_')
      .find((entry) => entry !== self);
    return chatPersonName(this.people().get(other ?? self ?? '')?.name, other === undefined);
  }
}
