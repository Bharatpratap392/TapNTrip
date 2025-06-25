// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Default configuration for development (you should replace these with your own values in production)
const defaultConfig = {
  apiKey: "AIzaSyCvWs7LyadmMf2d9ikHPo8i2ZEu03aq_VY",
  authDomain: "tap-86240.firebaseapp.com",
  projectId: "tap-86240",
  storageBucket: "tap-86240.firebasestorage.app",
  messagingSenderId: "650203684911",
  appId: "1:650203684911:web:48a2bc446cdd4cbb15a6da",
  measurementId: "G-EN6T9ED69N"
};

// Use environment variables if available, otherwise fall back to default config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};

let app;
let auth;
let db;
let analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Only initialize analytics in production and if enabled
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
    analytics = getAnalytics(app);
  }

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // You might want to show a user-friendly error message
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

export { auth, db, analytics }; 