import { Component, input, output } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';

/**
 * Member list of a channel (Figma `43. Members` 388:2470) with the entry
 * "Mitglieder hinzufügen" (`42.` 392:2831). The channel header of area B opens it;
 * the parent reacts to the chosen person (profile) and to the add request.
 */
@Component({
  selector: 'app-channel-members-dialog',
  imports: [Avatar, Dialog],
  templateUrl: './channel-members-dialog.html',
  styleUrl: './channel-members-dialog.scss',
})
export class ChannelMembersDialog {
  readonly open = input(false);
  readonly members = input.required<readonly MenuContact[]>();
  readonly closed = output<void>();
  readonly memberSelected = output<string>();
  readonly addMembers = output<void>();
}
