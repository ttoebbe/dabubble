import {
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Channel } from '../models/channel';

/**
 * Document id of the channel every new account joins. The Firestore rules let a person add
 * only themselves, and only to this channel (docs/arbeitsteilung.md).
 */
export const START_CHANNEL_ID = 'entwicklerteam';

/**
 * Name and description of the start channel: Figma shows "Entwicklerteam" (`364:2317`); its
 * sample description says "#dfsdf", here replaced by the channel name (spec 8.13).
 */
const START_CHANNEL = {
  name: 'Entwicklerteam',
  description:
    'Dieser Channel ist für alles rund um das Entwicklerteam vorgesehen. Hier kannst du ' +
    'zusammen mit deinem Team Meetings abhalten, Dokumente teilen und Entscheidungen treffen.',
};

/**
 * Makes sure the start channel exists and, for a new account (`join`), that it is a member.
 * The first person who signs in creates it and is shown as its creator.
 */
export async function prepareStartChannel(
  firestore: Firestore,
  uid: string,
  join: boolean,
): Promise<void> {
  const ref = doc(firestore, 'channels', START_CHANNEL_ID);
  await runTransaction(firestore, async (transaction) => {
    const existing = await transaction.get(ref);
    if (!existing.exists()) {
      transaction.set(ref, newStartChannel(uid));
    } else if (join) {
      transaction.update(ref, { memberIds: arrayUnion(uid) });
    }
  });
}

/** The start channel as its first member creates it. */
function newStartChannel(uid: string): Omit<Channel, 'id'> {
  return { ...START_CHANNEL, creatorId: uid, memberIds: [uid], createdAt: Date.now() };
}

/**
 * Removes a person from every channel, e.g. a guest before the account is deleted. Channels the
 * signed-in person may not change (not a member) are skipped.
 */
export async function leaveAllChannels(firestore: Firestore, uid: string): Promise<void> {
  const memberOf = query(
    collection(firestore, 'channels'),
    where('memberIds', 'array-contains', uid),
  );
  const snapshot = await getDocs(memberOf);
  await Promise.allSettled(
    snapshot.docs.map((entry) => updateDoc(entry.ref, { memberIds: arrayRemove(uid) })),
  );
}
