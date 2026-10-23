import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AVATAR_PLACEHOLDER, AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { UserService } from '../../../core/services/user.service';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { ChannelDialogs } from '../../channels/channel-dialogs';
import { ChatHeader } from '../chat-header/chat-header';
import { describeCreation } from '../channel-intro';
import { Conversation } from '../conversation/conversation';
import { UNKNOWN_PERSON_NAME } from '../direct-chat/direct-chat';

/** How many member avatars the header shows (Figma `46. Members Miniatures Chat info`). */
const SHOWN_MEMBERS = 3;

/**
 * Channel view (DA checklist Channels US1, Figma `210:750`): header with name, member avatars
 * (36 px, overlapping by 6 px as in the reference of `210:750`) and counter, then the messages.
 * Name, members and "Mitglieder hinzufügen" open the channel dialogs of area A through
 * `ChannelDialogs`. When the header gets too narrow for one line (no artboard between 768 and
 * 1440 px), avatars and counter hide as on mobile (ttoebbe/dabubble#3).
 */
@Component({
  selector: 'app-channel-chat',
  imports: [Avatar, ChatHeader, Conversation],
  templateUrl: './channel-chat.html',
  styleUrl: './channel-chat.scss',
})
export class ChannelChat {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly channels = inject(ChannelService);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true });
  readonly dialogs = inject(ChannelDialogs);
  readonly channelId = computed(() => this.params().get('channelId') ?? '');
  private readonly channel = computed(() =>
    this.channels.allChannels().find((entry) => entry.id === this.channelId()),
  );
  readonly name = computed(() => this.channel()?.name ?? '');
  readonly memberCount = computed(() => this.channel()?.memberIds.length ?? 0);
  readonly memberAvatars = computed(() => {
    const memberIds = this.channel()?.memberIds ?? [];
    const members = this.users.users().filter((user) => memberIds.includes(user.uid));
    return members.slice(0, SHOWN_MEMBERS).map((user) => user.avatarUrl || AVATAR_PLACEHOLDER);
  });
  readonly introStart = computed(() => {
    const channel = this.channel();
    if (!channel) {
      return '';
    }
    const creator = this.users.users().find((user) => user.uid === channel.creatorId);
    const byMe = channel.creatorId === this.auth.uid();
    const created = describeCreation(
      creator?.name ?? UNKNOWN_PERSON_NAME,
      byMe,
      channel.createdAt,
      Date.now(),
    );
    return `${created} Das ist der Anfang des Channels`;
  });
}
