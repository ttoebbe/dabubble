import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * DABubble logo mark and name as one link (Figma `14. Home-Workspaces`):
 * 70 px mark and 156 px name on larger screens, 45 px and 106 px on mobile.
 */
@Component({
  selector: 'app-brand',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './brand.html',
  styleUrl: './brand.scss',
})
export class Brand {
  readonly link = input('/');
}
