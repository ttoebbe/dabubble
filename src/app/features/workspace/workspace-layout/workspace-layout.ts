import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { UserService } from '../../../core/services/user.service';
import { ChannelDialogHost } from '../../channels/channel-dialog-host/channel-dialog-host';
import { ChannelDialogs } from '../../channels/channel-dialogs';
import {
  CreateChannelDialog,
  NewChannel,
} from '../../channels/create-channel-dialog/create-channel-dialog';
import { PersonProfile } from '../../profile/person-profile/person-profile';
import { MenuToggle } from '../menu-toggle/menu-toggle';
import { WorkspaceHeader } from '../workspace-header/workspace-header';
import { toMenuContacts } from '../workspace-menu/menu-entries';
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
  imports: [
    RouterOutlet,
    MenuToggle,
    WorkspaceHeader,
    WorkspaceMenu,
    CreateChannelDialog,
    ChannelDialogHost,
    PersonProfile,
  ],
  templateUrl: './workspace-layout.html',
  styleUrl: './workspace-layout.scss',
  host: {
    '[class.workspace--menu-collapsed]': 'menuCollapsed()',
    '[class.workspace--chat-open]': 'chatOpen()',
    '[class.workspace--thread-open]': 'threadOpen()',
  },
})
export class WorkspaceLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly channelService = inject(ChannelService);
  private readonly channelDialogs = inject(ChannelDialogs);
  readonly menuId = 'workspace-menu';
  readonly menuCollapsed = signal(false);
  readonly chatOpen = signal(false);
  readonly threadOpen = signal(false);
  readonly channels = computed(() =>
    this.channelService.channels().map(({ id, name }) => ({ id, name })),
  );
  readonly channelNames = computed(() => this.channelService.allChannels().map((c) => c.name));
  readonly contacts = computed(() => toMenuContacts(this.users.users(), this.auth.uid()));
  readonly people = computed(() => this.contacts().filter((contact) => !contact.isSelf));
  readonly activeEntryId = signal<string | null>(null);
  readonly createChannelOpen = signal(false);

  /** Collapses or expands the workspace menu. */
  toggleMenu(): void {
    this.menuCollapsed.update((collapsed) => !collapsed);
  }

  /**
   * Stores a new channel; it appears at the bottom of the channel list (Figma Note 7)
   * and is selected. "Alle Mitglieder" means everybody in the menu, so no hidden guests. A
   * failure is shown by the dialog.
   */
  readonly addChannel = async (channel: NewChannel): Promise<void> => {
    const memberIds =
      channel.memberIds === 'all'
        ? this.contacts().map((contact) => contact.id)
        : channel.memberIds;
    const id = await this.channelService.create({ ...channel, memberIds });
    this.activeEntryId.set(id);
    this.createChannelOpen.set(false);
  };

  /** Selects the person for a direct message and closes a channel dialog still open behind. */
  openDirectMessage(uid: string): void {
    this.channelDialogs.close();
    this.activeEntryId.set(uid);
  }

  /** Deselects a channel the person has just left. */
  forgetChannel(id: string): void {
    if (this.activeEntryId() === id) {
      this.activeEntryId.set(null);
    }
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
