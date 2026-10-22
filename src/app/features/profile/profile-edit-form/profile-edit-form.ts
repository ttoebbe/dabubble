import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form, required, validate } from '@angular/forms/signals';
import { Button } from '../../../shared/components/button/button';
import { visibleError } from '../../auth/visible-error';

/** Values of the profile form. */
interface ProfileEditModel {
  name: string;
}

const NAME_MISSING = '*Bitte gib deinen Namen ein.';

/**
 * Edit mode of the own profile (Figma `65. Profile view other users` variant "Dein Profil
 * bearbeiten" 1808:16192, DA checklist Konto US4): full name with "Abbrechen" and "Speichern".
 * The parent stores the name.
 */
@Component({
  selector: 'app-profile-edit-form',
  imports: [FormField, FormRoot, Button],
  templateUrl: './profile-edit-form.html',
  styleUrl: './profile-edit-form.scss',
})
export class ProfileEditForm implements OnInit {
  readonly name = input.required<string>();
  readonly saved = output<string>();
  readonly cancelled = output<void>();
  readonly model = signal<ProfileEditModel>({ name: '' });
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

  /** Starts with the current name in the field. */
  ngOnInit(): void {
    this.model.set({ name: this.name() });
  }

  /** Reports the trimmed name. */
  private async save(): Promise<undefined> {
    this.saved.emit(this.model().name.trim());
    return undefined;
  }
}
