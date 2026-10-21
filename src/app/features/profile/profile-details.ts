import { AvatarStatus } from '../../shared/components/avatar/avatar';

/** What the profile menu and the profile dialog show about a person. */
export interface ProfileDetails {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly status: AvatarStatus;
}

/** Signed-in sample person from Figma (`163:188`) until `AuthService` exists (docs/todo.md). */
export const SAMPLE_OWN_PROFILE: ProfileDetails = {
  name: 'Frederik Beck',
  email: 'fred.beck@email.com',
  avatarUrl: 'img/avatars/frederik-beck.svg',
  status: 'online',
};
