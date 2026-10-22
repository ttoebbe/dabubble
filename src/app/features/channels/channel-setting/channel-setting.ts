import { Component, computed, input, output, signal } from '@angular/core';
import { FormField, FormRoot, applyWhen, form } from '@angular/forms/signals';
import { visibleError } from '../../auth/visible-error';
import { channelNameRules } from '../channel-validation';

/** Value of a setting while it is edited. */
interface SettingModel {
  value: string;
}

let nextSettingId = 0;

/**
 * One editable block of the channel settings (Figma `71. Channel name`, `72. Description`):
 * label with "Bearbeiten" / "Speichern" (on mobile pencil and check icons), the value or its
 * input. With `takenNames` the value is a channel name and must be filled in and unique.
 * Projected content (e.g. "Erstellt von") follows the value.
 */
@Component({
  selector: 'app-channel-setting',
  imports: [FormField, FormRoot],
  templateUrl: './channel-setting.html',
  styleUrl: './channel-setting.scss',
})
export class ChannelSetting {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly placeholder = input('');
  readonly withTag = input(false);
  readonly takenNames = input<readonly string[] | null>(null);
  readonly saved = output<string>();
  readonly editing = signal(false);
  readonly settingId = `channel-setting-${nextSettingId++}`;
  readonly model = signal<SettingModel>({ value: '' });
  readonly settingForm = form(
    this.model,
    (path) => {
      applyWhen(
        path.value,
        () => this.takenNames() !== null,
        channelNameRules(() => this.takenNames() ?? []),
      );
    },
    { submission: { action: () => this.save() } },
  );
  readonly error = computed(() => visibleError(this.settingForm.value));

  /** Opens the input with the current value. */
  startEditing(): void {
    this.settingForm().reset({ value: this.value() });
    this.editing.set(true);
  }

  /** Reports the trimmed value and shows it again. */
  private async save(): Promise<undefined> {
    this.saved.emit(this.model().value.trim());
    this.editing.set(false);
    return undefined;
  }
}
