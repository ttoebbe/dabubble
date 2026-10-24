import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AVATAR_PLACEHOLDER, AuthService } from '../../../core/services/auth.service';
import { directChatId } from '../../../core/services/direct-chat.service';
import { UserService } from '../../../core/services/user.service';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { toAvatarStatus } from '../../profile/profile-details';
import { ProfileViewer } from '../../profile/profile-viewer';
import { ChatHeader } from '../chat-header/chat-header';
import { Conversation } from '../conversation/conversation';

/** Name shown for a person without profile, e.g. a guest who has logged out. */
export const UNKNOWN_PERSON_NAME = 'Gast';

/** Name of a person in a chat header: the unknown name without profile, "(Du)" for oneself. */
export function chatPersonName(name: string | undefined, isSelf: boolean): string {
  return (name ?? UNKNOWN_PERSON_NAME) + (isSelf ? ' (Du)' : '');
}

/**
 * Direct message view (DA checklist Schreiben US1, Figma `12.` and `12 E.`): header with the
 * person, then the messages. The chat with oneself is marked "(Du)". The chat document is
 * created with the first message.
 */
@Component({
  selector: 'app-direct-chat',
  imports: [Avatar, ChatHeader, Conversation],
  templateUrl: './direct-chat.html',
  styleUrl: './direct-chat.scss',
})
export class DirectChat {
  private readonly auth = inject(AuthService);
  private readonly users = inject(UserService);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap, { requireSync: true });
  readonly profiles = inject(ProfileViewer);
  readonly uid = computed(() => this.params().get('uid') ?? '');
  readonly isSelf = computed(() => this.uid() === this.auth.uid());
  readonly chatId = computed(() => {
    const self = this.auth.uid();
    return self ? directChatId(self, this.uid()) : '';
  });
  private readonly person = computed(() => this.users.users().find((u) => u.uid === this.uid()));
  readonly hasProfile = computed(() => this.person() !== undefined);
  readonly personName = computed(() => this.person()?.name ?? UNKNOWN_PERSON_NAME);
  readonly name = computed(() => chatPersonName(this.person()?.name, this.isSelf()));
  readonly avatarUrl = computed(() => this.person()?.avatarUrl || AVATAR_PLACEHOLDER);
  readonly status = computed(() => {
    const person = this.person();
    return person ? toAvatarStatus(person.presence) : null;
  });
}
