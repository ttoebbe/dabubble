import { Firestore, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { AppUser } from '../models/app-user';
import { leaveAllChannels } from './channel-membership';

/** A guest without a sign of life for this long closed the tab without logging out. */
const STALE_GUEST_MS = 24 * 60 * 60 * 1000;

/**
 * Whether a profile belongs to a guest who left without logging out: no sign of life
 * (`lastActiveAt`) for a day, or none at all on profiles from before 24.10.2026.
 */
export function isStaleGuest(user: AppUser, now: number): boolean {
  return user.isGuest && (user.lastActiveAt ?? 0) < now - STALE_GUEST_MS;
}

/**
 * Cleans up guests who closed the tab instead of logging out (ttoebbe/dabubble#6): each one
 * leaves the channels the signed-in person belongs to, then its profile is deleted. The
 * anonymous account itself stays, because Firebase lets only its owner delete it; it shows up
 * nowhere in the app. Best effort, one guest failing does not stop the others.
 */
export async function removeStaleGuests(firestore: Firestore, selfUid: string): Promise<void> {
  const guests = await getDocs(query(collection(firestore, 'users'), where('isGuest', '==', true)));
  const now = Date.now();
  const stale = guests.docs
    .map((entry) => entry.data() as AppUser)
    .filter((user) => user.uid !== selfUid && isStaleGuest(user, now));
  await Promise.allSettled(stale.map(({ uid }) => removeStaleGuest(firestore, uid)));
}

/** Removes one stale guest from the channels, then deletes the profile. */
async function removeStaleGuest(firestore: Firestore, uid: string): Promise<void> {
  await leaveAllChannels(firestore, uid).catch(() => undefined);
  await deleteDoc(doc(firestore, 'users', uid));
}
