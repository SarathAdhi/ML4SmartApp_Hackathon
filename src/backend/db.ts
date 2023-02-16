import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAG3NlfepiSLiPTKML0vwiOIUVC-7-wg1I",
  authDomain: "ml4smartapphackathon.firebaseapp.com",
  projectId: "ml4smartapphackathon",
  storageBucket: "ml4smartapphackathon.appspot.com",
  messagingSenderId: "801486366472",
  appId: "1:801486366472:web:d7f85072cf067d2f196ebd",
  measurementId: "G-TDF6VZD4H3",
};

const app = initializeApp(firebaseConfig);

export const dbFireStore = getFirestore(app);
export const storage = getStorage(app);
export const userCollectionRef = collection(dbFireStore, "users");
