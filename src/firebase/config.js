import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton pattern for Firebase app
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig, 'uccr') : getApp('uccr');
} catch (error) {
  if (error.code === 'app/no-app') {
    app = initializeApp(firebaseConfig, 'uccr');
  } else {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

// Firestore persistence settings
const firestoreSettings = {
  cache: {
    type: 'persistent',
    memoryCache: false,
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  },
};

// Initialize Firestore with persistence
const db = initializeFirestore(app, firestoreSettings);

// Initialize Auth
const auth = getAuth(app);

console.log('Firebase: Initialized', { app: !!app, auth: !!auth, db: !!db });

export { app, auth, db };