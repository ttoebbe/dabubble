import { MentionChar } from '../chat/mention-trigger';

/** Characters of message text a snippet shows before the hit. */
const SNIPPET_LEAD = 30;

/** Characters of message text a snippet shows at most, hit included. */
const SNIPPET_LENGTH = 120;

/** Marks text that was cut off at the start or end of a snippet. */
const ELLIPSIS = '…';

/**
 * What the search field asks for (DA checklist Schreiben US6): channels after `#`, people after
 * `@`, otherwise channels, people and messages that contain the text.
 */
export interface SearchQuery {
  readonly char: MentionChar | null;
  readonly text: string;
}

/** Part of a message around the first hit, split so the hit can be marked. */
export interface Snippet {
  readonly before: string;
  readonly hit: string;
  readonly after: string;
}

/** Reads the search field; null while it is empty. */
export function readSearch(value: string): SearchQuery | null {
  const text = value.trim();
  if (!text) {
    return null;
  }
  if (text.startsWith('#') || text.startsWith('@')) {
    return { char: text[0] as MentionChar, text: text.slice(1).trim() };
  }
  return { char: null, text };
}

/** Whether `text` contains `query`, ignoring case; an empty query is in every text. */
export function contains(text: string, query: string): boolean {
  return text.toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de'));
}

/** At most `SNIPPET_LENGTH` characters of `text`, starting a little before the first hit. */
export function toSnippet(text: string, query: string): Snippet {
  const at = Math.max(0, text.toLocaleLowerCase('de').indexOf(query.toLocaleLowerCase('de')));
  const start = Math.max(0, at - SNIPPET_LEAD);
  const hitEnd = at + query.length;
  const end = Math.max(hitEnd, Math.min(text.length, start + SNIPPET_LENGTH));
  return {
    before: (start > 0 ? ELLIPSIS : '') + text.slice(start, at),
    hit: text.slice(at, hitEnd),
    after: text.slice(hitEnd, end) + (end < text.length ? ELLIPSIS : ''),
  };
}
