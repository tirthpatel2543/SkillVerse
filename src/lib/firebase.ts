// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// To get this configuration object:
// 1. Go to your Firebase project console.
// 2. In the left-hand menu, click on the gear icon next to "Project Overview" and select "Project settings".
// 3. In the "General" tab, scroll down to the "Your apps" section.
// 4. If you haven't created a web app yet, click the "</>" icon to add one.
// 5. Find your web app and click on "Config" to see your Firebase SDK configuration snippet.
// 6. Copy the configuration object and paste it here.
const firebaseConfig = {
  apiKey: "AIzaSyBA9Z14ByktWwGW5CZrYB5rkha-_AJQhQM",
  authDomain: "up-skill-3407c.firebaseapp.com",
  projectId: "up-skill-3407c",
  storageBucket: "up-skill-3407c.firebasestorage.app",
  messagingSenderId: "864836385848",
  appId: "1:864836385848:web:76eac8bea8e0f832777acd",
  measurementId: "G-HFC7X7GFYZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };


