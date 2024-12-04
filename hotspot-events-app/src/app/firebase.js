import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDby2TMuLR_GiGlg65OB_GkRiOLcSv8X_M",
    authDomain: "hotspot-2710a.firebaseapp.com",
    projectId: "hotspot-2710a",
    storageBucket: "hotspot-2710a.firebasestorage.app",
    messagingSenderId: "230218036169",
    appId: "1:230218036169:web:e8d64bba14828eb523ae18",
    measurementId: "G-HRB41Y2LTK"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Failed to set persistence:", error)
});

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserSessionPersistence };
