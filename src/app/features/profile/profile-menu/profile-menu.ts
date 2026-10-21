import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { ProfileDetails } from '../profile-details';
import { ProfileDialog } from '../profile-dialog/profile-dialog';

/**
 * Profile corner of the workspace header (Figma `65. Profile menu` 379:2282): name, avatar and
 * arrow open the menu "Profil" / "Log out" (`64.` 379:2195, on mobile the sheet `64b.` 712:14134).
 * The menu is a native popover, so outside clicks and Escape close it without extra code.
 */
@Component({
  selector: 'app-profile-menu',
  imports: [Avatar, ProfileDialog],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.scss',
})
export class ProfileMenu {
  readonly profile = input.required<ProfileDetails>();
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

  /** Signs the user out. Until `AuthService` exists (docs/todo.md) it only closes the menu. */
  logOut(): void {
    this.menu().nativeElement.hidePopover();
  }
}
