
// IMPORTANT: You must create a .env.local file in the root of your project
// and add your Firebase project's configuration details there.
//
// NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
// NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import type { SignUpPayload, SignInPayload } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyAy-rGaNnGg79pvWaHxDUpz7_ZAw-jXux8",
  authDomain: "von-os-juooq.firebaseapp.com",
  projectId: "von-os-juooq",
  storageBucket: "von-os-juooq.firebasestorage.app",
  messagingSenderId: "366247376303",
  appId: "1:366247376303:web:8ea58a9e3e93e9f981eb5a",
  measurementId: "G-4KHLM1KLRB"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Auth functions
const signUp = (payload: SignUpPayload) => {
    return createUserWithEmailAndPassword(auth, payload.email, payload.password);
}

const signIn = (payload: SignIn.SignInPayload) => {
    return signInWithEmailAndPassword(auth, payload.email, payload.password);
}

const signOut = () => {
    return firebaseSignOut(auth);
}

export { app, auth, db, functions, signUp, signIn, signOut };
