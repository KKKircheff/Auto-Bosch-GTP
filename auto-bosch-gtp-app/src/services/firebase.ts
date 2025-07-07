// src/services/firebase.ts
import {initializeApp} from 'firebase/app';
import {getAuth, connectAuthEmulator, signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore, connectFirestoreEmulator} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Connect to emulators in development (optional)
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
    try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
        console.log('Emulators already connected or error:', error);
    }
}

// Admin credentials (only for admin login)
export const ADMIN_CREDENTIALS = {
    email: import.meta.env.VITE_ADMIN_EMAIL,
    password: import.meta.env.VITE_ADMIN_PASSWORD,
};

// Helper function for admin login
export const loginAdmin = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            ADMIN_CREDENTIALS.email,
            ADMIN_CREDENTIALS.password
        );
        return userCredential.user;
    } catch (error) {
        console.error('Admin login failed:', error);
        throw error;
    }
};

export default app;
