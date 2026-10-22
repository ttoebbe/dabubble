import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  CreateChannelDialog,
  NewChannel,
} from '../../channels/create-channel-dialog/create-channel-dialog';
import { SAMPLE_OWN_PROFILE } from '../../profile/profile-details';
import { MenuToggle } from '../menu-toggle/menu-toggle';
import { WorkspaceHeader } from '../workspace-header/workspace-header';
import { MenuChannel, SAMPLE_CHANNELS, SAMPLE_CONTACTS } from '../workspace-menu/menu-entries';
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
  imports: [RouterOutlet, MenuToggle, WorkspaceHeader, WorkspaceMenu, CreateChannelDialog],
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
  readonly currentUser = SAMPLE_OWN_PROFILE;
  readonly channels = signal<readonly MenuChannel[]>(SAMPLE_CHANNELS);
  readonly channelNames = computed(() => this.channels().map((channel) => channel.name));
  readonly contacts = SAMPLE_CONTACTS;
  readonly people = SAMPLE_CONTACTS.filter((contact) => !contact.isSelf);
  readonly activeEntryId = signal<string | null>(null);
  readonly createChannelOpen = signal(false);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Collapses or expands the workspace menu. */
  toggleMenu(): void {
    this.menuCollapsed.update((collapsed) => !collapsed);
  }

  /**
   * Adds a new channel at the bottom of the channel list (Figma Note 7) and selects it.
   * Kept in this frame until `ChannelService` stores channels in Firestore (docs/todo.md).
   */
  addChannel(channel: NewChannel): void {
    const id = crypto.randomUUID();
    this.channels.update((channels) => [...channels, { id, name: channel.name }]);
    this.activeEntryId.set(id);
    this.createChannelOpen.set(false);
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
