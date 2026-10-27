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
// valor es lo que comparo con el tema del post y texto es lo que se ve en el boton
export const temas = [
    { valor: 'All', texto: 'All' },
    { valor: 'Wellness', texto: 'Wellness' },
    { valor: 'Reading', texto: 'Reading' },
    { valor: 'Places', texto: 'Safe places' },
    { valor: 'Creativity', texto: 'Creativity' },
    { valor: 'Motherhood', texto: 'Motherhood' },
    { valor: 'Study', texto: 'Study & career' },
];

// tipado de una publicacion: asi typescript me avisa si me falta un dato
export interface Post {
    id: number;               // numero para identificar cada post
    usuario: string;
    meta: string;
    tema: string;             // tiene que ser igual al valor de un filtro
    texto: string;
    imagen: string;
    descripcionImagen: string; // lo uso como alt de la imagen
    comentarios: number;
    likes: number;
}

// todas las publicaciones en un array de objetos
// con este array creo las tarjetas con map, no las escribo una por una
// favorites tambien lo importa para saber cuales guarde
export const publicaciones: Post[] = [
    {
        id: 1,
        usuario: '@ana.rutas',
        meta: 'Places Community · 1h ago',
        tema: 'Places',
        texto: 'Map of lit bike paths in the north. We built it together — add yours.',
        imagen: anaRutas,
        descripcionImagen: 'Lit bike path at sunset',
        comentarios: 62,
        likes: 418,
    },
    {
        id: 2,
        usuario: '@dani.mindful',
        meta: 'Verified creator · 3h ago',
        tema: 'Wellness',
        texto: 'Three breaths to calm anxiety before an interview. They even work for me on the bus.',
        imagen: daniMindful,
        descripcionImagen: 'Hands holding a warm cup',
        comentarios: 95,
        likes: 733,
    },
    {
        id: 3,
        usuario: '@renata.libros',
        meta: 'Book club · 6h ago',
        tema: 'Reading',
        texto: 'We finished chapter five and still have questions. Did anyone else cry on page 200?',
        imagen: renataLibros,
        descripcionImagen: 'Stack of books by a window',
        comentarios: 41,
        likes: 289,
    },
    {
        id: 4,
        usuario: '@sara.estudia',
        meta: 'Study Community · 9h ago',
        tema: 'Study',
        texto: 'Online study session on Tuesdays at 7pm. Camera optional, company guaranteed.',
        imagen: saraEstudia,
        descripcionImagen: 'Desk with a notebook and coffee',
        comentarios: 28,
        likes: 512,
    },
    {
        id: 5,
        usuario: '@juli.mamis',
        meta: 'Weekly meetup · 1d ago',
        tema: 'Motherhood',
        texto: "We took the little ones to the park on 12th. There's shade, clean restrooms, and other moms nearby.",
        imagen: juliMamis,
        descripcionImagen: 'Playground in the morning',
        comentarios: 77,
        likes: 604,
    },
    {
        id: 6,
        usuario: '@nina.taller',
        meta: 'Verified creator · 2d ago',
        tema: 'Creativity',
        texto: "I opened spots for Saturday's ceramics workshop. Small space, only eight spots.",
        imagen: ninaTaller,
        descripcionImagen: 'Hands shaping ceramics',
        comentarios: 33,
        likes: 356,
    },
    {
        id: 7,
        usuario: '@lina.camina',
        meta: 'Wellness Community · 3d ago',
        tema: 'Wellness',
        texto: 'Sunday walk in the park at 8am. We go slow, we talk, and nobody walks alone.',
        imagen: parque,
        descripcionImagen: 'Green park with tall trees',
        comentarios: 24,
        likes: 198,
    },
    {
        id: 8,
        usuario: '@sofi.lee',
        meta: 'Book club · 4d ago',
        tema: 'Reading',
        texto: 'This month\'s book is short and sweet. Perfect if you want to start reading again.',
        imagen: libroAnimado,
        descripcionImagen: 'Illustrated book cover',
        comentarios: 18,
        likes: 143,
    },
    {
        id: 9,
        usuario: '@cafe.calma',
        meta: 'Safe place · 5d ago',
        tema: 'Places',
        texto: 'Quiet café with big tables and staff who know the network. Open until 10pm.',
        imagen: cafeCalma,
        descripcionImagen: 'Cup of coffee on a table',
        comentarios: 31,
        likes: 267,
    },
];

// colecciones de la semana (las 3 tarjetas de colores)
export const coleccionesSemana = [
    { titulo: 'Safe routes', texto: '48 places verified by users', color: 'rosa-claro' },
    { titulo: 'Read together', texto: '12 active clubs this month', color: 'rosa' },
    { titulo: 'Voices that support you', texto: 'Stories of care and mental health', color: 'oscura' },
] as const;