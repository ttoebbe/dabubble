import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Top bar of the workspace: DABubble logo, a place for the search (area B) and a place
 * for the profile menu. On mobile a back arrow leads from thread to chat to menu.
 */
@Component({
  selector: 'app-workspace-header',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './workspace-header.html',
  styleUrl: './workspace-header.scss',
})
export class WorkspaceHeader {
  readonly showBack = input(false);
  readonly back = output<void>();
}
