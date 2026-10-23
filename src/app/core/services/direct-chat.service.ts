import { Service, inject } from '@angular/core';
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { DirectChat } from '../models/direct-chat';
import { FIRESTORE } from './firebase';

/**
 * Id of the direct chat of two people: both uids in ascending order, joined by `_`
 * (ttoebbe/dabubble#1). One chat per pair, no lookup needed; with oneself it is `a_a`.
 */
export function directChatId(first: string, second: string): string {
  return [first, second].sort().join('_');
}

/**
 * Direct chats in `directChats/{chatId}` (area B). A chat is created with its first message,
 * not when somebody opens it.
 */
@Service()
export class DirectChatService {
  private readonly firestore = inject(FIRESTORE);

  /**
   * Live: whether the chat exists on the server. A local write that is not committed yet counts
   * as missing, because the rules check membership against the server copy.
   * Errors with the Firestore error when access is denied.
   */
  exists(chatId: string): Observable<boolean> {
    return new Observable<boolean>((subscriber) =>
      onSnapshot(
        doc(this.firestore, 'directChats', chatId),
        { includeMetadataChanges: true },
        (snapshot) => subscriber.next(snapshot.exists() && !snapshot.metadata.hasPendingWrites),
        (error) => subscriber.error(error),
      ),
    );
  }

  /** Live: the chats a person belongs to. Errors with the Firestore error when access is denied. */
  watchOwn(uid: string): Observable<DirectChat[]> {
    const own = query(
      collection(this.firestore, 'directChats'),
      where('memberIds', 'array-contains', uid),
    );
    return new Observable<DirectChat[]>((subscriber) =>
      onSnapshot(
        own,
        (snapshot) =>
          subscriber.next(
            snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as DirectChat),
          ),
        (error) => subscriber.error(error),
      ),
    );
  }

  /** Creates the chat if it is missing. The members are the two uids in the id. */
  async ensure(chatId: string): Promise<void> {
    const ref = doc(this.firestore, 'directChats', chatId);
    if ((await getDoc(ref)).exists()) {
      return;
    }
    const chat: Omit<DirectChat, 'id'> = { memberIds: chatId.split('_'), createdAt: Date.now() };
    await setDoc(ref, chat);
  }
}
