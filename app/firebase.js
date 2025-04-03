import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'; // Updated imports
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getReactNativePersistence } from 'firebase/auth'; // Import correct persistence function

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

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set persistence with correct AsyncStorage
setPersistence(auth, getReactNativePersistence(AsyncStorage)) // This should fix persistence issues
  .then(() => {
    // Persistence set successfully
  })
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

export { app, auth }; // Export them to use in other parts of your app
