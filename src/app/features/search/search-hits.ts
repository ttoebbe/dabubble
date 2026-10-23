import { AppUser } from '../../core/models/app-user';
import { Channel } from '../../core/models/channel';
import { PlacedMessage } from '../../core/services/message-search.service';
import { formatDay, formatTime } from '../chat/chat-time';
import { UNKNOWN_PERSON_NAME } from '../chat/direct-chat/direct-chat';
import { messageLink } from '../workspace/chat-links';
import { MenuContact } from '../workspace/workspace-menu/menu-entries';
import { SearchQuery, Snippet, contains, toSnippet } from './search-query';

/** Most messages the search lists, newest first. */
export const MAX_MESSAGE_HITS = 20;

/** A channel of the signed-in person whose name matches. */
export interface ChannelHit {
  readonly type: 'channel';
  readonly key: string;
  readonly id: string;
  readonly name: string;
}

/** A person whose name matches; a click shows the profile. */
export interface PersonHit {
  readonly type: 'person';
  readonly key: string;
  readonly contact: MenuContact;
}

/** A message that contains the text, with where, by whom and when it was written. */
export interface MessageHit {
  readonly type: 'message';
  readonly key: string;
  /** "#Entwicklerteam" or the other person of a direct chat. */
  readonly place: string;
  readonly author: string;
  readonly time: string;
  readonly snippet: Snippet;
  /** Opens the chat with the thread of the message next to it. */
  readonly link: unknown[];
}

/** Anything the search lists. */
export type SearchHit = ChannelHit | PersonHit | MessageHit;

/** Hits of one kind under a heading ("Channels", "Personen", "Nachrichten"). */
export interface HitGroup {
  readonly heading: string;
  readonly hits: readonly SearchHit[];
}

/** What the hits are taken from. */
export interface SearchSources {
  readonly channels: readonly Channel[];
  readonly people: readonly MenuContact[];
  readonly messages: readonly PlacedMessage[];
  readonly users: ReadonlyMap<string, AppUser>;
  readonly selfUid: string;
  readonly now: number;
}

/** Where a message was written: its label and the channel id or uid the chat route needs. */
interface Place {
  readonly label: string;
  readonly chat: string;
}

/**
 * Hits of a query, grouped: `#` lists channels, `@` people, any other text channels, people and
 * messages. Groups without hits are left out.
 */
export function findHits(query: SearchQuery, sources: SearchSources): HitGroup[] {
  const channels = { heading: 'Channels', hits: channelHits(sources.channels, query.text) };
  const people = { heading: 'Personen', hits: personHits(sources.people, query.text) };
  const groups =
    query.char === '#'
      ? [channels]
      : query.char === '@'
        ? [people]
        : [channels, people, { heading: 'Nachrichten', hits: messageHits(sources, query.text) }];
  return groups.filter((group) => group.hits.length);
}

/** Own channels whose name contains the text. */
function channelHits(channels: readonly Channel[], text: string): ChannelHit[] {
  return channels
    .filter((channel) => contains(channel.name, text))
    .map(({ id, name }) => ({ type: 'channel', key: `channel:${id}`, id, name }));
}

/** People whose name contains the text. */
function personHits(people: readonly MenuContact[], text: string): PersonHit[] {
  return people
    .filter((contact) => contains(contact.name, text))
    .map((contact) => ({ type: 'person', key: `person:${contact.id}`, contact }));
}

/**
 * The newest messages that contain the text, at most `MAX_MESSAGE_HITS`; messages of a channel
 * that is not known (any more) are left out.
 */
function messageHits(sources: SearchSources, text: string): MessageHit[] {
  if (!text) {
    return [];
  }
  return sources.messages
    .filter(({ message }) => contains(message.text, text))
    .sort((first, second) => second.message.createdAt - first.message.createdAt)
    .slice(0, MAX_MESSAGE_HITS)
    .flatMap((found) => {
      const place = placeOf(found, sources);
      return place ? [toMessageHit(found, place, sources, text)] : [];
    });
}

/** Hit of one message written at `place`. */
function toMessageHit(
  { kind, conversationId, message }: PlacedMessage,
  place: Place,
  sources: SearchSources,
  text: string,
): MessageHit {
  return {
    type: 'message',
    key: `message:${conversationId}/${message.id}`,
    place: place.label,
    author: sources.users.get(message.authorId)?.name ?? UNKNOWN_PERSON_NAME,
    time: `${formatDay(message.createdAt, sources.now)}, ${formatTime(message.createdAt)}`,
    snippet: toSnippet(message.text, text),
    link: messageLink(kind, place.chat, conversationId, message.id),
  };
}

/** Channel or other person of the conversation of a message; the own chat is "Name (Du)". */
function placeOf({ kind, conversationId }: PlacedMessage, sources: SearchSources): Place | null {
  if (kind === 'channel') {
    const channel = sources.channels.find(({ id }) => id === conversationId);
    return channel ? { label: `#${channel.name}`, chat: channel.id } : null;
  }
  const other = conversationId.split('_').find((uid) => uid !== sources.selfUid);
  const name = sources.users.get(other ?? sources.selfUid)?.name ?? UNKNOWN_PERSON_NAME;
  return { label: other ? name : `${name} (Du)`, chat: other ?? sources.selfUid };
}
