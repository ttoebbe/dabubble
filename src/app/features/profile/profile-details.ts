import { AppUser, Presence } from '../../core/models/app-user';
import { AVATAR_PLACEHOLDER } from '../../core/services/auth.service';
import { AvatarStatus } from '../../shared/components/avatar/avatar';

/** What the profile menu and the profile dialog show about a person. */
export interface ProfileDetails {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly status: AvatarStatus;
}

/** Shown while no profile is loaded, e.g. right after the page has opened. */
export const EMPTY_PROFILE: ProfileDetails = {
  name: '',
  email: '',
  avatarUrl: AVATAR_PLACEHOLDER,
  status: 'away',
};

/** Dot on the avatar: green when online, grey when away or offline (Figma "Aktiv" / "Abwesend"). */
export function toAvatarStatus(presence: Presence): AvatarStatus {
  return presence === 'online' ? 'online' : 'away';
}

/** Profile view of a stored person. */
export function toProfileDetails(user: AppUser): ProfileDetails {
  return {
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || AVATAR_PLACEHOLDER,
    status: toAvatarStatus(user.presence),
  };
}
