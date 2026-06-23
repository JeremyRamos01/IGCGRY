// js/data/eventos.js
// Simulamos una base de datos de eventos (JSON escalable)
// Lista para ser conectada a Firebase en el futuro.
window.eventosDB = [
    {
        id: '1',
        title: 'Culto de Adoración',
        start: '2026-06-21T11:00:00',
        end: '2026-06-21T14:00:00',
        description: 'Reunión general de adoración y predicación de la Palabra.',
        color: '#d4af37', // accent gold
        image: 'img/carrusel/B.jpg'
    },
    {
        id: '2',
        title: 'Estudio Bíblico',
        start: '2026-06-23T19:00:00',
        end: '2026-06-23T20:00:00',
        description: 'Estudio profundo de las escrituras. Trae tu Biblia.',
        color: '#0f172a', // primary dark
        image: 'img/carrusel/A.jpg'
    },
    {
        id: '3',
        title: 'Reunión de Jóvenes',
        start: '2026-06-27T18:00:00',
        end: '2026-06-27T20:00:00',
        description: 'Reunión especial enfocada en las nuevas generaciones. Alabanza dinámica y temas de actualidad.',
        color: '#10b981', // emerald
        image: 'img/carrusel/C.jpg'
    },
    {
        id: '4',
        title: 'Culto de Adoración',
        start: '2026-06-28T11:00:00',
        end: '2026-06-28T14:00:00',
        description: 'Reunión general dominical.',
        color: '#d4af37',
        image: 'img/carrusel/B.jpg'
    }
];
