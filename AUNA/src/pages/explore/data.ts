// datos de prueba de explore: las publicaciones que salen en la pagina
// en react las imagenes se importan, asi Vite sabe que tiene que incluirlas
import anaRutas from '../../assets/images/ana-rutas.png';
import daniMindful from '../../assets/images/dani-mindful.png';
import renataLibros from '../../assets/images/renata-libros.png';
import saraEstudia from '../../assets/images/sara-estudia.png';
import juliMamis from '../../assets/images/juli-mamis.png';
import ninaTaller from '../../assets/images/nina-taller.png';
import parque from '../../assets/images/parque.png';
import libroAnimado from '../../assets/images/libroanimado.png';
import cafeCalma from '../../assets/images/cafe-calma.png';

// temas de los filtros
// value es lo que comparo con el topic del post y text es lo que se ve en el boton
export const topics = [
    { value: 'All', text: 'All' },
    { value: 'Wellness', text: 'Wellness' },
    { value: 'Reading', text: 'Reading' },
    { value: 'Places', text: 'Safe places' },
    { value: 'Creativity', text: 'Creativity' },
    { value: 'Motherhood', text: 'Motherhood' },
    { value: 'Study', text: 'Study & career' },
];

// tipado de una publicacion: asi typescript me avisa si me falta un dato
export interface Post {
    id: number;               // numero para identificar cada post
    user: string;
    meta: string;
    topic: string;             // tiene que ser igual al valor de un filtro
    text: string;
    image: string;
    imageAlt: string; // lo uso como alt de la imagen
    comments: number;
    likes: number;
}

// todas las publicaciones en un array de objetos
// con este array creo las tarjetas con map, no las escribo una por una
// favorites tambien lo importa para saber cuales guarde
export const explorePosts: Post[] = [
    {
        id: 1,
        user: '@ana.rutas',
        meta: 'Places Community · 1h ago',
        topic: 'Places',
        text: 'Map of lit bike paths in the north. We built it together — add yours.',
        image: anaRutas,
        imageAlt: 'Lit bike path at sunset',
        comments: 62,
        likes: 418,
    },
    {
        id: 2,
        user: '@dani.mindful',
        meta: 'Verified creator · 3h ago',
        topic: 'Wellness',
        text: 'Three breaths to calm anxiety before an interview. They even work for me on the bus.',
        image: daniMindful,
        imageAlt: 'Hands holding a warm cup',
        comments: 95,
        likes: 733,
    },
    {
        id: 3,
        user: '@renata.libros',
        meta: 'Book club · 6h ago',
        topic: 'Reading',
        text: 'We finished chapter five and still have questions. Did anyone else cry on page 200?',
        image: renataLibros,
        imageAlt: 'Stack of books by a window',
        comments: 41,
        likes: 289,
    },
    {
        id: 4,
        user: '@sara.estudia',
        meta: 'Study Community · 9h ago',
        topic: 'Study',
        text: 'Online study session on Tuesdays at 7pm. Camera optional, company guaranteed.',
        image: saraEstudia,
        imageAlt: 'Desk with a notebook and coffee',
        comments: 28,
        likes: 512,
    },
    {
        id: 5,
        user: '@juli.mamis',
        meta: 'Weekly meetup · 1d ago',
        topic: 'Motherhood',
        text: "We took the little ones to the park on 12th. There's shade, clean restrooms, and other moms nearby.",
        image: juliMamis,
        imageAlt: 'Playground in the morning',
        comments: 77,
        likes: 604,
    },
    {
        id: 6,
        user: '@nina.taller',
        meta: 'Verified creator · 2d ago',
        topic: 'Creativity',
        text: "I opened spots for Saturday's ceramics workshop. Small space, only eight spots.",
        image: ninaTaller,
        imageAlt: 'Hands shaping ceramics',
        comments: 33,
        likes: 356,
    },
    {
        id: 7,
        user: '@lina.camina',
        meta: 'Wellness Community · 3d ago',
        topic: 'Wellness',
        text: 'Sunday walk in the park at 8am. We go slow, we talk, and nobody walks alone.',
        image: parque,
        imageAlt: 'Green park with tall trees',
        comments: 24,
        likes: 198,
    },
    {
        id: 8,
        user: '@sofi.lee',
        meta: 'Book club · 4d ago',
        topic: 'Reading',
        text: 'This month\'s book is short and sweet. Perfect if you want to start reading again.',
        image: libroAnimado,
        imageAlt: 'Illustrated book cover',
        comments: 18,
        likes: 143,
    },
    {
        id: 9,
        user: '@cafe.calma',
        meta: 'Safe place · 5d ago',
        topic: 'Places',
        text: 'Quiet café with big tables and staff who know the network. Open until 10pm.',
        image: cafeCalma,
        imageAlt: 'Cup of coffee on a table',
        comments: 31,
        likes: 267,
    },
];

// colecciones de la semana (las 3 tarjetas de colores)
export const weeklyCollections = [
    { title: 'Safe routes', text: '48 places verified by users', color: 'rosa-claro' },
    { title: 'Read together', text: '12 active clubs this month', color: 'rosa' },
    { title: 'Voices that support you', text: 'Stories of care and mental health', color: 'oscura' },
] as const;