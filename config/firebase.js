const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNYZK77AuFFZzM8-QixP-iyyVyX2U3leo",
  authDomain: "time-tracking-b70af.firebaseapp.com",
  projectId: "time-tracking-b70af",
  storageBucket: "time-tracking-b70af.appspot.com",
  messagingSenderId: "361835962012",
  appId: "1:361835962012:web:20dc6cd6fecbefc4f9d759",
  measurementId: "G-XT32JK1FP8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

module.exports = { db };
