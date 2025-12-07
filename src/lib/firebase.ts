import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "qwertyuioiuygtfvbnmkuygvbnmkiuhyg",
  authDomain: "kanbanboard.firebaseapp.com",
  projectId: "kanbanboard",
  storageBucket: "kanbanboard.firebasestorage.app",
  messagingSenderId: "745844752sd",
  appId: "1:erthjklkjhb",
  measurementId: "G-wertyuiklk"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
