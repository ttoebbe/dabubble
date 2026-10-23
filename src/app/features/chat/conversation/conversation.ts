import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConversationKind, MessageService } from '../../../core/services/message.service';
import { threadCommands } from '../../thread/thread-route';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { MessageComposer } from '../message-composer/message-composer';
import { LOADING_FEED, toFeed } from '../message-feed';
import { MessageList } from '../message-list/message-list';

/**
 * Messages and message box of one channel or direct chat (area B). The chat intro is
 * projected above the first message. Messages are live; when they cannot be read, a message
 * says so above the box. The thread of a message opens next to the chat.
 */
@Component({
  selector: 'app-conversation',
  imports: [MessageComposer, MessageList],
  templateUrl: './conversation.html',
  styleUrl: './conversation.scss',
})
export class Conversation {
  private readonly messages = inject(MessageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly kind = input.required<ConversationKind>();
  readonly conversationId = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly errorText = AUTH_ERRORS.generic;
  readonly feed = toSignal(
    toObservable(computed(() => ({ kind: this.kind(), id: this.conversationId() }))).pipe(
      switchMap(({ kind, id }) => toFeed(this.messages.watch(kind, id))),
    ),
    { initialValue: LOADING_FEED },
  );

  /** Sends a message into this conversation; the composer shows a failure. */
  readonly send = (text: string): Promise<void> =>
    this.messages.send(this.kind(), this.conversationId(), text);

  /** Opens the thread of a message in the outlet `thread` of the workspace frame. */
  readonly openThread = (messageId: string): Promise<boolean> =>
    this.router.navigate(threadCommands(this.kind(), this.conversationId(), messageId), {
      relativeTo: this.route.parent,
    });

  /** Toggles the own reaction on a message of this conversation. */
  readonly react = (messageId: string, emojiId: string): Promise<void> =>
    this.messages.toggleReaction(this.kind(), this.conversationId(), messageId, emojiId);
}
