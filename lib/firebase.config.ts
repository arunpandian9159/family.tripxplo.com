import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBfGUGIqNC6G3HHr6VKuCJmrjG95MLnjig",
  authDomain: "tripxplo-b683b.firebaseapp.com",
  projectId: "tripxplo-b683b",
  storageBucket: "tripxplo-b683b.appspot.com",
  messagingSenderId: "426422161258",
  appId: "1:426422161258:web:672ddeddc6c691348e5f13",
  measurementId: "G-5MBHTWVPEF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
