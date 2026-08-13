import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace this with your actual Firebase project configuration
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Click the Settings gear icon -> Project settings
// 3. Under "Your apps", select the Web app (or add a new one)
// 4. Copy the firebaseConfig object and paste it below
const firebaseConfig = {
  apiKey: "AIzaSyATOgCQg3bOSepbsBEq84C3TrLykgEGzy0",
  authDomain: "skillforge-a89a7.firebaseapp.com",
  projectId: "skillforge-a89a7",
  storageBucket: "skillforge-a89a7.firebasestorage.app",
  messagingSenderId: "918090128873",
  appId: "1:918090128873:web:c79b7500469cd25e27ff78",
  measurementId: "G-CSYC8EW9LJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);
