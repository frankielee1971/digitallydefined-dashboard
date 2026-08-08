// src/lib/firebase-auth.js
// Firebase Authentication module for DigitallyDefined Dashboard

import { auth, googleProvider } from '../firebase.js';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

let currentUser = null;
let authListeners = [];

export async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      currentUser = user;
      resolve(user);
    });
  });
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    currentUser = result.user;
    return result.user;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    currentUser = null;
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

export async function isSignedIn() {
  const user = await getCurrentUser();
  return !!user;
}

export { currentUser };
