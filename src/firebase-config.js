// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyCvWs7LyadmMf2d9ikHPo8i2ZEu03aq_VY",
  authDomain: "tap-86240.firebaseapp.com",
  projectId: "tap-86240",
  storageBucket: "tap-86240.appspot.com",
  messagingSenderId: "650203684911",
  appId: "1:650203684911:web:48a2bc446cdd4cbb15a6da",
  measurementId: "G-EN6T9ED69N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, analytics, storage }; 