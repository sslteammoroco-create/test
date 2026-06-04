// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH4DK1J6SxHRhwtYDLBuXVT_E_qRDAksw",
  authDomain: "tmmf-7848d.firebaseapp.com",
  projectId: "tmmf-7848d",
  storageBucket: "tmmf-7848d.firebasestorage.app",
  messagingSenderId: "795485005893",
  appId: "1:795485005893:web:7aa77900bfff30d6afdb2c",
  measurementId: "G-4NGJ4LH1XJ"
};

// We will use the modular SDK (v10+) via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
