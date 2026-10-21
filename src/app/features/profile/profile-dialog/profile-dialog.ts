import { Component, computed, input, output } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { ProfileDetails } from '../profile-details';

/**
 * Profile view (Figma `Profile view main` 163:188 for the own profile,
 * `65. Profile view other users` 463:7263 for others). Other people get the
 * "Nachricht" button; the parent decides where it leads (direct message of area B).
 */
@Component({
  selector: 'app-profile-dialog',
  imports: [Avatar, Button, Dialog],
  templateUrl: './profile-dialog.html',
  styleUrl: './profile-dialog.scss',
})
export class ProfileDialog {
  readonly open = input(false);
  readonly profile = input.required<ProfileDetails>();
  readonly isOwn = input(false);
  readonly closed = output<void>();
  readonly messageRequested = output<void>();
  readonly statusLabel = computed(() =>
    this.profile().status === 'online' ? 'Aktiv' : 'Abwesend',
  );
}
