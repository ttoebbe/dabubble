import { Component, computed, inject, input } from '@angular/core';
import { AppUser } from '../../../core/models/app-user';
import { Message } from '../../../core/models/message';
import { AVATAR_PLACEHOLDER } from '../../../core/services/auth.service';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { toAvatarStatus } from '../../profile/profile-details';
import { ProfileViewer } from '../../profile/profile-viewer';
import { formatTime } from '../chat-time';

/** Name shown for an author without profile, e.g. a guest who has logged out. */
const UNKNOWN_AUTHOR_NAME = 'Gast';

/**
 * One message of a chat (Figma `48. Messages main chat`): avatar, name, time and bubble. Own
 * messages sit on the right. A click on avatar or name opens the profile; an author without
 * profile shows "Gast" with the placeholder avatar and cannot be clicked.
 */
@Component({
  selector: 'app-message-item',
  imports: [Avatar],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
})
export class MessageItem {
  private readonly profiles = inject(ProfileViewer);
  readonly message = input.required<Message>();
  readonly author = input<AppUser | null>(null);
  readonly own = input(false);
  readonly name = computed(() => this.author()?.name ?? UNKNOWN_AUTHOR_NAME);
  readonly avatarUrl = computed(() => this.author()?.avatarUrl || AVATAR_PLACEHOLDER);
  readonly status = computed(() => {
    const author = this.author();
    return author ? toAvatarStatus(author.presence) : null;
  });
  readonly time = computed(() => formatTime(this.message().createdAt));

  /** Opens the profile of the author. */
  showProfile(): void {
    this.profiles.show(this.message().authorId);
  }
}
