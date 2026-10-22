import { Component, input, output } from '@angular/core';

let nextCardId = 0;

/**
 * White card of the account pages (Figma `02-Sign In`, `03-Choose avatar`, `04-Send email`,
 * `05-Reset password`): optional back arrow (`13. Go back`), centred title, projected content.
 * The page decides where "back" leads.
 */
@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.html',
  styleUrl: './auth-card.scss',
})
export class AuthCard {
  readonly heading = input.required<string>();
  readonly showBack = input(true);
  readonly back = output<void>();
  readonly headingId = `auth-card-heading-${nextCardId++}`;
}
