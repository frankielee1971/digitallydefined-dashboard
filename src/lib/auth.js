// src/lib/auth.js
// Puter.js authentication module

import { getPuter } from './puter.js';

let currentUser = null;

export async function getCurrentUser() {
  try {
    const puter = await getPuter();
    currentUser = await puter.auth.getUser();
    return currentUser;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function signIn() {
  try {
    const puter = await getPuter();
    const user = await puter.auth.signIn();
    currentUser = user;
    return user;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const puter = await getPuter();
    await puter.auth.signOut();
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
