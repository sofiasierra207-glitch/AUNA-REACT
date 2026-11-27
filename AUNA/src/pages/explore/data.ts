// datos de explore: los filtros, la forma de un post y las colecciones
// las publicaciones ya no estan aqui: vienen de la tabla posts de Supabase (usePosts)

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
    id: string;               // texto que identifica cada post (en Supabase es un uuid)
    user: string;
    meta: string;
    topic: string;             // tiene que ser igual al valor de un filtro
    text: string;
    image: string;
    imageAlt: string; // lo uso como alt de la imagen
    likes: number;    // cuantos likes tiene (contados en la tabla likes)
}

// colecciones de la semana (las 3 tarjetas de colores)
export const weeklyCollections = [
    { title: 'Safe routes', text: '48 places verified by users', color: 'rosa-claro' },
    { title: 'Read together', text: '12 active clubs this month', color: 'rosa' },
    { title: 'Voices that support you', text: 'Stories of care and mental health', color: 'oscura' },
] as const;