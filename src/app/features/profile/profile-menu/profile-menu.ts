import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AVATAR_PLACEHOLDER, AuthService } from '../../../core/services/auth.service';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { ProfileDetails, toProfileDetails } from '../profile-details';
import { ProfileDialog } from '../profile-dialog/profile-dialog';
import { ProfileChanges } from '../profile-edit-form/profile-edit-form';

/** Shown for the moment until the profile of the signed-in person has loaded. */
const LOADING_PROFILE: ProfileDetails = {
  name: '',
  email: '',
  avatarUrl: AVATAR_PLACEHOLDER,
  status: 'away',
};

/**
 * Profile corner of the workspace header (Figma `65. Profile menu` 379:2282): name, avatar and
 * arrow open the menu "Profil" / "Log out" (`64.` 379:2195, on mobile the sheet `64b.` 712:14134).
 * The menu is a native popover, so outside clicks and Escape close it without extra code.
 * It shows and changes the signed-in person through `AuthService`.
 */
@Component({
  selector: 'app-profile-menu',
  imports: [Avatar, ProfileDialog],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.scss',
})
export class ProfileMenu {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly profile = computed(() => {
    const user = this.auth.currentUser();
    return user ? toProfileDetails(user) : LOADING_PROFILE;
  });
  readonly profileOpen = signal(false);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly menu = viewChild.required<ElementRef<HTMLElement>>('menu');

  /** Closes the menu and shows the own profile. */
  openProfile(): void {
    this.menu().nativeElement.hidePopover();
    this.profileOpen.set(true);
  }

  /** Closes the profile and gives the focus back to the menu button. */
  closeProfile(): void {
    this.profileOpen.set(false);
    this.trigger().nativeElement.focus();
  }

  /** Stores the name and picture saved in the profile dialog. */
  updateProfile(changes: ProfileChanges): Promise<void> {
    return this.auth.updateProfile(changes);
  }

  /** Signs the user out and opens the login. */
  async logOut(): Promise<void> {
    this.menu().nativeElement.hidePopover();
    await this.auth.logOut();
    await this.router.navigateByUrl('/login');
  }
}
