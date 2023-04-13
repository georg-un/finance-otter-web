import { User as FirebaseUser } from '@firebase/auth';
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export function firebaseUserToFinoUser(firebaseUser: FirebaseUser): User {
  if (!firebaseUser || !firebaseUser.email || !firebaseUser.displayName || !firebaseUser.photoURL) {
    throw new Error(`One or more required properties are missing in Firebase user object: ${JSON.stringify(firebaseUser)}`);
  }
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL
  };
}
