import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarChoice } from '../avatar-choice/avatar-choice';
import { EMPTY_SIGN_UP, SignUpDraft, SignUpForm } from '../sign-up-form/sign-up-form';
import { Toast, waitForToast } from '../toast/toast';

/**
 * Sign-up in two steps on one page: form, then avatar, then the toast "Konto erfolgreich
 * erstellt!" and back to the login (Figma prototype 02 → 03 → 03B → 01). Until Firebase
 * Authentication is set up (docs/todo.md) no account is stored.
 */
@Component({
  selector: 'app-sign-up',
  imports: [AvatarChoice, SignUpForm, Toast],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private readonly router = inject(Router);
  readonly step = signal<'form' | 'avatar'>('form');
  readonly draft = signal<SignUpDraft>(EMPTY_SIGN_UP);
  readonly created = signal(false);

  /** Keeps the entries and moves on to the avatar. */
  showAvatarStep(draft: SignUpDraft): void {
    this.draft.set(draft);
    this.step.set('avatar');
  }

  /** Leaves the sign-up for the login page. */
  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  /** Confirms the new account and returns to the login. */
  async finish(): Promise<void> {
    this.created.set(true);
    await waitForToast();
    await this.router.navigateByUrl('/login');
  }
}
