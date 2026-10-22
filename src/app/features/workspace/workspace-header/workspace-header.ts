import { NgOptimizedImage } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { Brand } from '../../../shared/components/brand/brand';
import { ProfileDetails } from '../../profile/profile-details';
import { ProfileMenu } from '../../profile/profile-menu/profile-menu';

/**
 * Top bar of the workspace: DABubble logo, a place for the search (area B) and the
 * profile menu. On mobile a chat or thread shows a back arrow and the workspace name
 * (Figma `15B. Channel name`) instead of the logo; the arrow leads from thread to chat to menu.
 */
@Component({
  selector: 'app-workspace-header',
  imports: [NgOptimizedImage, Brand, ProfileMenu],
  host: { '[class.header--in-chat]': 'showBack()' },
  templateUrl: './workspace-header.html',
  styleUrl: './workspace-header.scss',
})
export class WorkspaceHeader {
  readonly profile = model.required<ProfileDetails>();
  readonly showBack = input(false);
  readonly back = output<void>();
}
