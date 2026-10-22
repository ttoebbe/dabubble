import { AvatarStatus } from '../../../shared/components/avatar/avatar';

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

/** Sample channels from Figma (`210:1203`) until `ChannelService` exists (docs/todo.md). */
export const SAMPLE_CHANNELS: readonly MenuChannel[] = [
  { id: 'entwicklerteam', name: 'Entwicklerteam' },
];

/** Sample people from Figma (`210:1203`) until `UserService` exists (docs/todo.md). */
export const SAMPLE_CONTACTS: readonly MenuContact[] = [
  {
    id: 'frederik-beck',
    name: 'Frederik Beck',
    avatarUrl: 'img/avatars/frederik-beck.svg',
    status: 'online',
    isSelf: true,
  },
  {
    id: 'sofia-mueller',
    name: 'Sofia Müller',
    avatarUrl: 'img/avatars/sofia-mueller.svg',
    status: 'online',
    isSelf: false,
  },
  {
    id: 'noah-braun',
    name: 'Noah Braun',
    avatarUrl: 'img/avatars/noah-braun.svg',
    status: 'online',
    isSelf: false,
  },
  {
    id: 'elise-roth',
    name: 'Elise Roth',
    avatarUrl: 'img/avatars/elise-roth.svg',
    status: 'away',
    isSelf: false,
  },
  {
    id: 'elias-neumann',
    name: 'Elias Neumann',
    avatarUrl: 'img/avatars/elias-neumann.svg',
    status: 'online',
    isSelf: false,
  },
  {
    id: 'steffen-hoffmann',
    name: 'Steffen Hoffmann',
    avatarUrl: 'img/avatars/steffen-hoffmann.svg',
    status: 'online',
    isSelf: false,
  },
];
