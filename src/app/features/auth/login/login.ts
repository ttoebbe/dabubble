import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { visibleError } from '../visible-error';

/** Values of the login form. */
interface LoginModel {
  email: string;
  password: string;
}

const EMAIL_ERROR = '*Diese E-Mail-Adresse ist leider ungültig.';
const PASSWORD_ERROR = '*Bitte gib dein Passwort ein.';

/** Page after a successful sign-in. */
const WORKSPACE_URL = '/workspace';

/**
 * Login (Figma `01-Log In` 125:2, mobile 609:17202) with Signal Forms. Errors appear under the
 * field once it was left or the form was sent. Until Firebase Authentication is set up
 * (docs/todo.md) a valid form, the guest login and Google lead straight to the workspace.
 */
@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, FormField, FormRoot, Button, InputField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);
  readonly model = signal<LoginModel>({ email: '', password: '' });
  readonly loginForm = form(
    this.model,
    (path) => {
      required(path.email, { message: EMAIL_ERROR });
      email(path.email, { message: EMAIL_ERROR });
      required(path.password, { message: PASSWORD_ERROR });
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
