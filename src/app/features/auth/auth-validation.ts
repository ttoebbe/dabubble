import { email, minLength, required, schema } from '@angular/forms/signals';

/**
 * Error texts of the account forms. Figma texts where the file has them (spec 4.2):
 * e-mail `662:13055`, name `662:13278`, password `662:13370`, mismatch `673:13802`.
 * `loginFailed` is `I157:363;662:13526`. Not in Figma: `passwordTooShort` (DA checklist asks for a
 * specific message on a weak password) and the messages for Firebase errors from `emailTaken` on.
 */
export const AUTH_ERRORS = {
  email: '*Diese E-Mail-Adresse ist leider ungültig.',
  nameMissing: 'Bitte schreiben Sie einen Namen.',
  passwordMissing: 'Bitte geben Sie ein Passwort ein.',
  passwordTooShort: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  passwordsDiffer: 'Ihre Kennwörter stimmen nicht überein',
  loginFailed: 'Falsches Passwort. Bitte noch einmal versuchen.',
  emailTaken: '*Diese E-Mail-Adresse wird bereits verwendet.',
  tooManyAttempts: 'Zu viele Versuche. Bitte später noch einmal versuchen.',
  offline: 'Keine Verbindung. Bitte später noch einmal versuchen.',
  generic: 'Das hat nicht geklappt. Bitte noch einmal versuchen.',
  linkExpired: 'Dieser Link ist ungültig oder abgelaufen.',
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
