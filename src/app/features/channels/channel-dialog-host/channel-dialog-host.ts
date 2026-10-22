import { Component, computed, inject, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { UserService } from '../../../core/services/user.service';
import { ProfileViewer } from '../../profile/profile-viewer';
import { MenuContact, toMenuContacts } from '../../workspace/workspace-menu/menu-entries';
import { AddMembersDialog } from '../add-members-dialog/add-members-dialog';
import { ChannelEditDialog } from '../channel-edit-dialog/channel-edit-dialog';
import { ChannelInfo } from '../channel-info';
import { ChannelMembersDialog } from '../channel-members-dialog/channel-members-dialog';
import { ChannelDialogs } from '../channel-dialogs';

/** Shown while no channel is chosen, so the closed dialogs have something to bind. */
const NO_CHANNEL: ChannelInfo = { id: '', name: '', description: '', creatorName: '' };

/**
 * Settings, members and "Leute hinzufügen" of the channel chosen through `ChannelDialogs`
 * (DA checklist Channels US2–US4). Changes go straight to `ChannelService`; a click on a
 * member opens the profile.
 */
@Component({
  selector: 'app-channel-dialog-host',
  imports: [AddMembersDialog, ChannelEditDialog, ChannelMembersDialog],
  templateUrl: './channel-dialog-host.html',
})
export class ChannelDialogHost {
  private readonly channelService = inject(ChannelService);
  private readonly users = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly profiles = inject(ProfileViewer);
  readonly dialogs = inject(ChannelDialogs);
  readonly left = output<string>();
  private readonly channel = computed(() =>
    this.channelService.allChannels().find((entry) => entry.id === this.dialogs.channelId()),
  );
  readonly info = computed<ChannelInfo>(() => {
    const channel = this.channel();
    if (!channel) {
      return NO_CHANNEL;
    }
    const creator = this.users.users().find((user) => user.uid === channel.creatorId);
    const { id, name, description } = channel;
    return { id, name, description, creatorName: creator?.name ?? '' };
  });
  readonly members = computed(() => this.contactsWhere(true));
  readonly outsiders = computed(() => this.contactsWhere(false));
  readonly otherChannelNames = computed(() =>
    this.channelService
      .allChannels()
      .filter((entry) => entry.id !== this.dialogs.channelId())
      .map((entry) => entry.name),
  );

  /** Renames the channel. */
  rename(name: string): Promise<void> {
    return this.channelService.update(this.info().id, { name });
  }

  /** Changes the description. */
  describe(description: string): Promise<void> {
    return this.channelService.update(this.info().id, { description });
  }

  /** Leaves the channel, closes the dialog and tells the workspace frame. */
  async leave(): Promise<void> {
    const id = this.info().id;
    this.dialogs.close();
    await this.channelService.leave(id);
    this.left.emit(id);
  }

  /** Switches to "Leute hinzufügen". */
  openAddMembers(): void {
    this.dialogs.open(this.info().id, 'add-members');
  }

  /** Adds the chosen people and closes the dialog. */
  async addMembers(memberIds: readonly string[]): Promise<void> {
    const id = this.info().id;
    this.dialogs.close();
    await this.channelService.addMembers(id, memberIds);
  }

  /** Opens the profile of a member. */
  showMember(uid: string): void {
    this.profiles.show(uid);
  }

  /** People of the workspace who are (or are not) in the channel. */
  private contactsWhere(inChannel: boolean): MenuContact[] {
    const memberIds = this.channel()?.memberIds ?? [];
    const people = this.users.users().filter((user) => memberIds.includes(user.uid) === inChannel);
    return toMenuContacts(people, this.auth.uid());
  }
}
