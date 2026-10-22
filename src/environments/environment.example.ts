/**
 * Template for `environment.ts`, which stays out of the repository (.gitignore).
 * Copy this file to `environment.ts` and fill in the web config of the Firebase project
 * (Firebase console → Project settings → Your apps). CI and deploy write `environment.ts`
 * from the GitHub secret `FIREBASE_CONFIG` (the same object as JSON).
 */
export const environment = {
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};
