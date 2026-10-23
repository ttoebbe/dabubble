import { AVATAR_PLACEHOLDER } from '../../core/services/auth.service';
import { AppUser } from '../../core/models/app-user';
import { MentionChar, MentionOption, filterOptions } from '../chat/mention-trigger';

/** Where a new message goes: a channel or the direct chat with a person. */
export interface Recipient {
  readonly kind: 'channel' | 'dm';
  /** Channel id, or the uid of the person. */
  readonly id: string;
}

/**
 * What the address field asks for (DA checklist Schreiben US4): channels after `#`, people
 * after `@`, otherwise people by name or e-mail address.
 */
export interface AddressQuery {
  readonly char: MentionChar;
  readonly query: string;
  readonly byMail: boolean;
}

/** Reads the typed address; null while the field is empty. */
export function readAddress(text: string): AddressQuery | null {
  const value = text.trim();
  if (!value) {
    return null;
  }
  if (value.startsWith('#') || value.startsWith('@')) {
    return { char: value[0] as MentionChar, query: value.slice(1), byMail: false };
  }
  return { char: '@', query: value, byMail: true };
}

/** A person as entry of the recipient list. */
function toOption(person: AppUser): MentionOption {
  return { id: person.uid, label: person.name, avatarUrl: person.avatarUrl || AVATAR_PLACEHOLDER };
}

/** People that match a query, by name; with `byMail` also by e-mail address. */
export function matchPeople(people: readonly AppUser[], address: AddressQuery): MentionOption[] {
  const byName = filterOptions(people.map(toOption), address.query);
  if (!address.byMail) {
    return byName;
  }
  const wanted = address.query.toLowerCase();
  const named = new Set(byName.map((option) => option.id));
  const byMail = people.filter(
    (person) => !named.has(person.uid) && person.email.toLowerCase().includes(wanted),
  );
  return [...byName, ...byMail.map(toOption)];
}
