import { FirebaseError } from 'firebase/app';
import { AUTH_ERRORS } from './auth-validation';

/** Firebase Authentication error codes and the message the user sees. */
const MESSAGES: Readonly<Record<string, string>> = {
  'auth/invalid-credential': AUTH_ERRORS.loginFailed,
  'auth/wrong-password': AUTH_ERRORS.loginFailed,
  'auth/user-not-found': AUTH_ERRORS.loginFailed,
  'auth/invalid-email': AUTH_ERRORS.email,
  'auth/email-already-in-use': AUTH_ERRORS.emailTaken,
  'auth/weak-password': AUTH_ERRORS.passwordTooShort,
  'auth/too-many-requests': AUTH_ERRORS.tooManyAttempts,
  'auth/network-request-failed': AUTH_ERRORS.offline,
  'auth/expired-action-code': AUTH_ERRORS.linkExpired,
  'auth/invalid-action-code': AUTH_ERRORS.linkExpired,
};

/** Codes of a Google popup the user closed on purpose; no message is shown. */
const CANCELLED_POPUP_CODES = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

/** Code of a Firebase error, empty for anything else. */
export function errorCode(error: unknown): string {
  return error instanceof FirebaseError ? error.code : '';
}

/** Message for a failed Firebase call. */
export function describeAuthError(error: unknown): string {
  return MESSAGES[errorCode(error)] ?? AUTH_ERRORS.generic;
}

/** Whether the user closed the Google popup themselves. */
export function isCancelledPopup(error: unknown): boolean {
  return CANCELLED_POPUP_CODES.includes(errorCode(error));
}
