import { FieldTree } from '@angular/forms/signals';

/**
 * First error message of a field, but only once the user has left the field or tried to
 * submit the form, so an empty form does not open with red messages. Used by every form
 * of area A (login, channel dialogs, profile).
 */
export function visibleError<T>(field: FieldTree<T>): string | null {
  const state = field();
  if (!state.touched()) {
    return null;
  }
  return state.errors()[0]?.message ?? null;
}
