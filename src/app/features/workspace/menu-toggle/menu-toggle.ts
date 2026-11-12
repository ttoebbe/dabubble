import { Component, computed, input, output } from '@angular/core';

/**
 * Vertical tab at the left edge that collapses and expands the workspace menu
 * (Figma `77. Hide/show navigation bar`, DA checklist Konto US5).
 */
@Component({
  selector: 'app-menu-toggle',
  templateUrl: './menu-toggle.html',
  styleUrl: './menu-toggle.scss',
  host: { '[class.menu-toggle--collapsed]': 'collapsed()' },
})
export class MenuToggle {
  readonly collapsed = input(false);
  readonly controls = input.required<string>();
  readonly toggled = output<void>();

  /** Visible button text; also rendered bold but hidden to reserve the hover width. */
  protected readonly label = computed(() =>
    this.collapsed() ? 'Workspace-Menü öffnen' : 'Workspace-Menü schließen',
  );
}
