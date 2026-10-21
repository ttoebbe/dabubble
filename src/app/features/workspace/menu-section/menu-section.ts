import { Component, computed, input, output, signal } from '@angular/core';

let nextSectionId = 0;

/**
 * Collapsible section of the workspace menu (Figma `17. Channels UX`, `23. Direktnachrichten UX`):
 * toggle with arrow, icon and heading, optional add button, projected list below.
 */
@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section.html',
  styleUrl: './menu-section.scss',
})
export class MenuSection {
  readonly heading = input.required<string>();
  readonly icon = input.required<string>();
  readonly addLabel = input<string | null>(null);
  readonly added = output<void>();
  readonly expanded = signal(true);
  readonly bodyId = `menu-section-${nextSectionId++}`;
  readonly iconMask = computed(() => `url(${this.icon()})`);

  /** Opens or closes the list of this section. */
  toggle(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
