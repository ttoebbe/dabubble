import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
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
import { activeEntryOf, channelLink, directMessageLink, newMessageLink } from '../chat-links';
import { watchMobile } from '../mobile-viewport';
import { MenuToggle } from '../menu-toggle/menu-toggle';
import { WorkspaceHeader } from '../workspace-header/workspace-header';
import { toMenuContacts } from '../workspace-menu/menu-entries';
import { WorkspaceMenu } from '../workspace-menu/workspace-menu';

/**
 * Workspace frame after login (Figma `06-Slack Clone Desktop general view`, spec 2.4):
 * header, workspace menu, chat and thread. Area B renders chat views into the primary
 * outlet and threads into the outlet `thread`; the menu opens them through those routes and
 * marks the entry of the open chat.
 * From 1440 px all three panels sit side by side, from 768 px at most two, below
 * that one panel at a time (menu → chat → thread). On the mobile menu page the menu is the
 * page's main content, so it takes the landmark role `main`; otherwise it is the navigation.
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
  private readonly mobile = watchMobile();
  readonly menuRole = computed(() => (this.mobile() && !this.chatOpen() ? 'main' : 'navigation'));
  readonly channels = computed(() =>
    this.channelService.channels().map(({ id, name }) => ({ id, name })),
  );
  readonly channelNames = computed(() => this.channelService.allChannels().map((c) => c.name));
  readonly contacts = computed(() => toMenuContacts(this.users.users(), this.auth.uid()));
  readonly people = computed(() => this.contacts().filter((contact) => !contact.isSelf));
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly activeEntryId = computed(() => activeEntryOf(this.router.parseUrl(this.url())));
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
    this.createChannelOpen.set(false);
    await this.router.navigate(channelLink(id));
  };

  /** Opens a channel in the chat area. */
  openChannel(id: string): void {
    this.router.navigate(channelLink(id));
  }

  /** Opens "Neue Nachricht" in the chat area. */
  openNewMessage(): void {
    this.router.navigate(newMessageLink());
  }

  /** Opens the direct message with a person and closes a channel dialog still open behind. */
  openDirectMessage(uid: string): void {
    this.channelDialogs.close();
    this.router.navigate(directMessageLink(uid));
  }

  /** Leaves the view of a channel the person has just left. */
  forgetChannel(id: string): void {
    if (this.activeEntryId() === id) {
      this.router.navigate(['/workspace']);
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
