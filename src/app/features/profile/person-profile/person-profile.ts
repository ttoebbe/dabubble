import { Component, computed, inject, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { EMPTY_PROFILE, toProfileDetails } from '../profile-details';
import { ProfileDialog } from '../profile-dialog/profile-dialog';
import { ProfileChanges } from '../profile-edit-form/profile-edit-form';
import { ProfileViewer } from '../profile-viewer';

/**
 * Profile dialog of the person chosen through `ProfileViewer`. The own profile can be
 * edited; for everybody else "Nachricht" asks the workspace frame for the direct message.
 */
@Component({
  selector: 'app-person-profile',
  imports: [ProfileDialog],
  template: `
    <app-profile-dialog
      [open]="person() !== null"
      [profile]="person() ?? emptyProfile"
      [isOwn]="isOwn()"
      (closed)="viewer.close()"
      (messageRequested)="requestMessage()"
      [store]="updateProfile"
    />
  `,
})
export class PersonProfile {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  readonly viewer = inject(ProfileViewer);
  readonly emptyProfile = EMPTY_PROFILE;
  readonly messageRequested = output<string>();
  readonly isOwn = computed(() => this.viewer.uid() === this.auth.uid());
  readonly person = computed(() => {
    const user = this.users.users().find((entry) => entry.uid === this.viewer.uid());
    return user ? toProfileDetails(user) : null;
  });

  /** Closes the profile and reports whose direct message should open. */
  requestMessage(): void {
    const uid = this.viewer.uid();
    this.viewer.close();
    if (uid) {
      this.messageRequested.emit(uid);
    }
  }

  /** Stores the new name and picture of the own profile. */
  readonly updateProfile = (changes: ProfileChanges): Promise<void> =>
    this.auth.updateProfile(changes);
}
