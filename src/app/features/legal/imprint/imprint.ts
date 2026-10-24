import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Imprint (Figma `18. Impressum`, mobile `156062:17209`) with the names of the team, the address
 * of the operator (Thomas) and the contact e-mails.
 */
@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss',
})
export class Imprint {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  /** Goes back in the app history, or to the start page when the imprint was opened directly. */
  goBack(): void {
    const state = this.location.getState() as { navigationId?: number } | null;
    if (state?.navigationId === 1) {
      this.router.navigateByUrl('/');
    } else {
      this.location.back();
    }
  }
}
