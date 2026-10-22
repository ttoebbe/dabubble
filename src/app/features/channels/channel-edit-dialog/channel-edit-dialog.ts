import { Component, computed, input, output, signal } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';
import { ChannelInfo } from '../channel-info';
import { ChannelMemberList } from '../channel-member-list/channel-member-list';
import { ChannelSetting } from '../channel-setting/channel-setting';

/**
 * Channel settings (Figma `Channel Edition` 364:2288, mobile 719:15164, DA checklist
 * Channels US3 and US4): rename, change the description, see the creator and leave the
 * channel. On mobile the members are listed as well. The parent passes the actions that store
 * the changes; a failed one shows a message (Channels US4).
 */
@Component({
  selector: 'app-channel-edit-dialog',
  imports: [Button, Dialog, ChannelMemberList, ChannelSetting],
  templateUrl: './channel-edit-dialog.html',
  styleUrl: './channel-edit-dialog.scss',
})
export class ChannelEditDialog {
  readonly open = input(false);
  readonly channel = input.required<ChannelInfo>();
  readonly otherChannelNames = input<readonly string[]>([]);
  readonly members = input<readonly MenuContact[]>([]);
  readonly closed = output<void>();
  readonly rename = input.required<(name: string) => Promise<void>>();
  readonly describe = input.required<(description: string) => Promise<void>>();
  readonly leave = input.required<() => Promise<void>>();
  readonly memberSelected = output<string>();
  readonly addMembers = output<void>();
  readonly heading = computed(() => `# ${this.channel().name}`);
  readonly leaveError = signal('');

  /** Closes the dialog; the next opening starts without an old message. */
  close(): void {
    this.leaveError.set('');
    this.closed.emit();
  }

  /** Leaves the channel; a failure shows a message next to the button. */
  async leaveChannel(): Promise<void> {
    this.leaveError.set('');
    try {
      await this.leave()();
    } catch {
      this.leaveError.set(AUTH_ERRORS.generic);
    }
  }
}
