import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Update: Use initializeAuth
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you have this import

// Firebase config
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

// Initialize Firebase Auth with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Correct way to set persistence
});

export { app, auth };
