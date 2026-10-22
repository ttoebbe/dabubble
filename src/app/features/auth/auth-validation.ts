import { email, minLength, required, schema } from '@angular/forms/signals';

/**
 * Error texts of the account forms. Figma texts where the file has them (spec 4.2):
 * e-mail `662:13055`, name `662:13278`, password `662:13370`, mismatch `673:13802`.
 * `passwordTooShort` is not in Figma (DA checklist: specific message for a weak password).
 */
export const AUTH_ERRORS = {
  email: '*Diese E-Mail-Adresse ist leider ungültig.',
  nameMissing: 'Bitte schreiben Sie einen Namen.',
  passwordMissing: 'Bitte geben Sie ein Passwort ein.',
  passwordTooShort: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  passwordsDiffer: 'Ihre Kennwörter stimmen nicht überein',
} as const;

/** Shortest password Firebase Authentication accepts. */
const MIN_PASSWORD_LENGTH = 6;

/** Rules for every e-mail field: filled in and a valid address. */
export const EMAIL_RULES = schema<string>((path) => {
  required(path, { message: AUTH_ERRORS.email });
  email(path, { message: AUTH_ERRORS.email });
});

/** Rules for a password that is chosen now (sign-up, reset): filled in and long enough. */
export const NEW_PASSWORD_RULES = schema<string>((path) => {
  required(path, { message: AUTH_ERRORS.passwordMissing });
  minLength(path, MIN_PASSWORD_LENGTH, { message: AUTH_ERRORS.passwordTooShort });
});
