import { Service, computed, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { AppUser } from '../models/app-user';
import { leaveAllChannels, prepareStartChannel } from './channel-membership';
import { FIREBASE_AUTH, FIRESTORE } from './firebase';
import { PresenceService } from './presence.service';

/** Picture of a person who has not chosen an avatar (Figma `81. Profile`). */
export const AVATAR_PLACEHOLDER = 'img/avatars/avatar-placeholder.svg';

/** Name of a guest account; Figma shows none. */
const GUEST_NAME = 'Gast';

/**
 * Where Firebase's own pages lead after the e-mail link was used (new password, confirmed
 * address): the start page, which opens the login after the intro. The web space does not
 * answer direct links to routes yet (docs/todo.md), so `/login` would end in a 404 there.
 */
const AFTER_EMAIL_LINK_PATH = '/';

/** What the sign-up collects before the account is created. */
export interface SignUpData {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly avatarUrl: string;
}

/** Profile of a new account; it starts online. */
function toProfile(user: User, name: string, avatarUrl: string, isGuest: boolean): AppUser {
  return { uid: user.uid, name, email: user.email ?? '', avatarUrl, isGuest, presence: 'online' };
}

/**
 * Sign-in, sign-up and the signed-in person (area A, interface `currentUser` in
 * docs/arbeitsteilung.md). The profile lives in `users/{uid}` (ttoebbe/dabubble#1).
 * Every method throws the Firebase error unchanged; the pages turn it into a message.
 */
@Service()
export class AuthService {
  private readonly auth = inject(FIREBASE_AUTH);
  private readonly firestore = inject(FIRESTORE);
  private readonly presence = inject(PresenceService);
  private stopProfile: (() => void) | null = null;
  readonly currentUser = signal<AppUser | null>(null);
  readonly uid = computed(() => this.currentUser()?.uid ?? null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.followProfile(user));
  }

  /** Whether somebody is signed in, once Firebase has restored the session. */
  async isSignedIn(): Promise<boolean> {
    await this.auth.authStateReady();
    return this.auth.currentUser !== null;
  }

  /** Signs in with e-mail and password. */
  async logIn(email: string, password: string): Promise<void> {
    const { user } = await signInWithEmailAndPassword(this.auth, email, password);
    await this.prepareChannel(user.uid, false);
  }

  /** Signs in as guest with a fresh anonymous account. */
  async logInAsGuest(): Promise<void> {
    const { user } = await signInAnonymously(this.auth);
    await this.createProfile(user, GUEST_NAME, AVATAR_PLACEHOLDER, true);
  }

  /** Signs in with Google; the first time a profile is created. */
  async logInWithGoogle(): Promise<void> {
    const { user } = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const existing = await getDoc(this.profileRef(user.uid));
    if (existing.exists()) {
      await this.prepareChannel(user.uid, false);
    } else {
      await this.createProfile(user, user.displayName ?? GUEST_NAME, AVATAR_PLACEHOLDER, false);
    }
  }

  /**
   * Creates the account with its profile, sends the confirmation e-mail (DA checklist Konto
   * US1, optional) and signs out again, so the login follows (Figma). The e-mail is best
   * effort: the account exists even if Firebase does not send it.
   */
  async signUp(data: SignUpData): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
    await this.createProfile(user, data.name, data.avatarUrl, false);
    await sendEmailVerification(user, { url: this.continueUrl() }).catch(() => undefined);
    await this.logOut();
  }

  /** Changes name and picture of the signed-in person. */
  async updateProfile(changes: Pick<AppUser, 'name' | 'avatarUrl'>): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      await updateDoc(this.profileRef(uid), { ...changes });
    }
  }

  /** Sends the e-mail with the link for a new password. */
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email, { url: this.continueUrl() });
  }

  /** Throws when the code of the e-mail link is invalid or expired. */
  async checkResetCode(code: string): Promise<void> {
    await verifyPasswordResetCode(this.auth, code);
  }

  /** Sets the new password with the code of the e-mail link. */
  async resetPassword(code: string, password: string): Promise<void> {
    await confirmPasswordReset(this.auth, code, password);
  }

  /**
   * Marks the person offline and signs out. A guest account is deleted with its profile, so
   * guests do not pile up in the direct messages. A failed presence update never blocks it.
   */
  async logOut(): Promise<void> {
    const user = this.auth.currentUser;
    if (user?.isAnonymous && (await this.removeGuest(user))) {
      return;
    }
    await this.presence.setPresence('offline').catch(() => undefined);
    await signOut(this.auth);
  }

  /**
   * Deletes the profile and the anonymous account of a guest, which also signs the guest out.
   * Returns false when Firebase refuses, e.g. for an old session; a normal sign-out follows.
   */
  private async removeGuest(user: User): Promise<boolean> {
    try {
      await leaveAllChannels(this.firestore, user.uid).catch(() => undefined);
      await deleteDoc(this.profileRef(user.uid));
      await deleteUser(user);
      return true;
    } catch {
      return false;
    }
  }

  /** Absolute address of the start page, for the "continue" button on Firebase's pages. */
  private continueUrl(): string {
    return `${window.location.origin}${AFTER_EMAIL_LINK_PATH}`;
  }

  /**
   * Creates the start channel if it is missing and lets a new account join it. Best effort:
   * signing in must not fail because of the channel.
   */
  private prepareChannel(uid: string, join: boolean): Promise<void> {
    return prepareStartChannel(this.firestore, uid, join).catch(() => undefined);
  }

  /** Writes the profile of a new account and adds it to the start channel. */
  private async createProfile(
    user: User,
    name: string,
    avatarUrl: string,
    isGuest: boolean,
  ): Promise<void> {
    await setDoc(this.profileRef(user.uid), toProfile(user, name, avatarUrl, isGuest));
    await this.prepareChannel(user.uid, true);
  }

  /** Keeps `currentUser` in sync with the profile of whoever is signed in. */
  private followProfile(user: User | null): void {
    this.stopProfile?.();
    this.stopProfile = null;
    if (!user) {
      this.currentUser.set(null);
      return;
    }
    this.stopProfile = onSnapshot(
      this.profileRef(user.uid),
      (snapshot) => this.currentUser.set(snapshot.exists() ? (snapshot.data() as AppUser) : null),
      () => this.currentUser.set(null),
    );
  }

  /** Document of a profile. */
  private profileRef(uid: string) {
    return doc(this.firestore, 'users', uid);
  }
}
