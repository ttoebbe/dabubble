import { Component, input, output } from '@angular/core';
import { Brand } from '../../../shared/components/brand/brand';
import { ProfileDetails } from '../../profile/profile-details';
import { ProfileMenu } from '../../profile/profile-menu/profile-menu';

/**
 * Top bar of the workspace: DABubble logo, a place for the search (area B) and the
 * profile menu. On mobile a back arrow leads from thread to chat to menu.
 */
@Component({
  selector: 'app-workspace-header',
  imports: [Brand, ProfileMenu],
  templateUrl: './workspace-header.html',
  styleUrl: './workspace-header.scss',
})
export class WorkspaceHeader {
  readonly profile = input.required<ProfileDetails>();
  readonly showBack = input(false);
  readonly back = output<void>();
}
