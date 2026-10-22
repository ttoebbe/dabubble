/** Online state of a person (DA checklist Konto US6). */
export type Presence = 'online' | 'away' | 'offline';

/** A person in DABubble, stored in `users/{uid}` (proposal ttoebbe/dabubble#1). */
export interface AppUser {
  uid: string;
  name: string;
  /** Empty for guests. */
  email: string;
  /** One of the six avatars, e.g. `img/avatars/sofia-mueller.svg`. */
  avatarUrl: string;
  isGuest: boolean;
  presence: Presence;
}
