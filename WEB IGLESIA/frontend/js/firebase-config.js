// Importar las funciones necesarias de los SDKs de Firebase (versión 10.7.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Reemplaza este objeto con la configuración de tu proyecto de Firebase.
// Puedes encontrar esto en Configuración del Proyecto > General > Tus aplicaciones en la consola de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCCTbCCB551dIlPpInrUPKb8L9qLrgHORg",
  authDomain: "casa-del-gran-rey.firebaseapp.com",
  projectId: "casa-del-gran-rey",
  storageBucket: "casa-del-gran-rey.firebasestorage.app",
  messagingSenderId: "346085992467",
  appId: "1:346085992467:web:28fd5e3d3ce95a3796f7e6",
  measurementId: "G-1VLJEHWB3M"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore (Base de datos) y exportarlo para usarlo en otros archivos
export const db = getFirestore(app);

// Inicializar Storage para subir imágenes
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
export const storage = getStorage(app);
