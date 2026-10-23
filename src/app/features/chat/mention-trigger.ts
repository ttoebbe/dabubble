/** Character that opens the mention list: `@` for people, `#` for channels. */
export type MentionChar = '@' | '#';

/** A started mention at the cursor, e.g. `@so` → `{ char: '@', start: 4, query: 'so' }`. */
export interface MentionTrigger {
  readonly char: MentionChar;
  /** Index of the trigger character in the text. */
  readonly start: number;
  /** What was typed after the trigger character. */
  readonly query: string;
}

/** Entry of the mention list: a person (with avatar) or a channel. */
export interface MentionOption {
  readonly id: string;
  readonly label: string;
  readonly avatarUrl?: string;
}

/** Id of the option at `index` in the list `listId`; the message box points to it as active. */
export function optionId(listId: string, index: number): string {
  return `${listId}-${index}`;
}

/** Trigger character at the start of the text or after a space, then letters up to the cursor. */
const TRIGGER = /(?:^|\s)([@#])([^\s@#]*)$/;

/** Finds the mention the cursor is in, or null. An `@` inside a word (e-mail address) is none. */
export function findTrigger(text: string, caret: number): MentionTrigger | null {
  const match = TRIGGER.exec(text.slice(0, caret));
  if (!match) {
    return null;
  }
  const query = match[2];
  return { char: match[1] as MentionChar, start: caret - query.length - 1, query };
}

/** Options whose label contains the typed text, ignoring case; labels that start with it first. */
export function filterOptions(options: readonly MentionOption[], query: string): MentionOption[] {
  const wanted = query.toLowerCase();
  const matches = options.filter((option) => option.label.toLowerCase().includes(wanted));
  const starts = (option: MentionOption) => option.label.toLowerCase().startsWith(wanted);
  return [...matches.filter(starts), ...matches.filter((option) => !starts(option))];
}
