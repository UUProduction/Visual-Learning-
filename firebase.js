// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4teFWq4ZC53Bu2vF7ZFI-xTf1kCweXc0",
  authDomain: "visual-learning-8850d.firebaseapp.com",
  projectId: "visual-learning-8850d",
  storageBucket: "visual-learning-8850d.firebasestorage.app",
  messagingSenderId: "319732866288",
  appId: "1:319732866288:web:e54d182b40cef4cb3db635",
  measurementId: "G-ZZMYPF7WQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
