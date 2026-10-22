import { Component, computed, input, output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';
import { ChannelInfo } from '../channel-info';
import { ChannelMemberList } from '../channel-member-list/channel-member-list';
import { ChannelSetting } from '../channel-setting/channel-setting';

/**
 * Channel settings (Figma `Channel Edition` 364:2288, mobile 719:15164, DA checklist
 * Channels US3 and US4): rename, change the description, see the creator and leave the
 * channel. On mobile the members are listed as well. The channel header of area B opens it;
 * the parent stores the changes.
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
  readonly renamed = output<string>();
  readonly descriptionChanged = output<string>();
  readonly left = output<void>();
  readonly memberSelected = output<string>();
  readonly addMembers = output<void>();
  readonly heading = computed(() => `# ${this.channel().name}`);
}
