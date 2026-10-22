import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, TreeValidationResult, apply, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { AuthCard } from '../auth-card/auth-card';
import { describeAuthError } from '../auth-errors';
import { EMAIL_RULES } from '../auth-validation';
import { Toast, waitForToast } from '../toast/toast';
import { visibleError } from '../visible-error';

/** Value of the forgot-password form. */
interface ForgotPasswordModel {
  email: string;
}

/**
 * "Passwort vergessen" (Figma `04-Send email` 182:319, mobile 609:17234, DA checklist Konto US3):
 * the user enters the e-mail address and gets a link to set a new password. "E-Mail senden"
 * only works with a valid address (Figma Note 2). Firebase sends the e-mail; a failure shows
 * its message under the field.
 */
@Component({
  selector: 'app-forgot-password',
  imports: [FormField, FormRoot, Button, InputField, AuthCard, Toast],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly model = signal<ForgotPasswordModel>({ email: '' });
  readonly forgotForm = form(
    this.model,
    (path) => {
      apply(path.email, EMAIL_RULES);
    },
    { submission: { action: () => this.sendEmail() } },
  );
  readonly emailError = computed(() => visibleError(this.forgotForm.email));
  readonly sent = signal(false);

  /** Returns to the login page. */
  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  /** Sends the e-mail, confirms it and returns to the login. */
  private async sendEmail(): Promise<TreeValidationResult> {
    try {
      await this.auth.sendPasswordReset(this.model().email);
    } catch (error) {
      return { fieldTree: this.forgotForm.email, kind: 'auth', message: describeAuthError(error) };
    }
    this.sent.set(true);
    await waitForToast();
    await this.router.navigateByUrl('/login');
    return undefined;
  }
}
