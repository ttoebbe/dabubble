import { Service, computed, signal } from '@angular/core';

/** The dialogs a channel header can open (Figma `Channel Edition`, `43. Members`, `41.`). */
export type ChannelDialogKind = 'settings' | 'members' | 'add-members';

/** Which dialog is open for which channel. */
interface OpenChannelDialog {
  readonly channelId: string;
  readonly kind: ChannelDialogKind;
}

/**
 * Opens the channel dialogs (interface A → B: the channel header of area B calls `open`).
 * The workspace frame shows them and stores the changes through `ChannelService`.
 */
@Service()
export class ChannelDialogs {
  private readonly current = signal<OpenChannelDialog | null>(null);
  readonly channelId = computed(() => this.current()?.channelId ?? null);
  readonly kind = computed(() => this.current()?.kind ?? null);

  /** Opens one of the dialogs for a channel; an open one is replaced. */
  open(channelId: string, kind: ChannelDialogKind): void {
    this.current.set({ channelId, kind });
  }

  /** Closes the open dialog. */
  close(): void {
    this.current.set(null);
  }
}
