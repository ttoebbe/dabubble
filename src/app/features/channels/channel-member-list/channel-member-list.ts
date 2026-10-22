import { Component, input, output } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';

/**
 * Members of a channel with the entry "Mitglieder hinzufügen" (Figma `43. Members` 388:2470,
 * `42.` 392:2831). Used in the members dialog and, on mobile, in the channel settings.
 */
@Component({
  selector: 'app-channel-member-list',
  imports: [Avatar],
  templateUrl: './channel-member-list.html',
  styleUrl: './channel-member-list.scss',
})
export class ChannelMemberList {
  readonly members = input.required<readonly MenuContact[]>();
  readonly memberSelected = output<string>();
  readonly addMembers = output<void>();
}
