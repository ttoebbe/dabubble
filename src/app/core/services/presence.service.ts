import { DOCUMENT, Service, inject } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Presence } from '../models/app-user';
import { FIREBASE_AUTH, FIRESTORE } from './firebase';

/**
 * Online state of the signed-in person (DA checklist Konto US6), stored in `users/{uid}`:
 * online while the tab is visible, away while it is hidden, offline after logging out.
 */
@Service()
export class PresenceService {
  private readonly auth = inject(FIREBASE_AUTH);
  private readonly firestore = inject(FIRESTORE);
  private readonly document = inject(DOCUMENT);

  /** Updates the state on every sign-in and whenever the tab is shown or hidden. */
  constructor() {
    onAuthStateChanged(this.auth, () => this.showActivity());
    this.document.addEventListener('visibilitychange', () => this.showActivity());
  }

  /** Stores the state of the signed-in person; does nothing while nobody is signed in. */
  async setPresence(presence: Presence): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      await updateDoc(doc(this.firestore, 'users', uid), { presence });
    }
  }

  /**
   * Marks the signed-in person online or away, depending on whether the tab is visible.
   * Best effort: right after sign-up the profile may not exist yet, so a failure is ignored.
   */
  private showActivity(): void {
    const presence: Presence = this.document.hidden ? 'away' : 'online';
    this.setPresence(presence).catch(() => undefined);
  }
}
