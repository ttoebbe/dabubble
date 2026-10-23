import { Service, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ChatMessage, Message } from '../models/message';
import { AuthService } from './auth.service';
import { ChannelService } from './channel.service';
import { DirectChatService } from './direct-chat.service';
import { ConversationKind, MessageService } from './message.service';

/** A message or thread reply together with the conversation it belongs to. */
export interface PlacedMessage {
  readonly kind: ConversationKind;
  readonly conversationId: string;
  readonly message: ChatMessage;
  /** Id of the message a reply answers; null for a message of the chat itself. */
  readonly parentId: string | null;
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

/** A message of the chat itself, not a reply. */
function placeMessage(
  kind: ConversationKind,
  conversationId: string,
  message: Message,
): PlacedMessage {
  return { kind, conversationId, message, parentId: null };
}

/** All lists of several live sources in one list; an empty list without sources. */
function combineLists<T>(sources: readonly Observable<T[]>[]): Observable<T[]> {
  return sources.length ? combineLatest(sources).pipe(map((lists) => lists.flat())) : of([]);
}

/**
 * Messages and thread replies of all channels and direct chats of the signed-in person, live, for
 * the search (DA checklist Schreiben US6). Firestore has no full-text search, so the messages of
 * the own conversations are read and filtered in the browser; replies are read for the messages
 * that have some. A conversation or thread that cannot be read counts as empty, e.g. a channel that
 * was just left.
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

  /** Messages and replies of several conversations in one list. */
  private watchConversations(
    conversations: readonly OwnConversation[],
  ): Observable<PlacedMessage[]> {
    return combineLists(conversations.map((conversation) => this.watchOne(conversation)));
  }

  /** Messages and replies of one conversation; none when it cannot be read. */
  private watchOne({ kind, id }: OwnConversation): Observable<PlacedMessage[]> {
    const messages = this.messages
      .watch(kind, id)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    const placed = messages.pipe(
      map((list) => list.map((message) => placeMessage(kind, id, message))),
    );
    return combineLatest([placed, this.watchThreads(kind, id, messages)]).pipe(
      map(([own, replies]) => [...own, ...replies]),
      catchError(() => of([])),
    );
  }

  /** Replies of all messages that have some; listens anew only when such a message is added. */
  private watchThreads(
    kind: ConversationKind,
    conversationId: string,
    messages: Observable<Message[]>,
  ): Observable<PlacedMessage[]> {
    return messages.pipe(
      map((list) => list.filter(({ replyCount }) => replyCount > 0).map((message) => message.id)),
      distinctUntilChanged(sameIds),
      switchMap((parentIds) =>
        combineLists(parentIds.map((parentId) => this.watchThread(kind, conversationId, parentId))),
      ),
    );
  }

  /** Replies of one message; none when they cannot be read. */
  private watchThread(
    kind: ConversationKind,
    conversationId: string,
    parentId: string,
  ): Observable<PlacedMessage[]> {
    return this.messages.watchReplies(kind, conversationId, parentId).pipe(
      map((replies) => replies.map((message) => ({ kind, conversationId, message, parentId }))),
      catchError(() => of([])),
    );
  }
}
