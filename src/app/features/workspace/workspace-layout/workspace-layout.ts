import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MenuToggle } from '../menu-toggle/menu-toggle';
import { WorkspaceHeader } from '../workspace-header/workspace-header';
import { SAMPLE_CHANNELS, SAMPLE_CONTACTS } from '../workspace-menu/menu-entries';
import { WorkspaceMenu } from '../workspace-menu/workspace-menu';

/**
 * Workspace frame after login (Figma `06-Slack Clone Desktop general view`, spec 2.4):
 * header, workspace menu, chat and thread. Area B renders chat views into the primary
 * outlet and threads into the outlet `thread`; the frame only tracks which one is active.
 * From 1440 px all three panels sit side by side, from 768 px at most two, below
 * that one panel at a time (menu → chat → thread).
 */
@Component({
  selector: 'app-workspace-layout',
  imports: [RouterOutlet, MenuToggle, WorkspaceHeader, WorkspaceMenu],
  templateUrl: './workspace-layout.html',
  styleUrl: './workspace-layout.scss',
  host: {
    '[class.workspace--menu-collapsed]': 'menuCollapsed()',
    '[class.workspace--chat-open]': 'chatOpen()',
    '[class.workspace--thread-open]': 'threadOpen()',
  },
})
export class WorkspaceLayout {
  readonly menuId = 'workspace-menu';
  readonly menuCollapsed = signal(false);
  readonly chatOpen = signal(false);
  readonly threadOpen = signal(false);
  readonly channels = SAMPLE_CHANNELS;
  readonly contacts = SAMPLE_CONTACTS;
  readonly activeEntryId = signal<string | null>(null);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Collapses or expands the workspace menu. */
  toggleMenu(): void {
    this.menuCollapsed.update((collapsed) => !collapsed);
  }

  /** One step back in the mobile view order: thread → chat → menu. */
  goBack(): void {
    if (this.threadOpen()) {
      this.router.navigate([{ outlets: { thread: null } }], { relativeTo: this.route });
    } else {
      this.router.navigate(['/workspace']);
    }
  }
}
