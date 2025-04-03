import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import the authentication module

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
const auth = getAuth(app); // Firebase Authentication

export { app, auth }; // Export them to use in other parts of your app
