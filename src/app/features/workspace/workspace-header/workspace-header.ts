import { Component, input, output } from '@angular/core';
import { Brand } from '../../../shared/components/brand/brand';

/**
 * Top bar of the workspace: DABubble logo, a place for the search (area B) and a place
 * for the profile menu. On mobile a back arrow leads from thread to chat to menu.
 */
@Component({
  selector: 'app-workspace-header',
  imports: [Brand],
  templateUrl: './workspace-header.html',
  styleUrl: './workspace-header.scss',
})
export class WorkspaceHeader {
  readonly showBack = input(false);
  readonly back = output<void>();
}
