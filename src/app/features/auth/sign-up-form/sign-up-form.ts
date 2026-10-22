import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { FormField, FormRoot, apply, form, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { InputField } from '../../../shared/components/input-field/input-field';
import { AuthCard } from '../auth-card/auth-card';
import { AUTH_ERRORS, EMAIL_RULES, NEW_PASSWORD_RULES } from '../auth-validation';
import { visibleError } from '../visible-error';

/** What the user has entered on the first sign-up step. */
export interface SignUpDraft {
  name: string;
  email: string;
  password: string;
  privacyAccepted: boolean;
}

/** Sign-up form before anything is typed. */
export const EMPTY_SIGN_UP: SignUpDraft = {
  name: '',
  email: '',
  password: '',
  privacyAccepted: false,
};

/**
 * First sign-up step (Figma `02-Sign In` 171:66, mobile 609:17276, DA checklist Konto US1):
 * name, e-mail, password and the privacy checkbox. "Weiter" only works once everything is
 * filled in correctly (Figma Note 1).
 */
@Component({
  selector: 'app-sign-up-form',
  imports: [FormField, FormRoot, RouterLink, Button, InputField, AuthCard],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
})
export class SignUpForm implements OnInit {
  readonly draft = input.required<SignUpDraft>();
  readonly completed = output<SignUpDraft>();
  readonly back = output<void>();
  readonly model = signal<SignUpDraft>(EMPTY_SIGN_UP);
  readonly signUpForm = form(
    this.model,
    (path) => {
      required(path.name, { message: AUTH_ERRORS.nameMissing });
      validate(path.name, ({ value }) =>
        value().trim() ? null : { kind: 'blank', message: AUTH_ERRORS.nameMissing },
      );
      apply(path.email, EMAIL_RULES);
      apply(path.password, NEW_PASSWORD_RULES);
      validate(path.privacyAccepted, ({ value }) => (value() ? null : { kind: 'privacy' }));
    },
    { submission: { action: () => this.complete() } },
  );
  readonly nameError = computed(() => visibleError(this.signUpForm.name));
  readonly emailError = computed(() => visibleError(this.signUpForm.email));
  readonly passwordError = computed(() => visibleError(this.signUpForm.password));

  /** Restores what was typed before the user went back from the avatar step. */
  ngOnInit(): void {
    this.model.set(this.draft());
  }

  /** Hands the entries to the next step. */
  private async complete(): Promise<undefined> {
    this.completed.emit({ ...this.model(), name: this.model().name.trim() });
    return undefined;
  }
}
