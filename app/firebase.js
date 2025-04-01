import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import the authentication module
import { getAnalytics } from 'firebase/analytics'; // Optional, if you want analytics
// Add more imports for other Firebase features as needed

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

// Initialize Firebase Authentication and Analytics (if needed)
const auth = getAuth(app); // Firebase Authentication
const analytics = getAnalytics(app); // Optional for analytics

export { app, auth, analytics }; // Export them to use in other parts of your app
