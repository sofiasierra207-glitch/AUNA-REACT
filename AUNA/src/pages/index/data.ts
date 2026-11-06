// Fotos de los posts
import flores from '../../assets/images/flores.png'
import arboles from '../../assets/images/arboles.png'
import doscafes from '../../assets/images/doscafes.png'
import sala from '../../assets/images/sala.png'
import amigashablando from '../../assets/images/amigashablando.png'

// Forma que tiene cada post
export interface Post {
    user: string;
    initial: string;
    role: string;
    time: string;
    tag: string;
    text: string;
    image: string;
    imageAlt: string;
    comments: number;
    likes: number;
    liked: boolean;
    saved: boolean;
}

// Forma que tiene cada lugar de AÚNA Help
export interface Resource {
    initial: string;
    name: string;
    details: string;
}

// Usuaria con la sesión abierta (autora de los posts nuevos)
export const currentUser = {
    user: "@valen.torres",
    initial: "V",
    role: "Verified creator"
};

// Lista de posts del feed (cada post es un objeto)
export const posts: Post[] = [
    {
        user: "@mara.arte",
        initial: "M",
        role: "Verified creator",
        time: "2h ago",
        tag: "Creativity",
        text: "Sharing my illustration process this week. What colors would you use for the next series?",
        image: flores,
        imageAlt: "Colorful flowers illustration",
        comments: 48,
        likes: 312,
        liked: false,
        saved: false
    },
    {
        user: "@sofia.caminata",
        initial: "S",
        role: "Wellness Community",
        time: "5h ago",
        tag: "Wellness",
        text: "A 3km route through the central park, well lit and busy at all hours. Perfect for starting the day with peace of mind.",
        image: arboles,
        imageAlt: "Green park with tall trees",
        comments: 33,
        likes: 507,
        liked: false,
        saved: false
    },
    {
        user: "@valen.creativa",
        initial: "V",
        role: "Verified creator",
        time: "8h ago",
        tag: "Places",
        text: "Found this café with a big table to work alongside others. Another AÚNA user recommended it to me — that's how the network works.",
        image: doscafes,
        imageAlt: "Two coffee cups on a wooden table",
        comments: 19,
        likes: 244,
        liked: false,
        saved: false
    },
    {
        user: "@lucia.lee",
        initial: "L",
        role: "Book club",
        time: "1d ago",
        tag: "Reading",
        text: "My reading nook is finally ready. This month we're reading 'The House of the Spirits' together — there's room for everyone.",
        image: sala,
        imageAlt: "Cozy reading room with plants",
        comments: 74,
        likes: 631,
        liked: false,
        saved: false
    },
    {
        user: "@circulo.aúna",
        initial: "C",
        role: "Monthly meetup",
        time: "2d ago",
        tag: "Community",
        text: "Here's how this month's meetup went. Nothing like a shared table to remind us we're not alone.",
        image: amigashablando,
        imageAlt: "Friends talking around a table",
        comments: 121,
        likes: 892,
        liked: false,
        saved: false
    }
];

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
