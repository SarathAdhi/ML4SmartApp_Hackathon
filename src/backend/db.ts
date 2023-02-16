import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ml4smartapphackathon.firebaseapp.com",
  projectId: "ml4smartapphackathon",
  storageBucket: "ml4smartapphackathon.appspot.com",
  messagingSenderId: "801486366472",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-TDF6VZD4H3",
};

const app = initializeApp(firebaseConfig);

export const dbFireStore = getFirestore(app);
export const storage = getStorage(app);
export const userCollectionRef = collection(dbFireStore, "users");
export const documentCollectionRef = collection(dbFireStore, "document");
