import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Brand } from '../../../shared/components/brand/brand';

/** Frame of the legal pages: DABubble logo at the top, page content below (Figma `18.`, `19.`). */
@Component({
  selector: 'app-legal-layout',
  imports: [Brand, RouterOutlet],
  templateUrl: './legal-layout.html',
  styleUrl: './legal-layout.scss',
})
export class LegalLayout {}
