// datos de prueba de favorites
// los posts de explore ya no los copio aqui: Favorites los importa de explore/data.ts
// en react las imagenes se importan, asi Vite sabe que tiene que incluirlas
import cafeCalma from '../../assets/images/cafe-calma.png';
import daniMindful from '../../assets/images/dani-mindful.png';
import lauraPsi from '../../assets/images/laura-psi.png';

// un guardado puede ser un post, un lugar o una creadora
export type SavedType = 'Post' | 'Place' | 'Creator';

// tipado de un guardado: asi typescript me avisa si me falta un dato
export interface SavedItem {
    type: SavedType;
    name: string;
    text: string;
    image: string;
    exploreId: number; // id del post en explore (0 si no viene de explore)
}

// tabs para filtrar (el numero de cada una lo calculo en la pagina)
// value es lo que comparo con el type y text es lo que se ve en el boton
export const tabs: { value: 'All' | SavedType; text: string }[] = [
    { value: 'All', text: 'All' },
    { value: 'Post', text: 'Posts' },
    { value: 'Place', text: 'Places' },
    { value: 'Creator', text: 'Creators' },
];

// mis colecciones: 2 filas de 3, como en el figma
export const myCollections = [
    [
        { title: 'Safe routes', text: '8 saved places', color: 'rosa-claro' },
        { title: 'For slow reading', text: '12 posts', color: 'rosa' },
        { title: 'Shady places', text: '5 spots close to home', color: 'rosa-claro' },
    ],
    [
        { title: 'Voices that support you', text: '9 saved stories', color: 'oscura' },
        { title: 'Light recipes', text: '6 posts', color: 'rosa-claro' },
        { title: 'Spaces near you', text: '4 saved places', color: 'rosa' },
    ],
] as const;

// estos son los guardados que salen en el figma
// los posts que guardo en explore con el boton "Save" se agregan a estos
export const figmaSaved: SavedItem[] = [
    {
        type: 'Post',
        name: '@dani.mindful',
        text: 'Three breaths to calm anxiety before an interview.',
        image: daniMindful,
        exploreId: 2,
    },
    {
        type: 'Place',
        name: 'Calm Café',
        text: 'Safe spot in the network: you can wait here or ask to be accompanied.',
        image: cafeCalma,
        exploreId: 0,
    },
    {
        type: 'Creator',
        name: '@laura.psi',
        text: 'I support people through anxiety and grief. I post short exercises.',
        image: lauraPsi,
        exploreId: 0,
    },
];