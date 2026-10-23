import { Component, computed, input, output, signal } from '@angular/core';
import { ReactionChip } from '../reaction-chips';

/** Chips shown on mobile before "+x weitere" (Figma note 11). */
const COLLAPSED_COUNT = 7;

/**
 * Reaction chips under a message (Figma `54.–57. … reaction`): emoji and count, the own
 * reaction marked, a click toggles it. Hover or focus shows who reacted. On mobile only
 * seven chips show, the rest hides behind "+x weitere" and "Weniger anzeigen" (Figma note 11);
 * `limited` (inside a thread) does so on every screen size.
 */
@Component({
  selector: 'app-message-reactions',
  templateUrl: './message-reactions.html',
  styleUrl: './message-reactions.scss',
})
export class MessageReactions {
  readonly chips = input.required<readonly ReactionChip[]>();
  readonly alignEnd = input(false);
  readonly limited = input(false);
  readonly toggled = output<string>();
  readonly expanded = signal(false);
  readonly collapsedCount = COLLAPSED_COUNT;
  readonly hiddenCount = computed(() => Math.max(0, this.chips().length - COLLAPSED_COUNT));

  /** Shows all chips on mobile, or only seven again. */
  toggleExpanded(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
