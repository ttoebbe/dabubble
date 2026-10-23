import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelService } from '../../../core/services/channel.service';
import { UserService } from '../../../core/services/user.service';
import { ProfileViewer } from '../../profile/profile-viewer';
import { channelLink } from '../../workspace/chat-links';
import { TextPart, splitMentions } from '../mention-text';

/**
 * Text of a message in which `@Name` and `#channel` are highlighted and clickable: a person
 * opens the profile, a channel opens its view. Names that match nobody (any more) stay plain
 * text. Only the channels of the signed-in person count, as only those can be opened.
 */
@Component({
  selector: 'app-message-text',
  templateUrl: './message-text.html',
  styleUrl: './message-text.scss',
})
export class MessageText {
  private readonly profiles = inject(ProfileViewer);
  private readonly router = inject(Router);
  private readonly users = inject(UserService);
  private readonly channels = inject(ChannelService);
  readonly text = input.required<string>();
  readonly parts = computed(() =>
    splitMentions(
      this.text(),
      this.users.users().map((user) => ({ id: user.uid, name: user.name })),
      this.channels.channels().map((channel) => ({ id: channel.id, name: channel.name })),
    ),
  );

  /** Opens the profile or the channel a mention points to. */
  open(part: TextPart): void {
    if (part.kind === 'user') {
      this.profiles.show(part.id);
    } else {
      this.router.navigate(channelLink(part.id));
    }
  }
}
