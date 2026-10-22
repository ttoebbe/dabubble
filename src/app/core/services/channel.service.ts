import { Service, computed, effect, inject, signal } from '@angular/core';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { Channel } from '../models/channel';
import { AuthService } from './auth.service';
import { FIRESTORE } from './firebase';

/** Channels of a snapshot, oldest first, so new ones appear at the bottom (Figma Note 7). */
function toSortedChannels(docs: readonly QueryDocumentSnapshot[]): Channel[] {
  const channels = docs.map((entry) => ({ ...entry.data(), id: entry.id }) as Channel);
  return channels.sort((first, second) => first.createdAt - second.createdAt);
}

/** What a new channel needs besides its creator. */
export interface ChannelDraft {
  readonly name: string;
  readonly description: string;
  readonly memberIds: readonly string[];
}

/**
 * Channels of the workspace (area A, interface `channels` in docs/arbeitsteilung.md).
 * All channels are read, so that names can be checked for duplicates (DA checklist
 * Channels US1/US4); `channels` holds those the signed-in person belongs to, oldest first.
 */
@Service()
export class ChannelService {
  private readonly firestore = inject(FIRESTORE);
  private readonly auth = inject(AuthService);
  readonly allChannels = signal<Channel[]>([]);
  readonly channels = computed(() => {
    const uid = this.auth.uid();
    return this.allChannels().filter((channel) => uid && channel.memberIds.includes(uid));
  });

  constructor() {
    effect((onCleanup) => {
      if (!this.auth.uid()) {
        this.allChannels.set([]);
        return;
      }
      onCleanup(this.followChannels());
    });
  }

  /** Creates a channel with the signed-in person as creator and member; returns its id. */
  async create(draft: ChannelDraft): Promise<string> {
    const creatorId = this.auth.uid() ?? '';
    const memberIds = [...new Set([creatorId, ...draft.memberIds])];
    const channel = { ...draft, creatorId, memberIds, createdAt: Date.now() };
    const created = await addDoc(collection(this.firestore, 'channels'), channel);
    return created.id;
  }

  /** Changes name and description. */
  async update(id: string, changes: Partial<Pick<Channel, 'name' | 'description'>>): Promise<void> {
    await updateDoc(this.channelRef(id), changes);
  }

  /** Adds people to a channel. */
  async addMembers(id: string, memberIds: readonly string[]): Promise<void> {
    await updateDoc(this.channelRef(id), { memberIds: arrayUnion(...memberIds) });
  }

  /** Removes the signed-in person from a channel (DA checklist Channels US3). */
  async leave(id: string): Promise<void> {
    await updateDoc(this.channelRef(id), { memberIds: arrayRemove(this.auth.uid()) });
  }

  /**
   * Listens to all channels; returns the function that stops listening.
   * Access ends with the sign-out, so a rejected listener just empties the list.
   */
  private followChannels(): () => void {
    return onSnapshot(
      collection(this.firestore, 'channels'),
      (snapshot) => this.allChannels.set(toSortedChannels(snapshot.docs)),
      () => this.allChannels.set([]),
    );
  }

  /** Document of a channel. */
  private channelRef(id: string) {
    return doc(this.firestore, 'channels', id);
  }
}
