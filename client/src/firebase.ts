// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOjVIFOPpDYAbWiyrYook9yVsSFwvRz7A",
  authDomain: "wiecodes.firebaseapp.com",
  projectId: "wiecodes",
  storageBucket: "wiecodes.firebasestorage.app",
  messagingSenderId: "916732355547",
  appId: "1:916732355547:web:3fe0bd8b3f2a6606677dfe",
  measurementId: "G-XVJEQ3WEL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
