import { Service, signal } from '@angular/core';

/**
 * Opens the profile of any person by `uid` (interface A → B in docs/arbeitsteilung.md:
 * click on an author or a mention). The workspace frame shows the dialog.
 */
@Service()
export class ProfileViewer {
  readonly uid = signal<string | null>(null);

  /** Shows the profile of the person with this `uid`. */
  show(uid: string): void {
    this.uid.set(uid);
  }

  /** Closes the profile. */
  close(): void {
    this.uid.set(null);
  }
}
