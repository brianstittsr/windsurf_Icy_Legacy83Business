import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if we're in a browser environment and have valid config
const isBrowser = typeof window !== "undefined";
const hasValidConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

// Lazy initialization to prevent build-time errors
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

const getFirebaseApp = (): FirebaseApp => {
  if (!_app) {
    if (!hasValidConfig) {
      throw new Error("Firebase configuration is missing. Please set environment variables.");
    }
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
};

// Firebase services - lazy initialized
export const auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_auth && isBrowser && hasValidConfig) {
      _auth = getAuth(getFirebaseApp());
    }
    if (!_auth) {
      if (prop === "currentUser") return null;
      throw new Error("Firebase Auth not initialized");
    }
    const value = (_auth as any)[prop];
    return typeof value === "function" ? value.bind(_auth) : value;
  },
});

export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_db && hasValidConfig) {
      _db = getFirestore(getFirebaseApp());
    }
    if (!_db) {
      throw new Error("Firebase Firestore not initialized. Check environment variables.");
    }
    const value = (_db as any)[prop];
    return typeof value === "function" ? value.bind(_db) : value;
  },
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(_, prop) {
    if (!_storage && isBrowser && hasValidConfig) {
      _storage = getStorage(getFirebaseApp());
    }
    if (!_storage) {
      throw new Error("Firebase Storage not initialized");
    }
    const value = (_storage as any)[prop];
    return typeof value === "function" ? value.bind(_storage) : value;
  },
});

// Analytics (only in browser)
export const initAnalytics = async () => {
  if (isBrowser && hasValidConfig && (await isSupported())) {
    return getAnalytics(getFirebaseApp());
  }
  return null;
};

// Export app getter for cases where direct access is needed
export const getApp_ = () => (hasValidConfig ? getFirebaseApp() : null);
export default new Proxy({} as FirebaseApp, {
  get(_, prop) {
    const app = getFirebaseApp();
    const value = (app as any)[prop];
    return typeof value === "function" ? value.bind(app) : value;
  },
});
