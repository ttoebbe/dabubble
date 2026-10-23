import { Service, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import { Observable, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ChatMessage, Message } from '../models/message';
import { AuthService } from './auth.service';
import { DirectChatService } from './direct-chat.service';
import { FIRESTORE } from './firebase';

/** Where a message lives: in a channel or in a direct chat (route kinds `channel` and `dm`). */
export type ConversationKind = 'channel' | 'dm';

/** Firestore collection that holds the conversations of a kind. */
const COLLECTIONS: Record<ConversationKind, string> = { channel: 'channels', dm: 'directChats' };

/**
 * Messages of channels and direct chats (area B), stored in `.../{conversationId}/messages`
 * (ttoebbe/dabubble#1). For a direct chat `conversationId` is the id from `directChatId`.
 */
@Service()
export class MessageService {
  private readonly firestore = inject(FIRESTORE);
  private readonly auth = inject(AuthService);
  private readonly directChats = inject(DirectChatService);

  /**
   * Live messages of a conversation, oldest first. A direct chat that does not exist yet has
   * none. Errors with the Firestore error when access is denied.
   */
  watch(kind: ConversationKind, conversationId: string): Observable<Message[]> {
    if (kind === 'channel') {
      return this.followMessages(this.messagesRef(kind, conversationId));
    }
    return this.directChats.exists(conversationId).pipe(
      distinctUntilChanged(),
      switchMap((exists) =>
        exists ? this.followMessages(this.messagesRef(kind, conversationId)) : of([]),
      ),
    );
  }

  /** Live replies of a message, oldest first. Errors with the Firestore error when denied. */
  watchReplies(
    kind: ConversationKind,
    conversationId: string,
    messageId: string,
  ): Observable<ChatMessage[]> {
    return this.followMessages<ChatMessage>(this.repliesRef(kind, conversationId, messageId));
  }

  /** Live message document, e.g. the first message of a thread; null when it does not exist. */
  watchMessage(
    kind: ConversationKind,
    conversationId: string,
    messageId: string,
  ): Observable<Message | null> {
    const ref = doc(this.messagesRef(kind, conversationId), messageId);
    return new Observable<Message | null>((subscriber) =>
      onSnapshot(
        ref,
        (snapshot) => subscriber.next(snapshot.exists() ? this.toMessage(snapshot) : null),
        (error) => subscriber.error(error),
      ),
    );
  }

  /** Sends a message as the signed-in person; the first one in a direct chat creates the chat. */
  async send(kind: ConversationKind, conversationId: string, text: string): Promise<void> {
    if (kind === 'dm') {
      await this.directChats.ensure(conversationId);
    }
    const message: Omit<Message, 'id'> = { ...this.draft(text), replyCount: 0, lastReplyAt: null };
    await addDoc(this.messagesRef(kind, conversationId), message);
  }

  /**
   * Answers a message as the signed-in person: the reply and the new counters of the message
   * (`replyCount` plus one, `lastReplyAt`) are written in one batch, as the rules demand.
   */
  async reply(
    kind: ConversationKind,
    conversationId: string,
    messageId: string,
    text: string,
  ): Promise<void> {
    const message = doc(this.messagesRef(kind, conversationId), messageId);
    const draft = this.draft(text);
    const batch = writeBatch(this.firestore);
    batch.set(doc(collection(message, 'replies')), draft);
    batch.update(message, { replyCount: increment(1), lastReplyAt: draft.createdAt });
    await batch.commit();
  }

  /**
   * Adds the reaction of the signed-in person to a message, or removes it when it is already
   * there. Rejects when Firestore refuses, e.g. a 21st emoji.
   */
  toggleReaction(
    kind: ConversationKind,
    conversationId: string,
    messageId: string,
    emojiId: string,
  ): Promise<void> {
    const ref = doc(this.messagesRef(kind, conversationId), messageId);
    return this.toggleAt(ref, emojiId);
  }

  /** Same as `toggleReaction`, on a reply of a message. */
  toggleReplyReaction(
    kind: ConversationKind,
    conversationId: string,
    messageId: string,
    replyId: string,
    emojiId: string,
  ): Promise<void> {
    const ref = doc(this.repliesRef(kind, conversationId, messageId), replyId);
    return this.toggleAt(ref, emojiId);
  }

  /**
   * Toggles a reaction on any message document (a message or a thread reply). Reads
   * and writes in one transaction so two people reacting at once do not overwrite each other;
   * an emoji nobody reacted with is removed from the map.
   */
  private toggleAt(ref: DocumentReference, emojiId: string): Promise<void> {
    const uid = this.auth.uid() ?? '';
    return runTransaction(this.firestore, async (transaction) => {
      const snapshot = await transaction.get(ref);
      const reactions: Record<string, string[]> = { ...snapshot.data()?.['reactions'] };
      const uids = reactions[emojiId] ?? [];
      const next = uids.includes(uid) ? uids.filter((id) => id !== uid) : [...uids, uid];
      if (next.length) {
        reactions[emojiId] = next;
      } else {
        delete reactions[emojiId];
      }
      transaction.update(ref, { reactions });
    });
  }

  /** Message of an existing document. */
  private toMessage(snapshot: DocumentSnapshot): Message {
    return { ...snapshot.data(), id: snapshot.id } as Message;
  }

  /** A new message of the signed-in person, without thread counters. */
  private draft(text: string): Omit<ChatMessage, 'id'> {
    return {
      authorId: this.auth.uid() ?? '',
      text,
      createdAt: Date.now(),
      editedAt: null,
      reactions: {},
    };
  }

  /** Listens to a messages or replies collection, sorted by `createdAt`. */
  private followMessages<T extends ChatMessage = Message>(
    source: CollectionReference,
  ): Observable<T[]> {
    const sorted = query(source, orderBy('createdAt'));
    return new Observable<T[]>((subscriber) =>
      onSnapshot(
        sorted,
        (snapshot) =>
          subscriber.next(snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as T)),
        (error) => subscriber.error(error),
      ),
    );
  }

  /** The messages collection of a conversation. */
  private messagesRef(kind: ConversationKind, conversationId: string) {
    return collection(this.firestore, COLLECTIONS[kind], conversationId, 'messages');
  }

  /** The replies collection of a message. */
  private repliesRef(kind: ConversationKind, conversationId: string, messageId: string) {
    return collection(this.messagesRef(kind, conversationId), messageId, 'replies');
  }
}
