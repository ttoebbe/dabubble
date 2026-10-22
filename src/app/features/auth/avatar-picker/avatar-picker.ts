import { NgOptimizedImage } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { AVATAR_OPTIONS } from './avatar-options';

let nextPickerId = 0;

/**
 * The six avatars as radio group (Figma `82. Choose avatar component` 6179:20350, hover and
 * selected rings of `80. avatar interaction`). Bound with `[formField]`; the value is the
 * picture path. Used in the sign-up and, `compact` for narrow dialogs, when editing the profile.
 */
@Component({
  selector: 'app-avatar-picker',
  imports: [NgOptimizedImage],
  templateUrl: './avatar-picker.html',
  styleUrl: './avatar-picker.scss',
})
export class AvatarPicker implements FormValueControl<string> {
  readonly value = model('');
  readonly compact = input(false);
  readonly options = AVATAR_OPTIONS;
  readonly groupName = `avatar-picker-${nextPickerId++}`;
}
