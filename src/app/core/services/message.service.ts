import { Service, inject } from '@angular/core';
import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
} from 'firebase/firestore';
import { Observable, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Message } from '../models/message';
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
      return this.followMessages(kind, conversationId);
    }
    return this.directChats.exists(conversationId).pipe(
      distinctUntilChanged(),
      switchMap((exists) => (exists ? this.followMessages(kind, conversationId) : of([]))),
    );
  }

  /** Sends a message as the signed-in person; the first one in a direct chat creates the chat. */
  async send(kind: ConversationKind, conversationId: string, text: string): Promise<void> {
    if (kind === 'dm') {
      await this.directChats.ensure(conversationId);
    }
    const message: Omit<Message, 'id'> = {
      authorId: this.auth.uid() ?? '',
      text,
      createdAt: Date.now(),
      editedAt: null,
      reactions: {},
      replyCount: 0,
      lastReplyAt: null,
    };
    await addDoc(this.messagesRef(kind, conversationId), message);
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

  /**
   * Toggles a reaction on any message document (a message or, later, a thread reply). Reads
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

  /** Listens to the messages collection, sorted by `createdAt`. */
  private followMessages(kind: ConversationKind, conversationId: string): Observable<Message[]> {
    const sorted = query(this.messagesRef(kind, conversationId), orderBy('createdAt'));
    return new Observable<Message[]>((subscriber) =>
      onSnapshot(
        sorted,
        (snapshot) =>
          subscriber.next(
            snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as Message),
          ),
        (error) => subscriber.error(error),
      ),
    );
  }

  /** The messages collection of a conversation. */
  private messagesRef(kind: ConversationKind, conversationId: string) {
    return collection(this.firestore, COLLECTIONS[kind], conversationId, 'messages');
  }
}
