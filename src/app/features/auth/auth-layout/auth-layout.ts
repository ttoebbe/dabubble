import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * Frame of the pages before login (Figma `01-Log In` 125:2, mobile 609:17202): logo where the
 * intro animation ends, the page itself and the links to imprint and privacy policy.
 */
@Component({
  selector: 'app-auth-layout',
  imports: [NgOptimizedImage, RouterLink, RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
