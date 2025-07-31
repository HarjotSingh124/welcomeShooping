// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAm-RLnTCcdy76YD56rihUpqdXlZqxGp1g",
  authDomain: "welcomeshopping-8a43e.firebaseapp.com",
  projectId: "welcomeshopping-8a43e",
  storageBucket: "welcomeshopping-8a43e.firebasestorage.app",
  messagingSenderId: "979987838805",
  appId: "1:979987838805:web:bb287d1b71901de79c21dc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { app }; // ✅ THIS LINE IS REQUIRED