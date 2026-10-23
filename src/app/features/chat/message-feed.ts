import { Observable, catchError, map, of, startWith } from 'rxjs';
import { Message } from '../../core/models/message';

/** What a conversation view knows about its messages: still loading, ready or not readable. */
export interface MessageFeed {
  readonly state: 'loading' | 'ready' | 'error';
  readonly messages: readonly Message[];
}

/** Feed before the first answer of Firestore. */
export const LOADING_FEED: MessageFeed = { state: 'loading', messages: [] };

/** Feed after Firestore refused or failed, e.g. without access to the conversation. */
const ERROR_FEED: MessageFeed = { state: 'error', messages: [] };

/** Turns the live messages into a feed that starts as loading and ends in an error feed. */
export function toFeed(source: Observable<Message[]>): Observable<MessageFeed> {
  return source.pipe(
    map((messages): MessageFeed => ({ state: 'ready', messages })),
    startWith(LOADING_FEED),
    catchError(() => of(ERROR_FEED)),
  );
}
