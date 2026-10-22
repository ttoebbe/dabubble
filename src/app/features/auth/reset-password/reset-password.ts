import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, apply, form, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { AuthCard } from '../auth-card/auth-card';
import { AUTH_ERRORS, NEW_PASSWORD_RULES } from '../auth-validation';
import { Toast, waitForToast } from '../toast/toast';
import { visibleError } from '../visible-error';

/** Values of the new-password form. */
interface ResetPasswordModel {
  password: string;
  confirmation: string;
}

/**
 * New password after the e-mail link (Figma `05-Reset password` 182:372, mobile 609:17257,
 * Note 3): both fields must match before "Passwort ändern" works (Note 4). Firebase opens this
 * page with the action code of the link; until it is set up (docs/todo.md) nothing is changed.
 */
@Component({
  selector: 'app-reset-password',
  imports: [FormField, FormRoot, Button, InputField, AuthCard, Toast],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private readonly router = inject(Router);
  readonly model = signal<ResetPasswordModel>({ password: '', confirmation: '' });
  readonly resetForm = form(
    this.model,
    (path) => {
      apply(path.password, NEW_PASSWORD_RULES);
      required(path.confirmation, { message: AUTH_ERRORS.passwordsDiffer });
      validate(path.confirmation, ({ value, valueOf }) =>
        value() === valueOf(path.password)
          ? null
          : { kind: 'mismatch', message: AUTH_ERRORS.passwordsDiffer },
      );
    },
    { submission: { action: () => this.changePassword() } },
  );
  readonly passwordError = computed(() => visibleError(this.resetForm.password));
  readonly confirmationError = computed(() => visibleError(this.resetForm.confirmation));
  readonly changed = signal(false);

  /** Returns to the page that sends the e-mail (Figma prototype 05 → 04). */
  goBack(): void {
    this.router.navigateByUrl('/passwort-vergessen');
  }

  /** Confirms the new password and returns to the login. */
  private async changePassword(): Promise<undefined> {
    this.changed.set(true);
    await waitForToast();
    await this.router.navigateByUrl('/login');
    return undefined;
  }
}
