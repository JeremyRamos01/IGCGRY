// Importar las funciones necesarias de los SDKs de Firebase (versión 10.7.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Reemplaza este objeto con la configuración de tu proyecto de Firebase.
// Puedes encontrar esto en Configuración del Proyecto > General > Tus aplicaciones en la consola de Firebase.
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore (Base de datos) y exportarlo para usarlo en otros archivos
export const db = getFirestore(app);
