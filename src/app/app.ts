import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component of DABubble. Renders the active route; the areas own their
 * routes in their feature folders (see docs/arbeitsteilung.md).
 */
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
