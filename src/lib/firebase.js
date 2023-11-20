import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASk4bToGW8-NnMAYuudSmuxtYnszh_6cg",
  authDomain: "trivia-d8bce.firebaseapp.com",
  projectId: "trivia-d8bce",
  storageBucket: "trivia-d8bce.appspot.com",
  messagingSenderId: "791158893730",
  appId: "1:791158893730:web:96fbc1dd2b3e963b153bfb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);

export default auth;