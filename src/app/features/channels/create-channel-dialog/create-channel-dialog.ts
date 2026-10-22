import { Component, computed, input, output, signal } from '@angular/core';
import { FormField, FormRoot, apply, form, minLength } from '@angular/forms/signals';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { visibleError } from '../../auth/visible-error';
import { MenuContact, WORKSPACE_NAME } from '../../workspace/workspace-menu/menu-entries';
import { channelNameRules } from '../channel-validation';
import { MemberPicker } from '../member-picker/member-picker';

/** Channel the user has just created, as the dialog reports it. */
export interface NewChannel {
  readonly name: string;
  readonly description: string;
  readonly memberIds: readonly string[] | 'all';
}

/** First step: name and description. */
interface ChannelDetails {
  name: string;
  description: string;
}

/** Second step: everybody in the workspace or chosen people. */
interface MemberChoice {
  scope: 'all' | 'selected';
  memberIds: string[];
}

const EMPTY_DETAILS: ChannelDetails = { name: '', description: '' };
const EMPTY_CHOICE: MemberChoice = { scope: 'all', memberIds: [] };

/**
 * Creates a channel in two steps (Figma `37. Add channel` 331:2174, then
 * `38. Add Members after add channel` 578:8272). The name must not be empty or taken
 * (DA checklist, Channels US1); "Erstellen" in the second step only works once people
 * are chosen (Figma Note 6). The parent stores the channel.
 */
@Component({
  selector: 'app-create-channel-dialog',
  imports: [FormField, FormRoot, Button, Dialog, MemberPicker],
  templateUrl: './create-channel-dialog.html',
  styleUrl: './create-channel-dialog.scss',
})
export class CreateChannelDialog {
  readonly open = input(false);
  readonly takenNames = input<readonly string[]>([]);
  readonly people = input.required<readonly MenuContact[]>();
  readonly closed = output<void>();
  readonly created = output<NewChannel>();
  readonly workspaceName = WORKSPACE_NAME;
  readonly step = signal<'details' | 'members'>('details');
  readonly details = signal<ChannelDetails>(EMPTY_DETAILS);
  readonly detailsForm = form(
    this.details,
    (path) => {
      apply(
        path.name,
        channelNameRules(() => this.takenNames()),
      );
    },
    { submission: { action: () => this.showMembersStep() } },
  );
  readonly choice = signal<MemberChoice>(EMPTY_CHOICE);
  readonly choiceForm = form(
    this.choice,
    (path) => {
      minLength(path.memberIds, 1, { when: ({ valueOf }) => valueOf(path.scope) === 'selected' });
    },
    { name: 'channel-members', submission: { action: () => this.finish() } },
  );
  readonly nameError = computed(() => visibleError(this.detailsForm.name));
  readonly heading = computed(() =>
    this.step() === 'details' ? 'Channel erstellen' : 'Leute hinzufügen',
  );

  /** Closes the dialog and forgets what was typed. */
  close(): void {
    this.resetForms();
    this.closed.emit();
  }

  /** Moves on to choosing the people. */
  private async showMembersStep(): Promise<undefined> {
    this.step.set('members');
    return undefined;
  }

  /** Reports the new channel and starts over. */
  private async finish(): Promise<undefined> {
    const { scope, memberIds } = this.choice();
    this.created.emit({
      name: this.details().name.trim(),
      description: this.details().description.trim(),
      memberIds: scope === 'all' ? 'all' : memberIds,
    });
    this.resetForms();
    return undefined;
  }

  /** Empties both steps and returns to the first one. */
  private resetForms(): void {
    this.detailsForm().reset(EMPTY_DETAILS);
    this.choiceForm().reset(EMPTY_CHOICE);
    this.step.set('details');
  }
}
