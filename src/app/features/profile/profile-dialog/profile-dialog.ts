import { Component, computed, input, output, signal } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { ProfileDetails } from '../profile-details';
import { ProfileChanges, ProfileEditForm } from '../profile-edit-form/profile-edit-form';

/** Default for profiles that cannot be edited. */
async function storeNothing(): Promise<void> {
  return undefined;
}

/**
 * Profile view (Figma `Profile view main` 163:188 for the own profile,
 * `65. Profile view other users` 463:7263 for others). Other people get the
 * "Nachricht" button; the parent decides where it leads (direct message of area B).
 * The own profile can switch to edit mode; `store` saves the new name and picture.
 */
@Component({
  selector: 'app-profile-dialog',
  imports: [Avatar, Button, Dialog, ProfileEditForm],
  templateUrl: './profile-dialog.html',
  styleUrl: './profile-dialog.scss',
})
export class ProfileDialog {
  readonly open = input(false);
  readonly profile = input.required<ProfileDetails>();
  readonly isOwn = input(false);
  readonly closed = output<void>();
  readonly messageRequested = output<void>();
  readonly store = input<(changes: ProfileChanges) => Promise<void>>(storeNothing);
  readonly editing = signal(false);
  readonly heading = computed(() => (this.editing() ? 'Dein Profil bearbeiten' : 'Profil'));
  readonly statusLabel = computed(() =>
    this.profile().status === 'online' ? 'Aktiv' : 'Abwesend',
  );

  /** Closes the dialog; the next opening starts in view mode again. */
  close(): void {
    this.editing.set(false);
    this.closed.emit();
  }

  /** Stores the new name and picture, then returns to the view mode; errors stay in the form. */
  readonly saveChanges = async (changes: ProfileChanges): Promise<void> => {
    await this.store()(changes);
    this.editing.set(false);
  };
}
