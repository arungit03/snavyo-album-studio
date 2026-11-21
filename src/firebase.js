import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCM9sztLMcp-zEN1VTnSM_tJTTaIWLQaF8",
  authDomain: "snavyo-album-studio.firebaseapp.com",
  projectId: "snavyo-album-studio",
  storageBucket: "snavyo-album-studio.firebasestorage.app",
  messagingSenderId: "587992721239",
  appId: "1:587992721239:web:da15d55b20ccae3d718012",
  measurementId: "G-KCPWEGNC3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const timestamp = () => Timestamp.now();

export const initializeFirebaseListeners = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const waitForAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user);
      unsubscribe();
    });
  });
};

export { Timestamp } from 'firebase/firestore';
