import { InjectionToken, inject } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

/** The Firebase app of DABubble, created on first use from the config in `environment.ts`. */
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP', {
  providedIn: 'root',
  factory: () => initializeApp(environment.firebase),
});

/**
 * Firebase Authentication of the app. Its e-mails (password reset) use the German default
 * texts, because the templates of the project cannot be edited (docs/todo.md).
 */
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth(inject(FIREBASE_APP));
    auth.languageCode = 'de';
    return auth;
  },
});

/** Cloud Firestore of the app. */
export const FIRESTORE = new InjectionToken<Firestore>('FIRESTORE', {
  providedIn: 'root',
  factory: () => getFirestore(inject(FIREBASE_APP)),
});
