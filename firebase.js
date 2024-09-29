// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxUfqxPTQShmppTh_u1Hig7eOD5zg6D9k",
  authDomain: "aditi-quiz-app.firebaseapp.com",
  projectId: "aditi-quiz-app",
  storageBucket: "aditi-quiz-app.appspot.com",
  messagingSenderId: "422472224965",
  appId: "1:422472224965:web:0fb4ea0a2a82f4d72920ac",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { auth, provider, firestore, logout };
