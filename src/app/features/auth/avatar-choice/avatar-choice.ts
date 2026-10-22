import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form, required } from '@angular/forms/signals';
import { Button } from '../../../shared/components/button/button';
import { AuthCard } from '../auth-card/auth-card';
import { AVATAR_OPTIONS, AVATAR_PLACEHOLDER } from './avatar-options';

/** Value of the avatar form. */
interface AvatarModel {
  avatarUrl: string;
}

/**
 * Second sign-up step (Figma `03-Choose avatar` 6179:15943, mobile 6194:22230): the six
 * avatars as radio group, the big picture shows the choice. "Weiter" works once one is chosen.
 */
@Component({
  selector: 'app-avatar-choice',
  imports: [NgOptimizedImage, FormField, FormRoot, Button, AuthCard],
  templateUrl: './avatar-choice.html',
  styleUrl: './avatar-choice.scss',
})
export class AvatarChoice {
  readonly name = input.required<string>();
  readonly chosen = output<string>();
  readonly back = output<void>();
  readonly options = AVATAR_OPTIONS;
  readonly model = signal<AvatarModel>({ avatarUrl: '' });
  readonly avatarForm = form(
    this.model,
    (path) => {
      required(path.avatarUrl);
    },
    { name: 'avatar', submission: { action: () => this.choose() } },
  );
  readonly preview = computed(() => this.model().avatarUrl || AVATAR_PLACEHOLDER);

  /** Reports the chosen picture. */
  private async choose(): Promise<undefined> {
    this.chosen.emit(this.model().avatarUrl);
    return undefined;
  }
}
