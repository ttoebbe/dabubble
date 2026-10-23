import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ConversationKind, MessageService } from '../../../core/services/message.service';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { MessageComposer } from '../message-composer/message-composer';
import { LOADING_FEED, toFeed } from '../message-feed';
import { MessageList } from '../message-list/message-list';

/**
 * Messages and message box of one channel or direct chat (area B). The chat intro is
 * projected above the first message. Messages are live; when they cannot be read, a message
 * says so above the box.
 */
@Component({
  selector: 'app-conversation',
  imports: [MessageComposer, MessageList],
  templateUrl: './conversation.html',
  styleUrl: './conversation.scss',
})
export class Conversation {
  private readonly messages = inject(MessageService);
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
}
