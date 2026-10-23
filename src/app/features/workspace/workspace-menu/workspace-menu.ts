import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { WorkspaceSearch } from '../../search/workspace-search/workspace-search';
import { MenuSection } from '../menu-section/menu-section';
import { MenuChannel, MenuContact } from './menu-entries';

/**
 * Content of the workspace menu (Figma `Menu 1 - channels + workspaces` 210:1203, mobile
 * 678:15602): workspace head, channels and direct messages; on mobile the search "Gehe zu..."
 * on top. The menu only reports what was
 * chosen; the workspace frame decides where that leads.
 */
@Component({
  selector: 'app-workspace-menu',
  imports: [NgOptimizedImage, Avatar, MenuSection, WorkspaceSearch],
  templateUrl: './workspace-menu.html',
  styleUrl: './workspace-menu.scss',
})
export class WorkspaceMenu {
  readonly channels = input.required<readonly MenuChannel[]>();
  readonly contacts = input.required<readonly MenuContact[]>();
  readonly activeId = input<string | null>(null);
  readonly channelSelected = output<string>();
  readonly contactSelected = output<string>();
  readonly addChannel = output<void>();
  readonly newMessage = output<void>();
}
