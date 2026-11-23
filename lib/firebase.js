// lib/firebase.js
// Conexion con el mismo proyecto de Firebase que usa la app movil (rotula-movil),
// asi las cuentas y los datos son los mismos en la web y en el celular.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Next solo pasa al navegador las variables NEXT_PUBLIC_ escritas completas (ver .env.example)
const configuracion = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// al recargar en desarrollo se reutiliza la app que ya existe
const app = getApps().length ? getApp() : initializeApp(configuracion);

export const auth = getAuth(app);
export const db = getFirestore(app);
