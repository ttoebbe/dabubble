import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, apply, form, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
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
 * Login (Figma `01-Log In` 125:2, mobile 609:17202) with Signal Forms. Errors appear under the
 * field once it was left or the form was sent. Until Firebase Authentication is set up
 * (docs/todo.md) a valid form, the guest login and Google lead straight to the workspace.
 */
@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, FormField, FormRoot, RouterLink, Button, InputField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);
  readonly model = signal<LoginModel>({ email: '', password: '' });
  readonly loginForm = form(
    this.model,
    (path) => {
      apply(path.email, EMAIL_RULES);
      required(path.password, { message: AUTH_ERRORS.passwordMissing });
    },
    { submission: { action: () => this.enterWorkspace() } },
  );
  readonly emailError = computed(() => visibleError(this.loginForm.email));
  readonly passwordError = computed(() => visibleError(this.loginForm.password));

  /** Signs in as guest. */
  logInAsGuest(): void {
    this.enterWorkspace();
  }

  /** Signs in with a Google account. */
  logInWithGoogle(): void {
    this.enterWorkspace();
  }

  /** Opens the workspace; returns no submission errors. */
  private async enterWorkspace(): Promise<undefined> {
    await this.router.navigateByUrl(WORKSPACE_URL);
    return undefined;
  }
}
