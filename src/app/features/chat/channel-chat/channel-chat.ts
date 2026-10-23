import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AVATAR_PLACEHOLDER, AuthService } from '../../../core/services/auth.service';
import { ChannelService } from '../../../core/services/channel.service';
import { UserService } from '../../../core/services/user.service';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { ChannelDialogs } from '../../channels/channel-dialogs';
import { ChatHeader } from '../chat-header/chat-header';
import { dayKey } from '../chat-time';
import { Conversation } from '../conversation/conversation';

/** How many member avatars the header shows (Figma `46. Members Miniatures Chat info`). */
const SHOWN_MEMBERS = 3;

/**
 * Channel view (DA checklist Channels US1, Figma `210:750`): header with name, member avatars
 * and counter, then the messages. Name, members and "Mitglieder hinzufügen" open the channel
 * dialogs of area A through `ChannelDialogs`.
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
    const createdTodayByMe =
      channel?.creatorId === this.auth.uid() && dayKey(channel.createdAt) === dayKey(Date.now());
    return createdTodayByMe
      ? 'Du hast diesen Channel heute erstellt. Das ist der Anfang des Channels'
      : 'Das ist der Anfang des Channels';
  });
}
