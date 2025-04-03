import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth'; // Import auth and initializeAuth
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getReactNativePersistence } from 'firebase/auth'; // Get persistence method

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVl7Isqwnj0FM4xJ_GLztYy1RrZdEZOwo",
  authDomain: "chronowell-a110d.firebaseapp.com",
  projectId: "chronowell-a110d",
  storageBucket: "chronowell-a110d.firebasestorage.app",
  messagingSenderId: "176747721312",
  appId: "1:176747721312:web:dcf1bc26d848e3ad194905",
  measurementId: "G-ZNGSH80BBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Ensure persistence with AsyncStorage
});

export { app, auth }; // Export them to use in other parts of your app
