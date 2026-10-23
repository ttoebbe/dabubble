import { Observable, catchError, map, of, startWith } from 'rxjs';
import { Message } from '../../core/models/message';

/**
 * What a conversation view or the search knows about its messages: still loading, ready or not
 * readable.
 */
export interface MessageFeed<T = Message> {
  readonly state: 'loading' | 'ready' | 'error';
  readonly messages: readonly T[];
}

/** Feed before the first answer of Firestore. */
export const LOADING_FEED: MessageFeed<never> = { state: 'loading', messages: [] };

/** Feed after Firestore refused or failed, e.g. without access to the conversation. */
const ERROR_FEED: MessageFeed<never> = { state: 'error', messages: [] };

/** Turns the live messages into a feed that starts as loading and ends in an error feed. */
export function toFeed<T = Message>(source: Observable<T[]>): Observable<MessageFeed<T>> {
  return source.pipe(
    map((messages): MessageFeed<T> => ({ state: 'ready', messages })),
    startWith(LOADING_FEED),
    catchError(() => of(ERROR_FEED)),
  );
}
