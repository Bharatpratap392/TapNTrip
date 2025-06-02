// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase configuration
// You can find these values in your Firebase Console:
// 1. Go to console.firebase.google.com
// 2. Select your project
// 3. Click on the gear icon next to "Project Overview"
// 4. Click "Project settings"
// 5. Scroll down to "Your apps" section
// 6. Under the "</>" icon, you'll find these configuration values
const firebaseConfig = {
  apiKey: "AIzaSyCAzucMgq7PQMiAE-WyKcEOFreegxwhYgw",
  authDomain: "tapntrip-73346.firebaseapp.com",
  projectId: "tapntrip-73346",
  storageBucket: "tapntrip-73346.firebasestorage.app",
  messagingSenderId: "776667099064",
  appId: "1:776667099064:web:73d32f408d2342033d294d",
  measurementId: "G-R4XW268M39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 