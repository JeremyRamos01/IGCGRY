import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase
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
export const db = getFirestore(app);

// Función para descargar eventos de la base de datos
export async function fetchEventos() {
    try {
        const eventosCol = collection(db, 'eventos');
        const eventoSnapshot = await getDocs(eventosCol);
        
        // Si no hay eventos en la BD, devolvemos uno de prueba
        if(eventoSnapshot.empty) {
            return [
                {
                    id: 'demo1', 
                    title: 'Culto de Adoración', 
                    start: '2026-06-28T11:00:00', 
                    end: '2026-06-28T14:00:00',
                    description: 'Reunión general. (Este es un dato de prueba porque tu base de datos en Firebase está vacía. Añade documentos a la colección "eventos" en Firestore).', 
                    color: '#d4af37', 
                    image: 'img/carrusel/B.jpg'
                }
            ];
        }
        
        // Mapear los documentos a nuestro formato de evento
        return eventoSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                start: data.start, // formato ISO "YYYY-MM-DDTHH:mm:ss"
                end: data.end,
                description: data.description,
                color: data.color || '#d4af37',
                image: data.image || 'img/carrusel/A.jpg'
            };
        });
    } catch (error) {
        console.error("Error obteniendo eventos de Firebase:", error);
        return [];
    }
}
