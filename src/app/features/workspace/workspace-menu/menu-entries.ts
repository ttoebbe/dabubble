import { AppUser } from '../../../core/models/app-user';
import { AVATAR_PLACEHOLDER } from '../../../core/services/auth.service';
import { AvatarStatus } from '../../../shared/components/avatar/avatar';
import { toAvatarStatus } from '../../profile/profile-details';

/** Name of the workspace (Figma `15. Channel name`). */
export const WORKSPACE_NAME = 'Devspace';

/** Channel as the workspace menu lists it. */
export interface MenuChannel {
  readonly id: string;
  readonly name: string;
}

/** Person in the direct-message list of the workspace menu. */
export interface MenuContact {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl: string;
  readonly status: AvatarStatus;
  readonly isSelf: boolean;
}

/** Menu entry of a stored person; the signed-in person is marked as "(Du)". */
export function toMenuContact(user: AppUser, selfUid: string | null): MenuContact {
  return {
    id: user.uid,
    name: user.name,
    avatarUrl: user.avatarUrl || AVATAR_PLACEHOLDER,
    status: toAvatarStatus(user.presence),
    isSelf: user.uid === selfUid,
  };
}

/**
 * People for menus, pickers and member lists: the signed-in person first, then everybody else
 * by name. Other guests stay hidden, so guests who only closed the tab do not pile up
 * (decision Thomas 22.10.2026); a guest still sees themselves.
 */
export function toMenuContacts(users: readonly AppUser[], selfUid: string | null): MenuContact[] {
  return users
    .filter((user) => !user.isGuest || user.uid === selfUid)
    .map((user) => toMenuContact(user, selfUid))
    .sort(
      (first, second) =>
        Number(second.isSelf) - Number(first.isSelf) || first.name.localeCompare(second.name),
    );
}
