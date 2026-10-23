import { Service, computed, inject, linkedSignal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CHAT_EMOJIS, ChatEmoji } from './chat-emojis';

/** Emojis of the reaction bar before anything was used: check and raised hands (Figma `52B.`). */
const DEFAULT_IDS = ['check', 'raised-hands'];

/** How many emojis the reaction bar offers directly. */
const QUICK_COUNT = 2;

/** localStorage key of the recent emojis of one person (decision ttoebbe/dabubble#1). */
const storageKey = (uid: string | null): string => `dabubble.recentEmojis.${uid}`;

/** Reads the stored ids of a person; anything unreadable or unknown counts as nothing used. */
function readIds(uid: string | null): string[] {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(storageKey(uid)) ?? '[]');
    return Array.isArray(ids) ? ids.filter((id) => CHAT_EMOJIS.some((e) => e.id === id)) : [];
  } catch {
    return [];
  }
}

/**
 * The emojis the signed-in person used last, kept in `localStorage` per uid. `quick` are the
 * two the reaction bar offers: the most recent ones, topped up with the defaults.
 */
@Service()
export class RecentEmojis {
  private readonly uid = inject(AuthService).uid;
  private readonly ids = linkedSignal(() => readIds(this.uid()));
  readonly quick = computed<ChatEmoji[]>(() =>
    [...this.ids(), ...DEFAULT_IDS]
      .filter((id, index, all) => all.indexOf(id) === index)
      .slice(0, QUICK_COUNT)
      .map((id) => CHAT_EMOJIS.find((emoji) => emoji.id === id)!),
  );

  /** Remembers an emoji as the most recently used one. */
  use(emojiId: string): void {
    const ids = [emojiId, ...this.ids().filter((id) => id !== emojiId)].slice(0, QUICK_COUNT);
    this.ids.set(ids);
    try {
      localStorage.setItem(storageKey(this.uid()), JSON.stringify(ids));
    } catch {
      // Storage full or blocked: the choice only lasts for this session.
    }
  }
}
