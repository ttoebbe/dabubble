import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormField,
  FormRoot,
  TreeValidationResult,
  apply,
  form,
  required,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { describeAuthError, isCancelledPopup } from '../auth-errors';
import { AUTH_ERRORS, EMAIL_RULES } from '../auth-validation';
import { visibleError } from '../visible-error';

/** Values of the login form. */
interface LoginModel {
  email: string;
  password: string;
}

/** Page after a successful sign-in. */
const WORKSPACE_URL = '/workspace';

/**
 * Login (Figma `01-Log In` 125:2, mobile 609:17202) with Signal Forms and Firebase
 * Authentication: e-mail and password, guest (anonymous) or Google. Form errors appear under
 * the field once it was left or sent; a failed sign-in shows its message under the password,
 * a failed guest or Google sign-in under the buttons.
 */
@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, FormField, FormRoot, RouterLink, Button, InputField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly model = signal<LoginModel>({ email: '', password: '' });
  readonly loginForm = form(
    this.model,
    (path) => {
      apply(path.email, EMAIL_RULES);
      required(path.password, { message: AUTH_ERRORS.passwordMissing });
    },
    { submission: { action: () => this.logIn() } },
  );
  readonly emailError = computed(() => visibleError(this.loginForm.email));
  readonly passwordError = computed(() => visibleError(this.loginForm.password));
  readonly actionError = signal<string | null>(null);
  readonly busy = signal(false);

  /** Signs in as guest. */
  logInAsGuest(): Promise<void> {
    return this.runSignIn(() => this.auth.logInAsGuest());
  }

  /** Signs in with a Google account. */
  logInWithGoogle(): Promise<void> {
    return this.runSignIn(() => this.auth.logInWithGoogle());
  }

  /** Signs in with the form values; a failure becomes an error under the password. */
  private async logIn(): Promise<TreeValidationResult> {
    try {
      await this.auth.logIn(this.model().email, this.model().password);
      await this.router.navigateByUrl(WORKSPACE_URL);
      return undefined;
    } catch (error) {
      return {
        fieldTree: this.loginForm.password,
        kind: 'auth',
        message: describeAuthError(error),
      };
    }
  }

  /** Runs a sign-in without the form and opens the workspace, or shows why it failed. */
  private async runSignIn(signIn: () => Promise<void>): Promise<void> {
    this.actionError.set(null);
    this.busy.set(true);
    try {
      await signIn();
      await this.router.navigateByUrl(WORKSPACE_URL);
    } catch (error) {
      this.actionError.set(isCancelledPopup(error) ? null : describeAuthError(error));
    } finally {
      this.busy.set(false);
    }
  }
}
