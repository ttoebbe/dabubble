import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { describeAuthError, errorCode } from '../auth-errors';
import { AvatarChoice } from '../avatar-choice/avatar-choice';
import { EMPTY_SIGN_UP, SignUpDraft, SignUpForm } from '../sign-up-form/sign-up-form';
import { Toast, waitForToast } from '../toast/toast';

/**
 * Sign-up in two steps on one page: form, then avatar; the account is created with the avatar,
 * then the toast "Konto erfolgreich erstellt!" and the login follow (Figma prototype
 * 02 → 03 → 03B → 01). A taken e-mail leads back to the form with the message at the field.
 */
@Component({
  selector: 'app-sign-up',
  imports: [AvatarChoice, SignUpForm, Toast],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly step = signal<'form' | 'avatar'>('form');
  readonly draft = signal<SignUpDraft>(EMPTY_SIGN_UP);
  readonly takenEmail = signal<string | null>(null);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly created = signal(false);

  /** Keeps the entries and moves on to the avatar. */
  showAvatarStep(draft: SignUpDraft): void {
    this.draft.set(draft);
    this.error.set(null);
    this.step.set('avatar');
  }

  /** Leaves the sign-up for the login page. */
  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  /** Creates the account with the chosen avatar, confirms it and returns to the login. */
  async finish(avatarUrl: string): Promise<void> {
    this.busy.set(true);
    try {
      await this.auth.signUp({ ...this.draft(), avatarUrl });
      this.created.set(true);
      await waitForToast();
      await this.router.navigateByUrl('/login');
    } catch (error) {
      this.showFailure(error);
    } finally {
      this.busy.set(false);
    }
  }

  /** A taken e-mail goes back to the form, anything else stays under the avatars. */
  private showFailure(error: unknown): void {
    if (errorCode(error) === 'auth/email-already-in-use') {
      this.takenEmail.set(this.draft().email);
      this.step.set('form');
    } else {
      this.error.set(describeAuthError(error));
    }
  }
}
