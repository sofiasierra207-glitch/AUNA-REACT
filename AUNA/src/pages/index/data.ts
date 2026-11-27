// Forma que tiene cada post en una tarjeta del Home (FeedCard)
// los likes y comentarios no van aquí: vienen de sus tablas en Supabase
export interface Post {
    id: string;           // texto que identifica el post (en Supabase es un uuid; los guardados usan este id)
    user: string;
    initial: string;
    role: string;
    time: string;
    tag: string;
    text: string;
    image: string;
    imageAlt: string;
}

// Forma de una fila de la tabla posts de Supabase
// profiles viene de la relación (FK user_id → profiles.id): la autora del post
export interface PostRow {
    id: string;
    content: string;
    topic: string;
    image_url: string | null;
    image_alt: string | null;
    created_at: string;
    profiles: {
        username: string;
        full_name: string;
        role: string;
    } | null;
}

// Forma que tiene cada lugar de AÚNA Help
export interface Resource {
    initial: string;
    name: string;
    details: string;
}

// Lugares cercanos de AÚNA Help
export const resources: Resource[] = [
    {
        initial: "C",
        name: "Rosa Health Center",
        details: "400m away · Open now"
    },
    {
        initial: "F",
        name: "La Aurora Pharmacy",
        details: "250m away · Open 24h"
    },
    {
        initial: "C",
        name: "Calm Café",
        details: "650m away · Open until 10:00 PM"
    }
];
