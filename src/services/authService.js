//
// Thin wrapper around Firebase Auth. All auth access goes through here so the
// provider can be swapped without touching components.
//
import { auth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signup(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    const { updateProfile } = await import('firebase/auth');
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function currentUser() {
  return auth.currentUser;
}