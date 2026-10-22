import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

/** Length of the whole intro: logo animation, hold until 2.5 s, exit transition of 0.5 s. */
const INTRO_DURATION_MS = 3000;

/** Page shown after the intro; its logo sits where the animation ends. */
const INTRO_TARGET_URL = '/login';

/**
 * Intro with the logo animation (Figma `00-Intro` 128:765 / 609:17310, `1. Logo animation`
 * 169:93). The motion itself is pure CSS; this class only leaves the page once it has ended.
 */
@Component({
  selector: 'app-intro',
  imports: [NgOptimizedImage],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Starts the timer that leaves the intro when the animation has ended. */
  ngOnInit(): void {
    const timer = setTimeout(() => this.leaveIntro(), INTRO_DURATION_MS);
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }

  /** Replaces the intro in the history so that "back" does not replay it. */
  private leaveIntro(): void {
    this.router.navigateByUrl(INTRO_TARGET_URL, { replaceUrl: true });
  }
}
