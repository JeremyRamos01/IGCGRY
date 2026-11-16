// Motor Automático de Noticias Evangélicas, Versículo del Día y Reflexiones (Estilo BibliaTodo)
// Casa del Gran REY - Leganés (Madrid)
import { db } from './firebase-config.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    deleteDoc,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. FUENTES OFICIALES DE NOTICIAS EVANGÉLICAS (Las mismas agencias de las que se nutre BibliaTodo)
export const EVANGELICAL_SOURCES = [
    {
        id: 'protestante_digital',
        name: 'Protestante Digital',
        badge: 'España / Europa',
        originInfo: 'Agencia oficial de noticias de la Alianza Evangélica Española (AEE) y actualidad protestante.',
        url: 'https://www.protestantedigital.com/rss/portada',
        defaultCategory: 'España y Europa',
        enabledByDefault: true
    },
    {
        id: 'protestante_internacional',
        name: 'Protestante Digital Mundo',
        badge: 'Internacional',
        originInfo: 'Cobertura internacional sobre libertad religiosa, misiones y la iglesia evangélica mundial.',
        url: 'https://www.protestantedigital.com/rss/internacional',
        defaultCategory: 'Mundo Cristiano',
        enabledByDefault: true
    },
    {
        id: 'evangelico_digital',
        name: 'Evangélico Digital',
        badge: 'Global / Iberoamérica',
        originInfo: 'Periódico digital evangélico con noticias de iglesias, sociedad y testimonios en español.',
        url: 'https://www.evangelicodigital.com/rss/portada',
        defaultCategory: 'Actualidad Cristiana',
        enabledByDefault: true
    },
    {
        id: 'acontecer_cristiano',
        name: 'Acontecer Cristiano',
        badge: 'Profecía / Mundo',
        originInfo: 'Portal de noticias cristianas, arqueología bíblica, Israel y testimonios de impacto (fuente frecuente de BibliaTodo).',
        url: 'https://www.acontecercristiano.net/feeds/posts/default?alt=rss',
        defaultCategory: 'Israel y Profecía',
        enabledByDefault: true
    },
    {
        id: 'bibliatodo_syndication',
        name: 'BibliaTodo / Mundo Cristiano',
        badge: 'BibliaTodo & Agencias',
        originInfo: 'Sindicación de titulares de BibliaTodo Noticias, CBN Mundo Cristiano y Puertas Abiertas.',
        url: 'https://news.google.com/rss/search?q=site:bibliatodo.com+OR+site:evangelicodigital.com+OR+"Mundo+Cristiano"&hl=es&gl=ES&ceid=ES:es',
        defaultCategory: 'Actualidad Cristiana',
        enabledByDefault: true
    },
    {
        id: 'protestante_sociedad',
        name: 'Cultura y Sociedad Cristiana',
        badge: 'Sociedad y Fe',
        originInfo: 'Artículos de familia, ética cristiana, cultura bíblica y apologética.',
        url: 'https://www.protestantedigital.com/rss/sociedad',
        defaultCategory: 'Estudio y Reflexión',
        enabledByDefault: true
    }
];

// Configuración por defecto si aún no se ha guardado en Firebase
export const DEFAULT_NEWS_CONFIG = {
    autoEnabled: true,
    autoSaveToFirestore: true,
    autoPublishDailyPost: false,
    renewalHours: 6,
    retentionDays: 15,
    maxHomeNews: 9,
    showTicker: true,
    showVerseOfDay: true,
    showDailyReflection: true,
    enabledSources: EVANGELICAL_SOURCES.map(s => s.id),
    customFeeds: [],
    pinnedIds: [],
    hiddenIds: [],
    lastAutoSyncDate: '',
    lastAutoSyncTimestamp: 0
};

// Imágenes cristianas/bíblicas de alta calidad (Unsplash) para noticias cuyo RSS no adjunte miniatura
const CATEGORY_IMAGES = {
    'España y Europa': [
        'https://images.unsplash.com/photo-1548625361-16800b328a79?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80'
    ],
    'Mundo Cristiano': [
        'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=80'
    ],
    'Israel y Profecía': [
        'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80'
    ],
    'Testimonios y Fe': [
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'
    ],
    'Estudio y Reflexión': [
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80'
    ],
    'Actualidad Cristiana': [
        'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=80'
    ]
};

// 2. VERSÍCULOS DEL DÍA Y REFLEXIONES PASTORALES (Rotación automática los 365 días del año - Reina Valera 1960)
const DAILY_VERSES_AND_DEVOTIONALS = [
    {
        cita: 'Josué 1:9 (RVR1960)',
        versiculo: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.',
        tituloReflexion: 'La valentía que nace de Su presencia',
        reflexion: 'Dios no nos pide que seamos fuertes por nuestra propia capacidad humana, sino porque Él promete caminar a nuestro lado en cada paso. Cuando enfrentamos incertidumbres, recordar que el Señor va delante de nosotros transforma el temor en fe firme y obediente.'
    },
    {
        cita: 'Salmos 23:1-3 (RVR1960)',
        versiculo: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará. Confortará mi alma.',
        tituloReflexion: 'Descanso verdadero en medio de la prisa',
        reflexion: 'En un mundo acelerado y lleno de ansiedad, el Buen Pastor nos invita a detenernos junto a Sus aguas de reposo. Cuando ponemos nuestra vida bajo Su cuidado, descubrimos que en Cristo tenemos provisión, dirección y paz para el alma.'
    },
    {
        cita: 'Isaías 41:10 (RVR1960)',
        versiculo: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
        tituloReflexion: 'Sostenidos por la diestra de Dios',
        reflexion: 'Cuántas veces nuestras fuerzas parecen agotarse ante las pruebas diarias. Pero la promesa del Señor es inquebrantable: Él mismo nos esfuerza y nos sostiene con Su mano poderosa. Hoy puedes descansar confiando en Su fidelidad.'
    },
    {
        cita: 'Jeremías 29:11 (RVR1960)',
        versiculo: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
        tituloReflexion: 'El propósito eterno de Dios para tu vida',
        reflexion: 'Ninguna circunstancia escapa de la soberanía de Dios. Aun cuando no comprendamos el presente, el Señor está tejiendo un propósito de bien, paz y esperanza eterna para aquellos que le buscan de todo corazón.'
    },
    {
        cita: 'Filipenses 4:6-7 (RVR1960)',
        versiculo: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones.',
        tituloReflexion: 'Cambiando la preocupación por oración',
        reflexion: 'El antídoto bíblico contra la ansiedad es entregar cada carga en el altar de la oración con un corazón agradecido. Al hacerlo, Dios deposita Su paz sobrenatural como un centinela que protege nuestra mente y corazón en Cristo Jesús.'
    },
    {
        cita: 'Romanos 8:28 (RVR1960)',
        versiculo: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
        tituloReflexion: 'Todo obra para bien en las manos del Maestro',
        reflexion: 'La fe cristiana no niega las dificultades, pero afirma con certeza que Dios tiene el poder de transformar cada prueba en crecimiento espiritual, carácter cristiano y bendición para Su gloria.'
    },
    {
        cita: 'Proverbios 3:5-6 (RVR1960)',
        versiculo: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.',
        tituloReflexion: 'Confiar plenamente en la sabiduría divina',
        reflexion: 'Nuestra visión es limitada, pero Dios conoce el principio y el fin. Poner cada decisión familiar, laboral y espiritual en Sus manos garantiza que Él guiará nuestros pasos por sendas de justicia.'
    },
    {
        cita: 'Mateo 11:28 (RVR1960)',
        versiculo: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
        tituloReflexion: 'El llamado amoroso de Jesús al corazón cansado',
        reflexion: 'Jesucristo no ofrece una religión de cargas pesadas, sino una relación viva de gracia, perdón y restauración. Acercarnos a Él hoy es hallar alivio verdadero para el espíritu.'
    },
    {
        cita: 'Salmos 91:1-2 (RVR1960)',
        versiculo: 'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.',
        tituloReflexion: 'Vivir bajo el abrigo del Altísimo',
        reflexion: 'Habitar en la presencia de Dios no es una visita ocasional, sino un estilo de vida en comunión constante con Él. Bajo Su sombra encontramos refugio seguro frente a cualquier tempestad.'
    },
    {
        cita: 'Lamentaciones 3:22-23 (RVR1960)',
        versiculo: 'Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.',
        tituloReflexion: 'Misericordias nuevas cada amanecer',
        reflexion: 'Cada nuevo día que Dios nos regala viene acompañado de gracia fresca y nuevas oportunidades para servirle, amar a nuestro prójimo y caminar en santidad. ¡Grande es Su fidelidad!'
    },
    {
        cita: 'Juan 14:27 (RVR1960)',
        versiculo: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.',
        tituloReflexion: 'La paz verdadera que el mundo no puede dar',
        reflexion: 'La paz del mundo depende de que todo marche bien alrededor; la paz de Cristo permanece firme aun en medio de la tormenta porque está fundada en Su victoria en la cruz.'
    },
    {
        cita: 'Hebreos 11:1 (RVR1960)',
        versiculo: 'Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.',
        tituloReflexion: 'Caminando por fe y no por vista',
        reflexion: 'La fe bíblica descansa en el carácter inmutable de Dios y en Su Palabra eterna. Cuando confiamos en Sus promesas, vemos Su mano obrar más allá de lo que nuestros ojos naturales perciben.'
    },
    {
        cita: 'Salmos 119:105 (RVR1960)',
        versiculo: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
        tituloReflexion: 'La Palabra de Dios como guía segura',
        reflexion: 'En tiempos de confusión moral y espiritual, las Sagradas Escrituras siguen siendo la única brújula infalible que alumbra cada paso del creyente hacia la verdad y la vida eterna.'
    },
    {
        cita: '2 Corintios 5:17 (RVR1960)',
        versiculo: 'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.',
        tituloReflexion: 'El poder transformador del Evangelio',
        reflexion: 'El Evangelio no es una simple mejora moral, sino un nuevo nacimiento por obra del Espíritu Santo. En Cristo nuestro pasado es perdonado y recibimos una vida nueva para glorificar a Dios.'
    }
];

// 3. POOL DE RESPALDO DE NOTICIAS EVANGÉLICAS Y REPORTAJES (Por si algún feed externo tarda o el usuario está sin conexión)
const CURATED_FALLBACK_NEWS = [
    {
        id: 'curated-biblia-crecimiento',
        title: 'Crece el interés por la lectura de la Biblia y el estudio de la Palabra entre los jóvenes en España y Europa',
        summary: 'Informes recientes de sociedades bíblicas e iglesias evangélicas destacan un notable despertar espiritual entre la juventud, que busca respuestas sólidas, comunidad y sana doctrina frente a la crisis de valores actual.',
        content: 'Diversas organizaciones cristianas y Sociedades Bíblicas han reportado un incremento significativo en la distribución de ejemplares impresos y descargas de aplicaciones bíblicas entre jóvenes de 18 a 30 años en España y toda Europa.\n\nPastores y líderes juveniles señalan que, tras años de incertidumbre social, una nueva generación está acercándose a las congregaciones locales con hambre genuina por estudiar las Escrituras, orar en comunidad y vivir una fe auténtica centrada en Jesucristo.',
        category: 'España y Europa',
        sourceName: 'Actualidad Evangélica',
        sourceUrl: 'https://www.protestantedigital.com',
        imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'curated-arqueologia-israel',
        title: 'Hallazgos arqueológicos en Jerusalén continúan confirmando la exactitud histórica de los relatos bíblicos',
        summary: 'Investigadores en Tierra Santa han sacado a la luz nuevas inscripciones y estructuras del periodo de los Reyes de Judá y del Segundo Templo que respaldan el registro de las Sagradas Escrituras.',
        content: 'Los recientes trabajos de excavación en el entorno de la Ciudad de David en Jerusalén continúan asombrando a historiadores y estudiosos de la Biblia. Nuevos sellos reales, monedas y estructuras arquitectónicas fechadas en los tiempos de los profetas bíblicos y del ministerio terrenal de Jesús corroboran con precisión los nombres, lugares y contextos descritos en el Antiguo y Nuevo Testamento.\n\nExpertos en arqueología bíblica destacan que cada descubrimiento refuerza la fiabilidad histórica del texto sagrado como testimonio veraz de la obra de Dios en la historia.',
        category: 'Israel y Profecía',
        sourceName: 'Acontecer Cristiano / BibliaTodo',
        sourceUrl: 'https://www.bibliatodo.com/noticias/',
        imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'curated-iglesia-perseguida',
        title: 'Llamado mundial a la oración por la Iglesia Perseguida: millones de creyentes permanecen firmes en su fe',
        summary: 'Ministerios internacionales como Puertas Abiertas invitan a las congregaciones de habla hispana a interceder por los hermanos que sufren persecución por causa del Evangelio en más de 50 naciones.',
        content: 'A pesar de las crecientes restricciones a la libertad religiosa en diversas regiones de Asia, África y Medio Oriente, los reportes misioneros dan testimonio de una iglesia resiliente que sigue creciendo en medio de la adversidad.\n\nLas alianzas evangélicas recuerdan el mandato bíblico de Hebreos 13:3 de acordarnos de los presos y maltratados como si estuviésemos junto a ellos, dedicando tiempos especiales de intercesión en los cultos semanales por la protección, provisión y fortaleza de cada familia cristiana perseguida.',
        category: 'Mundo Cristiano',
        sourceName: 'Puertas Abiertas / Protestante Digital',
        sourceUrl: 'https://www.protestantedigital.com/internacional',
        imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'curated-evangelismo-madrid',
        title: 'Iglesias evangélicas en la Comunidad de Madrid fortalecen su labor de evangelización y ayuda familiar',
        summary: 'El crecimiento de puntos de predicación y congregaciones locales en el sur de Madrid refleja el compromiso del pueblo evangélico con la predicación del Evangelio y el acompañamiento espiritual.',
        content: 'El tejido de iglesias evangélicas en municipios como Leganés, Alcorcón y distintos barrios de Madrid continúa consolidándose como un faro de esperanza, apoyo familiar y proclamación de la Palabra de Dios.\n\nA través de cultos de adoración, escuelas bíblicas, reuniones de oración y atención pastoral cercana, las congregaciones locales responden a la necesidad espiritual de miles de vecinos y familias que encuentran en la comunidad cristiana un hogar de paz y restauración.',
        category: 'España y Europa',
        sourceName: 'Evangélico Digital',
        sourceUrl: 'https://www.evangelicodigital.com',
        imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'curated-traduccion-biblia',
        title: 'Avance histórico en las misiones: cientos de comunidades reciben por primera vez el Nuevo Testamento en su idioma materno',
        summary: 'El trabajo conjunto de traductores bíblicos y misioneros está acercando el cumplimiento de la Gran Comisión a pueblos que nunca habían tenido acceso a las Escrituras en su propia lengua.',
        content: 'Organizaciones misioneras dedicadas a la traducción bíblica han anunciado un récord de nuevos proyectos completados durante este año, permitiendo que comunidades indígenas y grupos étnicos no alcanzados puedan leer y escuchar el Evangelio en el idioma de su corazón.\n\nCon el apoyo de iglesias locales y herramientas tecnológicas de traducción revisadas por teólogos y lingüistas, la Palabra de Dios sigue extendiéndose hasta lo último de la tierra.',
        category: 'Testimonios y Fe',
        sourceName: 'Mundo Cristiano / BibliaTodo',
        sourceUrl: 'https://www.bibliatodo.com/noticias/',
        imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'curated-familia-cristiana',
        title: 'El altar familiar: por qué orar y leer la Biblia en casa sigue siendo el pilar de los hogares cristianos',
        summary: 'Pastores y consejeros familiares subrayan la importancia de dedicar unos minutos cada día en familia para meditar en las Escrituras y presentar las necesidades del hogar ante el Señor.',
        content: 'Frente a la hiperconectividad digital y las distracciones cotidianas, recuperar el hábito del altar familiar se ha convertido en una prioridad urgente para los hogares creyentes.\n\nEstudios pastorales demuestran que las familias que oran juntas y leen diariamente la Palabra de Dios desarrollan vínculos más fuertes, transmiten principios bíblicos sólidos a sus hijos y experimentan mayor fortaleza espiritual ante las dificultades.',
        category: 'Estudio y Reflexión',
        sourceName: 'Reflexiones BibliaTodo',
        sourceUrl: 'https://www.bibliatodo.com/reflexiones-cristianas/',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80'
    }
];

// Utilidades de fecha y sanitización (Protección XSS)
export function getTodayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function sanitizePlainText(htmlOrText) {
    if (!htmlOrText) return '';
    try {
        const doc = new DOMParser().parseFromString(String(htmlOrText), 'text/html');
        let text = doc.body.textContent || '';
        text = text.replace(/\s+/g, ' ').trim();
        return text;
    } catch (e) {
        return String(htmlOrText).replace(/<[^>]*>?/gm, '').trim();
    }
}

export function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Obtener el Versículo y Reflexión del Día según la fecha actual
export function getDailyBiblicalContent() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % DAILY_VERSES_AND_DEVOTIONALS.length;
    return {
        ...DAILY_VERSES_AND_DEVOTIONALS[index],
        fechaKey: getTodayKey(),
        fechaLegible: now.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    };
}

// Clasificador automático de categoría según palabras clave
function detectCategory(title, summary, defaultCat) {
    const text = `${title} ${summary}`.toLowerCase();
    if (text.includes('israel') || text.includes('jerusalén') || text.includes('jerusalen') || text.includes('arqueolog') || text.includes('profec') || text.includes('medio oriente')) {
        return 'Israel y Profecía';
    }
    if (text.includes('españa') || text.includes('madrid') || text.includes('ferede') || text.includes('europa') || text.includes('alianza evangélica española')) {
        return 'España y Europa';
    }
    if (text.includes('testimonio') || text.includes('milagro') || text.includes('bautismo') || text.includes('conversión') || text.includes('mision')) {
        return 'Testimonios y Fe';
    }
    if (text.includes('reflexión') || text.includes('devocional') || text.includes('estudio') || text.includes('familia') || text.includes('oración')) {
        return 'Estudio y Reflexión';
    }
    if (text.includes('persecución') || text.includes('puertas abiertas') || text.includes('internacional') || text.includes('mundo')) {
        return 'Mundo Cristiano';
    }
    return defaultCat || 'Actualidad Cristiana';
}

function getFallbackImage(category, seedStr) {
    const list = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Actualidad Cristiana'];
    let hash = 0;
    const s = String(seedStr || 'cgr');
    for (let i = 0; i < s.length; i++) {
        hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    }
    return list[hash % list.length];
}

// Extraer imagen de un nodo XML de RSS o HTML
function extractImageFromXmlItem(itemNode, rawHtml) {
    // 1. media:content o media:thumbnail o enclosure
    const enclosure = itemNode.querySelector('enclosure');
    if (enclosure && enclosure.getAttribute('url')) {
        const type = enclosure.getAttribute('type') || '';
        if (!type || type.startsWith('image/')) {
            return enclosure.getAttribute('url');
        }
    }
    const mediaElements = itemNode.getElementsByTagNameNS('*', 'content');
    if (mediaElements && mediaElements.length > 0 && mediaElements[0].getAttribute('url')) {
        return mediaElements[0].getAttribute('url');
    }
    const thumbElements = itemNode.getElementsByTagNameNS('*', 'thumbnail');
    if (thumbElements && thumbElements.length > 0 && thumbElements[0].getAttribute('url')) {
        return thumbElements[0].getAttribute('url');
    }
    // 2. Buscar etiqueta <img src="..."> dentro de description o content:encoded
    if (rawHtml) {
        const imgMatch = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http') && !imgMatch[1].includes('1x1') && !imgMatch[1].includes('pixel')) {
            return imgMatch[1];
        }
    }
    return null;
}

// Generar ID determinista y limpio para evitar duplicados
function makeNewsId(title, sourceId) {
    const clean = String(title || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 55);
    return `${sourceId || 'news'}-${clean}`;
}

// Parsear XML de RSS/Atom a objetos normalizados
function parseRssXmlString(xmlString, sourceMeta) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    if (xmlDoc.querySelector('parsererror')) {
        throw new Error('XML inválido');
    }

    const items = Array.from(xmlDoc.querySelectorAll('item, entry')).slice(0, 10);
    const parsedItems = [];

    items.forEach((node) => {
        let title = node.querySelector('title')?.textContent?.trim() || '';
        if (!title) return;

        // En Google News RSS a veces viene "Titular - Nombre Medio", limpiamos de forma elegante
        let extractedSource = sourceMeta.name;
        if (sourceMeta.id === 'bibliatodo_syndication' && title.includes(' - ')) {
            const parts = title.split(' - ');
            const maybeSource = parts.pop().trim();
            if (maybeSource.length < 35) {
                extractedSource = maybeSource;
                title = parts.join(' - ').trim();
            }
        }

        let link = node.querySelector('link')?.textContent?.trim() || '';
        if (!link) {
            const linkAttr = node.querySelector('link')?.getAttribute('href');
            if (linkAttr) link = linkAttr;
        }

        const pubDateRaw =
            node.querySelector('pubDate')?.textContent ||
            node.querySelector('published')?.textContent ||
            node.querySelector('updated')?.textContent ||
            '';

        let pubDateIso = new Date().toISOString();
        if (pubDateRaw) {
            const d = new Date(pubDateRaw);
            if (!isNaN(d.getTime())) {
                pubDateIso = d.toISOString();
            }
        }

        const descRaw = node.querySelector('description')?.textContent || node.querySelector('summary')?.textContent || '';
        const contentEncodedNodes = node.getElementsByTagNameNS('*', 'encoded');
        const contentRaw = (contentEncodedNodes && contentEncodedNodes.length > 0)
            ? contentEncodedNodes[0].textContent
            : (node.querySelector('content')?.textContent || descRaw);

        const cleanSummary = sanitizePlainText(descRaw).slice(0, 280);
        const cleanFullText = sanitizePlainText(contentRaw || descRaw);

        const category = detectCategory(title, cleanSummary, sourceMeta.defaultCategory);
        const extractedImg = extractImageFromXmlItem(node, contentRaw || descRaw);
        const imageUrl = extractedImg || getFallbackImage(category, title);

        parsedItems.push({
            id: makeNewsId(title, sourceMeta.id),
            title,
            summary: cleanSummary || title,
            content: cleanFullText.length > cleanSummary.length ? cleanFullText : (cleanSummary || title),
            category,
            sourceId: sourceMeta.id,
            sourceName: extractedSource,
            sourceUrl: link || 'https://www.bibliatodo.com/noticias/',
            imageUrl,
            fecha: pubDateIso,
            isAuto: true
        });
    });

    return parsedItems;
}

// Descargar un feed RSS probando múltiples vías seguras (Serverless API -> rss2json -> AllOrigins -> CorsProxy)
async function fetchSingleFeed(sourceMeta) {
    const encodedUrl = encodeURIComponent(sourceMeta.url);

    // Vía 1: Nuestro propio endpoint seguro (/api/noticias) si está disponible
    try {
        const res = await fetch(`/api/noticias?url=${encodedUrl}`, { signal: AbortSignal.timeout(4500) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed') || text.includes('<item')) {
                const items = parseRssXmlString(text, sourceMeta);
                if (items.length > 0) return items;
            }
        }
    } catch (e) {
        // Silencioso, pasa al siguiente método
    }

    // Vía 2: rss2json API (Convierte RSS a JSON limpio directamente en el navegador)
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}`, { signal: AbortSignal.timeout(5500) });
        if (res.ok) {
            const data = await res.json();
            if (data && data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
                return data.items.slice(0, 10).map(item => {
                    let title = sanitizePlainText(item.title);
                    let extractedSource = sourceMeta.name;
                    if (sourceMeta.id === 'bibliatodo_syndication' && title.includes(' - ')) {
                        const parts = title.split(' - ');
                        const maybeSource = parts.pop().trim();
                        if (maybeSource.length < 35) {
                            extractedSource = maybeSource;
                            title = parts.join(' - ').trim();
                        }
                    }
                    const cleanSummary = sanitizePlainText(item.description).slice(0, 280);
                    const cleanContent = sanitizePlainText(item.content || item.description);
                    const category = detectCategory(title, cleanSummary, sourceMeta.defaultCategory);
                    let img = item.thumbnail || (item.enclosure && item.enclosure.link) || null;
                    if (!img && (item.content || item.description)) {
                        const m = String(item.content || item.description).match(/<img[^>]+src=["']([^"']+)["']/i);
                        if (m && m[1] && m[1].startsWith('http')) img = m[1];
                    }
                    let pubIso = new Date().toISOString();
                    if (item.pubDate) {
                        const d = new Date(item.pubDate.replace(' ', 'T') + 'Z');
                        if (!isNaN(d.getTime())) pubIso = d.toISOString();
                    }
                    return {
                        id: makeNewsId(title, sourceMeta.id),
                        title,
                        summary: cleanSummary || title,
                        content: cleanContent.length > cleanSummary.length ? cleanContent : (cleanSummary || title),
                        category,
                        sourceId: sourceMeta.id,
                        sourceName: extractedSource,
                        sourceUrl: item.link || 'https://www.bibliatodo.com/noticias/',
                        imageUrl: img || getFallbackImage(category, title),
                        fecha: pubIso,
                        isAuto: true
                    };
                });
            }
        }
    } catch (e) {
        // Pasa al siguiente proxy
    }

    // Vía 3: AllOrigins Raw XML Proxy
    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodedUrl}`, { signal: AbortSignal.timeout(5500) });
        if (res.ok) {
            const text = await res.text();
            const items = parseRssXmlString(text, sourceMeta);
            if (items.length > 0) return items;
        }
    } catch (e) {
        // Pasa al siguiente proxy
    }

    // Vía 4: CorsProxy.io
    try {
        const res = await fetch(`https://corsproxy.io/?${encodedUrl}`, { signal: AbortSignal.timeout(5500) });
        if (res.ok) {
            const text = await res.text();
            const items = parseRssXmlString(text, sourceMeta);
            if (items.length > 0) return items;
        }
    } catch (e) {
        // Si todos fallan, retorna vacío para esta fuente
    }

    return [];
}

// Leer configuración coordinada desde el Panel de Admin en Firestore (config/noticias)
export async function getNewsConfig() {
    try {
        const snap = await getDoc(doc(db, 'config', 'noticias'));
        if (snap.exists()) {
            return { ...DEFAULT_NEWS_CONFIG, ...snap.data() };
        }
    } catch (e) {
        console.warn('Usando configuración de noticias por defecto:', e);
    }
    return { ...DEFAULT_NEWS_CONFIG };
}

// Guardar configuración desde el Panel de Admin (Solo permitido a isAdmin() en firestore.rules)
export async function saveNewsConfig(newConfig) {
    const merged = {
        ...DEFAULT_NEWS_CONFIG,
        ...newConfig,
        updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'config', 'noticias'), merged, { merge: true });
    // Limpiar caché local para aplicar cambios de inmediato
    try {
        localStorage.removeItem('cgr_news_cache_v2');
    } catch (e) {}
    return merged;
}

// Obtener noticias guardadas en la colección de Firestore (noticias_evangelicas)
export async function getStoredFirestoreNews(maxLimit = 40) {
    try {
        const q = query(collection(db, 'noticias_evangelicas'), orderBy('fecha', 'desc'), limit(maxLimit));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach(d => {
            list.push({ firestoreDocId: d.id, ...d.data() });
        });
        return list;
    } catch (e) {
        console.warn('Error leyendo noticias_evangelicas:', e);
        return [];
    }
}

// Obtener noticias frescas de todas las fuentes activas
export async function fetchFreshEvangelicalNews(configOverride = null) {
    const config = configOverride || await getNewsConfig();
    const enabledIds = Array.isArray(config.enabledSources) ? config.enabledSources : DEFAULT_NEWS_CONFIG.enabledSources;

    const activeSources = EVANGELICAL_SOURCES.filter(s => enabledIds.includes(s.id));

    // Añadir fuentes RSS personalizadas si el admin configuró alguna
    if (Array.isArray(config.customFeeds)) {
        config.customFeeds.forEach((cf, idx) => {
            if (cf && cf.url) {
                activeSources.push({
                    id: `custom_${idx}`,
                    name: cf.name || 'Fuente Cristiana',
                    badge: 'Personalizada',
                    url: cf.url,
                    defaultCategory: cf.category || 'Actualidad Cristiana'
                });
            }
        });
    }

    const results = await Promise.allSettled(activeSources.map(src => fetchSingleFeed(src)));
    let allFetched = [];
    results.forEach(r => {
        if (r.status === 'fulfilled' && Array.isArray(r.value)) {
            allFetched = allFetched.concat(r.value);
        }
    });

    // Añadir la Reflexión / Estudio Diario como noticia destacada de edificación si está activo
    if (config.showDailyReflection !== false) {
        const daily = getDailyBiblicalContent();
        allFetched.push({
            id: `reflexion-diaria-${daily.fechaKey}`,
            title: `Reflexión del Día: ${daily.tituloReflexion}`,
            summary: `${daily.reflexion.slice(0, 180)}... Basado en ${daily.cita}.`,
            content: `${daily.reflexion}\n\n📖 Texto Bíblico del Día (${daily.cita}):\n"${daily.versiculo}"`,
            category: 'Estudio y Reflexión',
            sourceId: 'reflexion_diaria',
            sourceName: 'Devocional Casa del Gran REY',
            sourceUrl: 'posts.html',
            imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80',
            fecha: new Date().toISOString(),
            isAuto: true,
            isDailyDevotional: true
        });
    }

    // Si por bloqueo de red local no se obtuvieron suficientes noticias externas, completar con el pool curado con fecha del día
    if (allFetched.length < 4) {
        const todayIso = new Date().toISOString();
        CURATED_FALLBACK_NEWS.forEach((item, idx) => {
            const d = new Date(Date.now() - idx * 3600 * 1000 * 3);
            allFetched.push({
                ...item,
                fecha: d.toISOString() || todayIso,
                isAuto: true
            });
        });
    }

    // Deduplicar por ID y título similar
    const seen = new Set();
    const deduplicated = [];
    for (const item of allFetched) {
        const normTitle = item.title.toLowerCase().slice(0, 45);
        if (!seen.has(item.id) && !seen.has(normTitle)) {
            seen.add(item.id);
            seen.add(normTitle);
            deduplicated.push(item);
        }
    }

    // Ordenar de más reciente a más antigua
    deduplicated.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return deduplicated;
}

// Función principal para la Pantalla de Inicio y Noticias:
// Combina configuración del Admin + Noticias guardadas en Firestore + Renovación diaria automática en vivo
export async function getCombinedPortalNews({ forceRefresh = false } = {}) {
    const config = await getNewsConfig();
    const todayKey = getTodayKey();
    const hiddenSet = new Set(config.hiddenIds || []);
    const pinnedSet = new Set(config.pinnedIds || []);

    // 1. Revisar caché local si no se fuerza refresco y es del mismo día y dentro de la ventana de renovación
    const CACHE_KEY = 'cgr_news_cache_v2';
    if (!forceRefresh && config.autoEnabled !== false) {
        try {
            const rawCache = localStorage.getItem(CACHE_KEY);
            if (rawCache) {
                const parsed = JSON.parse(rawCache);
                const renewalMs = (Number(config.renewalHours) || 6) * 3600 * 1000;
                const isSameDay = parsed.dayKey === todayKey;
                const isFresh = (Date.now() - parsed.timestamp) < renewalMs;
                if (isSameDay && isFresh && Array.isArray(parsed.items) && parsed.items.length >= 4) {
                    const filtered = parsed.items
                        .filter(item => !hiddenSet.has(item.id))
                        .map(item => ({ ...item, pinned: pinnedSet.has(item.id) }));
                    filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (new Date(b.fecha) - new Date(a.fecha)));
                    return {
                        config,
                        items: filtered,
                        dailyBiblical: getDailyBiblicalContent(),
                        fromCache: true,
                        lastUpdated: new Date(parsed.timestamp).toISOString()
                    };
                }
            }
        } catch (e) {}
    }

    // 2. Cargar noticias almacenadas en Firestore y noticias en vivo de las fuentes RSS
    const [storedNews, liveNews] = await Promise.all([
        getStoredFirestoreNews(35),
        config.autoEnabled !== false ? fetchFreshEvangelicalNews(config) : Promise.resolve([])
    ]);

    // Combinar dando prioridad a las noticias frescas y a las guardadas/fijadas en Firestore
    const combinedMap = new Map();
    [...liveNews, ...storedNews].forEach(item => {
        if (!item || !item.id || !item.title) return;
        if (hiddenSet.has(item.id)) return;
        if (!combinedMap.has(item.id)) {
            combinedMap.set(item.id, {
                ...item,
                pinned: pinnedSet.has(item.id) || item.pinned === true
            });
        } else {
            const existing = combinedMap.get(item.id);
            combinedMap.set(item.id, {
                ...existing,
                firestoreDocId: existing.firestoreDocId || item.firestoreDocId,
                pinned: existing.pinned || item.pinned || pinnedSet.has(item.id)
            });
        }
    });

    let finalItems = Array.from(combinedMap.values());
    finalItems.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (new Date(b.fecha) - new Date(a.fecha)));

    // Guardar en caché local del navegador para carga instantánea
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            dayKey: todayKey,
            timestamp: Date.now(),
            items: finalItems.slice(0, 36)
        }));
    } catch (e) {}

    return {
        config,
        items: finalItems,
        dailyBiblical: getDailyBiblicalContent(),
        fromCache: false,
        lastUpdated: new Date().toISOString()
    };
}

// Sincronización y guardado diario en Firestore (Ejecutado por el Admin automáticamente al abrir el panel o al pulsar Sincronizar)
export async function syncAndSaveDailyNewsToFirestore({ isManualTrigger = false } = {}) {
    const config = await getNewsConfig();
    const todayKey = getTodayKey();

    if (!isManualTrigger && (!config.autoEnabled || !config.autoSaveToFirestore)) {
        return { skipped: true, reason: 'Guardado automático desactivado en configuración.' };
    }

    const renewalMs = (Number(config.renewalHours) || 6) * 3600 * 1000;
    const recentlySynced = config.lastAutoSyncDate === todayKey && (Date.now() - (config.lastAutoSyncTimestamp || 0)) < renewalMs;

    if (!isManualTrigger && recentlySynced) {
        return { skipped: true, reason: 'Las noticias de hoy ya están sincronizadas y actualizadas en la base de datos.' };
    }

    // 1. Obtener las últimas noticias evangélicas del día
    const freshItems = await fetchFreshEvangelicalNews(config);
    const hiddenSet = new Set(config.hiddenIds || []);
    const toSave = freshItems.filter(i => !hiddenSet.has(i.id)).slice(0, 15);

    let savedCount = 0;
    for (const item of toSave) {
        const docId = item.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
        await setDoc(doc(db, 'noticias_evangelicas', docId), {
            ...item,
            savedDayKey: todayKey,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        savedCount++;
    }

    // 2. Si el Admin activó "Publicar automáticamente Reflexión/Noticia del Día en Posts", verificar que no exista ya hoy en `posts`
    let postCreated = false;
    if (config.autoPublishDailyPost) {
        const daily = getDailyBiblicalContent();
        const dailyPostDocId = `auto_devocional_${todayKey}`;
        const existingPost = await getDoc(doc(db, 'posts', dailyPostDocId));
        if (!existingPost.exists()) {
            await setDoc(doc(db, 'posts', dailyPostDocId), {
                title: `📖 Versículo y Reflexión del Día: ${daily.tituloReflexion}`,
                content: `"${daily.versiculo}" — ${daily.cita}\n\n${daily.reflexion}`,
                imageUrls: ['https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80'],
                mediaTypes: ['image/jpeg'],
                fecha: new Date().toISOString(),
                isAutoDailyPost: true,
                categoria: 'Devocional Diario'
            });
            postCreated = true;
        }
    }

    // 3. Limpieza automática de noticias antiguas en Firestore para mantener la base de datos ligera
    const retentionDays = Number(config.retentionDays) || 15;
    const cutoffTime = Date.now() - (retentionDays * 24 * 3600 * 1000);
    let cleanedCount = 0;
    try {
        const allStored = await getDocs(collection(db, 'noticias_evangelicas'));
        const deletePromises = [];
        allStored.forEach(d => {
            const data = d.data();
            const itemTime = data.fecha ? new Date(data.fecha).getTime() : 0;
            const isPinned = (config.pinnedIds || []).includes(data.id) || data.pinned === true;
            if (!isPinned && itemTime > 0 && itemTime < cutoffTime) {
                deletePromises.push(deleteDoc(doc(db, 'noticias_evangelicas', d.id)));
                cleanedCount++;
            }
        });
        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
        }
    } catch (e) {
        console.warn('Aviso al limpiar noticias antiguas:', e);
    }

    // 4. Actualizar marca de tiempo en config/noticias
    await saveNewsConfig({
        ...config,
        lastAutoSyncDate: todayKey,
        lastAutoSyncTimestamp: Date.now()
    });

    return {
        skipped: false,
        savedCount,
        cleanedCount,
        postCreated,
        todayKey
    };
}
