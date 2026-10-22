import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

/** Presence states the design shows on avatars ("Aktiv" and "Abwesend"). */
export type AvatarStatus = 'online' | 'away';

/** From this size on the avatar gets the larger presence dot (Figma). */
const LARGE_AVATAR_SIZE = 70;

/** Presence dot on avatars below 70 px. */
const DOT_SIZE_SMALL = 14;

/** Presence dot on avatars from 70 px. */
const DOT_SIZE_LARGE = 17;

/**
 * Round user picture with an optional presence dot at the bottom right
 * (Figma: 14 px dot on 50 px avatars, 17 px dot from 70 px, 2 px ring).
 * The ring colour follows `--avatar-ring`, white by default. Set `priority` when the avatar
 * is the largest image on the page (choose-avatar, profile). `size` is the width it aims for;
 * in a narrower container it shrinks and stays round.
 */
@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  host: { '[style.width.px]': 'size()' },
})
export class Avatar {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly size = input(50);
  readonly status = input<AvatarStatus | null>(null);
  readonly priority = input(false);
  readonly dotSize = computed(() =>
    this.size() >= LARGE_AVATAR_SIZE ? DOT_SIZE_LARGE : DOT_SIZE_SMALL,
  );
  readonly statusLabel = computed(() => (this.status() === 'online' ? 'Aktiv' : 'Abwesend'));
}
