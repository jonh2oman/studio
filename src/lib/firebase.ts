
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCsCNA6wAGThwp2M3v7dtCmi43IK6whWQ",
  authDomain: "rcscc-training-plan.firebaseapp.com",
  projectId: "rcscc-training-plan",
  storageBucket: "rcscc-training-plan.firebasestorage.app",
  messagingSenderId: "253553612091",
  appId: "1:253553612091:web:10bedc76c37a0f2a76131e"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
