import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  FormField,
  FormRoot,
  TreeValidationResult,
  apply,
  form,
  required,
  validate,
} from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { AuthCard } from '../auth-card/auth-card';
import { describeAuthError } from '../auth-errors';
import { AUTH_ERRORS, NEW_PASSWORD_RULES } from '../auth-validation';
import { Toast, waitForToast } from '../toast/toast';
import { visibleError } from '../visible-error';

/** Values of the new-password form. */
interface ResetPasswordModel {
  password: string;
  confirmation: string;
}

/** Whether the code of the e-mail link is still being checked, usable or invalid. */
type LinkState = 'checking' | 'ready' | 'invalid';

/**
 * New password after the e-mail link (Figma `05-Reset password` 182:372, mobile 609:17257,
 * Note 3): Firebase opens this page with `oobCode`. Both fields must match before "Passwort
 * ändern" works (Note 4). An invalid or expired link shows a message and the way back to
 * "Passwort vergessen" (not in Figma).
 */
@Component({
  selector: 'app-reset-password',
  imports: [FormField, FormRoot, RouterLink, Button, InputField, AuthCard, Toast],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly code = inject(ActivatedRoute).snapshot.queryParamMap.get('oobCode') ?? '';
  readonly linkState = signal<LinkState>('checking');
  readonly linkExpired = AUTH_ERRORS.linkExpired;
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

  /** Checks the code of the e-mail link before the form is shown. */
  async ngOnInit(): Promise<void> {
    try {
      await this.auth.checkResetCode(this.code);
      this.linkState.set('ready');
    } catch {
      this.linkState.set('invalid');
    }
  }

  /** Returns to the page that sends the e-mail (Figma prototype 05 → 04). */
  goBack(): void {
    this.router.navigateByUrl('/passwort-vergessen');
  }

  /** Sets the new password, confirms it and returns to the login. */
  private async changePassword(): Promise<TreeValidationResult> {
    try {
      await this.auth.resetPassword(this.code, this.model().password);
    } catch (error) {
      const message = describeAuthError(error);
      return { fieldTree: this.resetForm.confirmation, kind: 'auth', message };
    }
    this.changed.set(true);
    await waitForToast();
    await this.router.navigateByUrl('/login');
    return undefined;
  }
}
