/** Person or channel a text can mention: its id and the name that follows `@` or `#`. */
export interface MentionTarget {
  readonly id: string;
  readonly name: string;
}

/** Piece of a message text: plain text, or a mention that resolves to a person or channel. */
export interface TextPart {
  readonly kind: 'text' | 'user' | 'channel';
  readonly text: string;
  /** uid or channel id; empty for plain text. */
  readonly id: string;
}

/** A mention ends where the name does not go on. */
const NAME_END = String.raw`(?![\p{L}\p{N}_])`;

/** The names as a regular-expression alternation, longest first so "Anna Maria" beats "Anna". */
function alternation(items: readonly MentionTarget[]): string {
  return items
    .map((item) => item.name.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))
    .sort((first, second) => second.length - first.length)
    .join('|');
}

/** Pattern for `@name` and `#name` of the known targets; null when there are none. */
function buildPattern(
  users: readonly MentionTarget[],
  channels: readonly MentionTarget[],
): RegExp | null {
  const branch = (char: string, group: string, items: readonly MentionTarget[]) =>
    items.length ? `${char}(?<${group}>${alternation(items)})${NAME_END}` : '';
  const source = [branch('@', 'user', users), branch('#', 'channel', channels)];
  const joined = source.filter(Boolean).join('|');
  return joined ? new RegExp(String.raw`(?<![\p{L}\p{N}])(?:${joined})`, 'giu') : null;
}

/** Lower-case name → id. */
function idsByName(items: readonly MentionTarget[]): Map<string, string> {
  return new Map(items.map((item) => [item.name.toLowerCase(), item.id]));
}

/**
 * Splits a message text into plain text and mentions. Only `@Name` of a known person and
 * `#channel` of a known channel count; after a rename the old name stays plain text
 * (ttoebbe/dabubble#1).
 */
export function splitMentions(
  text: string,
  users: readonly MentionTarget[],
  channels: readonly MentionTarget[],
): TextPart[] {
  const pattern = buildPattern(users, channels);
  const lookup = { user: idsByName(users), channel: idsByName(channels) };
  const parts: TextPart[] = [];
  let end = 0;
  for (const match of pattern ? text.matchAll(pattern) : []) {
    parts.push(plain(text.slice(end, match.index)), toMention(match, lookup));
    end = match.index + match[0].length;
  }
  parts.push(plain(text.slice(end)));
  return parts.filter((part) => part.text);
}

/** Plain text part. */
function plain(text: string): TextPart {
  return { kind: 'text', text, id: '' };
}

/** Mention part for a match of the pattern, with the id of the person or channel it names. */
function toMention(
  match: RegExpMatchArray,
  lookup: Record<'user' | 'channel', Map<string, string>>,
): TextPart {
  const kind = match.groups?.['user'] === undefined ? 'channel' : 'user';
  return { kind, text: match[0], id: lookup[kind].get(match[0].slice(1).toLowerCase()) ?? '' };
}
