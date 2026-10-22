import { Component, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form, minLength } from '@angular/forms/signals';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { AUTH_ERRORS } from '../../auth/auth-validation';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';
import { MemberPicker } from '../member-picker/member-picker';

/** Values of the add-members form. */
interface AddMembersModel {
  memberIds: string[];
}

const NOBODY: AddMembersModel = { memberIds: [] };

/**
 * Adds people to an existing channel (Figma `41. Add members R corner` 365:2329, DA checklist
 * Channels US2). "Hinzufügen" only works once somebody is chosen (Note 6). `add` stores the
 * new members; a failure keeps the dialog open with a message.
 */
@Component({
  selector: 'app-add-members-dialog',
  imports: [FormField, FormRoot, Button, Dialog, MemberPicker],
  templateUrl: './add-members-dialog.html',
  styleUrl: './add-members-dialog.scss',
})
export class AddMembersDialog {
  readonly open = input(false);
  readonly channelName = input.required<string>();
  readonly people = input.required<readonly MenuContact[]>();
  readonly closed = output<void>();
  readonly add = input.required<(memberIds: readonly string[]) => Promise<void>>();
  readonly saveError = signal('');
  readonly model = signal<AddMembersModel>(NOBODY);
  readonly membersForm = form(
    this.model,
    (path) => {
      minLength(path.memberIds, 1);
    },
    { submission: { action: () => this.finish() } },
  );

  /** Closes the dialog and forgets the choice. */
  close(): void {
    this.membersForm().reset(NOBODY);
    this.saveError.set('');
    this.closed.emit();
  }

  /** Stores the chosen people and starts over; a failure keeps the choice. */
  private async finish(): Promise<undefined> {
    this.saveError.set('');
    try {
      await this.add()(this.model().memberIds);
      this.membersForm().reset(NOBODY);
    } catch {
      this.saveError.set(AUTH_ERRORS.generic);
    }
    return undefined;
  }
}
