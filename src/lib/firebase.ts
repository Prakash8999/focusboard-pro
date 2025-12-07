import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiNb39mA7eelA1LSvXT0alReQ12wPfo24",
  authDomain: "kanbanboard-3ee63.firebaseapp.com",
  projectId: "kanbanboard-3ee63",
  storageBucket: "kanbanboard-3ee63.firebasestorage.app",
  messagingSenderId: "951635947020",
  appId: "1:951635947020:web:c3eb925c1e32b622660829",
  measurementId: "G-7T09QVVYDR"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
