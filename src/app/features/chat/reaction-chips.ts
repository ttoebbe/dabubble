import { ChatEmoji, CHAT_EMOJIS } from './chat-emojis';

/** Most different reactions per message; `firestore.rules` refuses a 21st. */
export const MAX_REACTIONS = 20;

/** Name shown for a reaction of a person without profile, e.g. a guest who has logged out. */
const UNKNOWN_NAME = 'Gast';

/** Name shown for the signed-in person. */
const SELF_NAME = 'Du';

/** One reaction chip under a message: the emoji, how many reacted and who. */
export interface ReactionChip {
  readonly emoji: ChatEmoji;
  readonly count: number;
  /** Whether the signed-in person reacted with this emoji. */
  readonly own: boolean;
  /** Bold part of the tooltip, e.g. "Sofia Müller und Du". */
  readonly names: string;
  /** Rest of the tooltip: "hat reagiert" or "haben reagiert". */
  readonly verb: string;
}

/** Joins names with commas and "und": "A", "A und B", "A, B und C". */
function joinNames(names: readonly string[]): string {
  if (names.length < 2) {
    return names.join('');
  }
  return `${names.slice(0, -1).join(', ')} und ${names[names.length - 1]}`;
}

/** Names of the people behind a reaction; the signed-in person comes last as "Du". */
function reactorNames(
  uids: readonly string[],
  selfUid: string | null,
  nameOf: (uid: string) => string | undefined,
): string[] {
  const names = uids.filter((uid) => uid !== selfUid).map((uid) => nameOf(uid) ?? UNKNOWN_NAME);
  return uids.includes(selfUid ?? '') ? [...names, SELF_NAME] : names;
}

/** Verb of the tooltip: "hat", "hast" (for "Du") or "haben" reagiert. */
function reactedVerb(names: readonly string[]): string {
  if (names.length > 1) {
    return 'haben reagiert';
  }
  return names[0] === SELF_NAME ? 'hast reagiert' : 'hat reagiert';
}

/**
 * Turns the stored reactions (emoji id → uids) into chips in the order of the emoji list.
 * Ids that are not in the list are skipped.
 */
export function buildChips(
  reactions: Record<string, string[]>,
  selfUid: string | null,
  nameOf: (uid: string) => string | undefined,
): ReactionChip[] {
  return CHAT_EMOJIS.filter((emoji) => reactions[emoji.id]?.length).map((emoji) => {
    const uids = reactions[emoji.id];
    const names = reactorNames(uids, selfUid, nameOf);
    const own = uids.includes(selfUid ?? '');
    return { emoji, count: uids.length, own, names: joinNames(names), verb: reactedVerb(names) };
  });
}
