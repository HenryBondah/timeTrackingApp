// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNYZK77AuFFZzM8-QixP-iyyVyX2U3leo",
  authDomain: "time-tracking-b70af.firebaseapp.com",
  projectId: "time-tracking-b70af",
  storageBucket: "time-tracking-b70af.appspot.com",
  messagingSenderId: "361835962012",
  appId: "1:361835962012:web:20dc6cd6fecbefc4f9d759",
  measurementId: "G-XT32JK1FP8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
