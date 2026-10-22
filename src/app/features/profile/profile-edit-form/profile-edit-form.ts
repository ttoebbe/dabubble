import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import {
  FormField,
  FormRoot,
  TreeValidationResult,
  form,
  required,
  validate,
} from '@angular/forms/signals';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { Button } from '../../../shared/components/button/button';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { AvatarPicker } from '../../auth/avatar-picker/avatar-picker';
import { visibleError } from '../../auth/visible-error';

/** Name and picture the user saves in the profile. */
export interface ProfileChanges {
  readonly name: string;
  readonly avatarUrl: string;
}

/** Values of the profile form. */
interface ProfileEditModel {
  name: string;
  avatarUrl: string;
}

/** Error text for an empty name; Figma defines none. */
const NAME_MISSING = '*Bitte gib deinen Namen ein.';

/**
 * Edit mode of the own profile (Figma `65. Profile view other users` variant "Dein Profil
 * bearbeiten" 1808:16192, DA checklist Konto US4): avatar from the given choice (not in
 * Figma, placed as in the sign-up), full name, "Abbrechen" and "Speichern".
 * `store` saves the changes; a failure shows a message under the name.
 */
@Component({
  selector: 'app-profile-edit-form',
  imports: [FormField, FormRoot, Avatar, Button, AvatarPicker],
  templateUrl: './profile-edit-form.html',
  styleUrl: './profile-edit-form.scss',
})
export class ProfileEditForm implements OnInit {
  readonly name = input.required<string>();
  readonly avatarUrl = input.required<string>();
  readonly store = input.required<(changes: ProfileChanges) => Promise<void>>();
  readonly cancelled = output<void>();
  readonly model = signal<ProfileEditModel>({ name: '', avatarUrl: '' });
  readonly profileForm = form(
    this.model,
    (path) => {
      required(path.name, { message: NAME_MISSING });
      validate(path.name, ({ value }) =>
        value().trim() ? null : { kind: 'blank', message: NAME_MISSING },
      );
    },
    { submission: { action: () => this.save() } },
  );
  readonly nameError = computed(() => visibleError(this.profileForm.name));

  /** Starts with the current name and picture. */
  ngOnInit(): void {
    this.model.set({ name: this.name(), avatarUrl: this.avatarUrl() });
  }

  /** Stores the trimmed name and the chosen picture. */
  private async save(): Promise<TreeValidationResult> {
    const changes = { name: this.model().name.trim(), avatarUrl: this.model().avatarUrl };
    try {
      await this.store()(changes);
    } catch {
      return { fieldTree: this.profileForm.name, kind: 'save', message: AUTH_ERRORS.generic };
    }
    return undefined;
  }
}
