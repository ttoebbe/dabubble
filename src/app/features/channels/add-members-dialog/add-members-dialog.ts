import { Component, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form, minLength } from '@angular/forms/signals';
import { Button } from '../../../shared/components/button/button';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { MenuContact } from '../../workspace/workspace-menu/menu-entries';
import { MemberPicker } from '../member-picker/member-picker';

/** Values of the add-members form. */
interface AddMembersModel {
  memberIds: string[];
}

const NOBODY: AddMembersModel = { memberIds: [] };

/**
 * Adds people to an existing channel (Figma `41. Add members R corner` 365:2329, DA checklist
 * Channels US2). "Hinzufügen" only works once somebody is chosen (Note 6). The channel header
 * of area B or the members dialog opens it; the parent stores the new members.
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
  readonly added = output<readonly string[]>();
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
    this.closed.emit();
  }

  /** Reports the chosen people and starts over. */
  private async finish(): Promise<undefined> {
    this.added.emit(this.model().memberIds);
    this.membersForm().reset(NOBODY);
    return undefined;
  }
}
