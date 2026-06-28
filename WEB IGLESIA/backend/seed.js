const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCCTbCCB551dIlPpInrUPKb8L9qLrgHORg",
  authDomain: "casa-del-gran-rey.firebaseapp.com",
  projectId: "casa-del-gran-rey",
  storageBucket: "casa-del-gran-rey.firebasestorage.app",
  messagingSenderId: "346085992467",
  appId: "1:346085992467:web:28fd5e3d3ce95a3796f7e6",
  measurementId: "G-1VLJEHWB3M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedEvents() {
    console.log("Iniciando generación de eventos recurrentes para 2026...");
    const eventsRef = collection(db, "eventos");

    let currentDate = new Date(); // Inicia hoy
    currentDate.setHours(0, 0, 0, 0);

    const endDate = new Date(2026, 11, 31); // Hasta 31 dic 2026

    let eventCount = 0;

    while (currentDate <= endDate) {
        const day = currentDate.getDay(); // 0: Domingo, 2: Martes, 6: Sábado
        
        let title = "";
        let startTime = "";
        let endTime = "";
        let description = "";

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${date}`;

        if (day === 2) {
            title = "Oración";
            startTime = `${dateStr}T19:00:00`;
            endTime = `${dateStr}T20:00:00`;
            description = "Tiempo de clamor y búsqueda espiritual de la congregación.";
        } else if (day === 6) {
            title = "Culto en el Templo";
            startTime = `${dateStr}T19:00:00`;
            endTime = `${dateStr}T20:00:00`;
            description = "Culto general sabatino. Ven a adorar al Señor.";
        } else if (day === 0) {
            title = "Culto en el Templo";
            startTime = `${dateStr}T11:00:00`;
            endTime = `${dateStr}T14:00:00`;
            description = "Servicio dominical principal para toda la familia.";
        }

        if (title !== "") {
            try {
                await addDoc(eventsRef, {
                    title,
                    start: startTime,
                    end: endTime,
                    description,
                    backgroundColor: day === 2 ? '#64748b' : '#0f172a' // Un poco diferente para oración
                });
                eventCount++;
                console.log(`Creado: ${title} - ${dateStr}`);
            } catch (error) {
                console.error(`Error creando evento en ${dateStr}:`, error);
            }
        }

        // Avanzar al día siguiente
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`¡Proceso completado! Se crearon ${eventCount} eventos recurrentes.`);
    process.exit(0);
}

seedEvents();
