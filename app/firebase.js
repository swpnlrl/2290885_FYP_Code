// /app/screens/firebase.js

// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD63YM03m2psucNHmZ3OU6XAS8ANcmteJw",
  authDomain: "chronowell-55835.firebaseapp.com",
  projectId: "chronowell-55835",
  storageBucket: "chronowell-55835.firebasestorage.app",
  messagingSenderId: "705066025564",
  appId: "1:705066025564:web:a85614f3680eecab28dc99",
  measurementId: "G-9087Z3QX12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export the auth instance for use in your app
export { auth };
