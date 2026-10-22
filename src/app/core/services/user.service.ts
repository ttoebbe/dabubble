import { Service, effect, inject, signal } from '@angular/core';
import { collection, onSnapshot } from 'firebase/firestore';
import { AppUser } from '../models/app-user';
import { AuthService } from './auth.service';
import { FIRESTORE } from './firebase';

/**
 * All people of the workspace, live from `users` while somebody is signed in
 * (interface `users` in docs/arbeitsteilung.md).
 */
@Service()
export class UserService {
  private readonly firestore = inject(FIRESTORE);
  private readonly auth = inject(AuthService);
  readonly users = signal<AppUser[]>([]);

  /** Listens to the profiles while somebody is signed in. */
  constructor() {
    effect((onCleanup) => {
      if (!this.auth.uid()) {
        this.users.set([]);
        return;
      }
      onCleanup(this.followUsers());
    });
  }

  /**
   * Listens to the `users` collection; returns the function that stops listening.
   * Access ends with the sign-out, so a rejected listener just empties the list.
   */
  private followUsers(): () => void {
    return onSnapshot(
      collection(this.firestore, 'users'),
      (snapshot) => this.users.set(snapshot.docs.map((entry) => entry.data() as AppUser)),
      () => this.users.set([]),
    );
  }
}
