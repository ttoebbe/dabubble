import { Service, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { Message } from '../models/message';
import { AuthService } from './auth.service';
import { ChannelService } from './channel.service';
import { DirectChatService } from './direct-chat.service';
import { ConversationKind, MessageService } from './message.service';

/** A message together with the conversation it belongs to. */
export interface PlacedMessage {
  readonly kind: ConversationKind;
  readonly conversationId: string;
  readonly message: Message;
}

/** A channel or direct chat of the signed-in person. */
interface OwnConversation {
  readonly kind: ConversationKind;
  readonly id: string;
}

/** Whether two id lists are the same, in the same order. */
function sameIds(first: readonly string[], second: readonly string[]): boolean {
  return first.length === second.length && first.every((id, index) => id === second[index]);
}

/**
 * Messages of all channels and direct chats of the signed-in person, live, for the search
 * (DA checklist Schreiben US6). Firestore has no full-text search, so the messages of the own
 * conversations are read and filtered in the browser. A conversation that cannot be read counts
 * as empty, e.g. a channel that was just left.
 */
@Service()
export class MessageSearchService {
  private readonly auth = inject(AuthService);
  private readonly channels = inject(ChannelService);
  private readonly directChats = inject(DirectChatService);
  private readonly messages = inject(MessageService);
  private readonly channelIds = toObservable(
    computed(() => this.channels.channels().map(({ id }) => id), { equal: sameIds }),
  );

  /** Live messages of all own conversations. Errors when the own direct chats cannot be read. */
  watchAll(): Observable<PlacedMessage[]> {
    const chatIds = this.directChats.watchOwn(this.auth.uid() ?? '').pipe(
      map((chats) => chats.map(({ id }) => id)),
      distinctUntilChanged(sameIds),
    );
    return combineLatest([this.channelIds, chatIds]).pipe(
      map(([channels, chats]): OwnConversation[] => [
        ...channels.map((id) => ({ kind: 'channel' as const, id })),
        ...chats.map((id) => ({ kind: 'dm' as const, id })),
      ]),
      switchMap((conversations) => this.watchConversations(conversations)),
    );
  }

  /** Messages of several conversations in one list. */
  private watchConversations(
    conversations: readonly OwnConversation[],
  ): Observable<PlacedMessage[]> {
    if (!conversations.length) {
      return of([]);
    }
    return combineLatest(conversations.map((conversation) => this.watchOne(conversation))).pipe(
      map((lists) => lists.flat()),
    );
  }

  /** Messages of one conversation; none when it cannot be read. */
  private watchOne({ kind, id }: OwnConversation): Observable<PlacedMessage[]> {
    return this.messages.watch(kind, id).pipe(
      map((messages) => messages.map((message) => ({ kind, conversationId: id, message }))),
      catchError(() => of([])),
    );
  }
}
