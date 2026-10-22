import { Schema, ValidationError, required, schema, validate } from '@angular/forms/signals';

/** Error texts for channel names; Figma defines none (spec 8.9). */
export const CHANNEL_NAME_ERRORS = {
  missing: '*Bitte gib einen Channel-Namen ein.',
  taken: '*Diesen Channel-Namen gibt es schon.',
} as const;

/**
 * Rules for a channel name: not empty and not used by another channel, ignoring case and
 * outer spaces (DA checklist, Channels US1 and US4). `takenNames` is read on every check, so
 * it may be a signal.
 */
export function channelNameRules(takenNames: () => readonly string[]): Schema<string> {
  return schema<string>((path) => {
    required(path, { message: CHANNEL_NAME_ERRORS.missing });
    validate(path, ({ value }) => checkChannelName(value(), takenNames()));
  });
}

/** Error for a blank name or one that is already taken. */
function checkChannelName(name: string, takenNames: readonly string[]): ValidationError | null {
  const wanted = name.trim().toLowerCase();
  if (!wanted) {
    return { kind: 'blank', message: CHANNEL_NAME_ERRORS.missing };
  }
  const taken = takenNames.some((existing) => existing.toLowerCase() === wanted);
  return taken ? { kind: 'taken', message: CHANNEL_NAME_ERRORS.taken } : null;
}
