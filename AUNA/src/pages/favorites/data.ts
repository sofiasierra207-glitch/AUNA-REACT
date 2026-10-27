// datos de prueba de favorites
// los posts de explore ya no los copio aqui: Favorites los importa de explore/data.ts
// en react las imagenes se importan, asi Vite sabe que tiene que incluirlas
import cafeCalma from '../../assets/images/cafe-calma.png';
import daniMindful from '../../assets/images/dani-mindful.png';
import lauraPsi from '../../assets/images/laura-psi.png';

// un guardado puede ser un post, un lugar o una creadora
export type TipoGuardado = 'Post' | 'Place' | 'Creator';

// tipado de un guardado: asi typescript me avisa si me falta un dato
export interface Guardado {
    tipo: TipoGuardado;
    nombre: string;
    texto: string;
    imagen: string;
    idExplore: number; // id del post en explore (0 si no viene de explore)
}

// tabs para filtrar (el numero de cada una lo calculo en la pagina)
// valor es lo que comparo con el tipo y texto es lo que se ve en el boton
export const tabs: { valor: 'All' | TipoGuardado; texto: string }[] = [
    { valor: 'All', texto: 'All' },
    { valor: 'Post', texto: 'Posts' },
    { valor: 'Place', texto: 'Places' },
    { valor: 'Creator', texto: 'Creators' },
];

// mis colecciones: 2 filas de 3, como en el figma
export const misColecciones = [
    [
        { titulo: 'Safe routes', texto: '8 saved places', color: 'rosa-claro' },
        { titulo: 'For slow reading', texto: '12 posts', color: 'rosa' },
        { titulo: 'Shady places', texto: '5 spots close to home', color: 'rosa-claro' },
    ],
    [
        { titulo: 'Voices that support you', texto: '9 saved stories', color: 'oscura' },
        { titulo: 'Light recipes', texto: '6 posts', color: 'rosa-claro' },
        { titulo: 'Spaces near you', texto: '4 saved places', color: 'rosa' },
    ],
] as const;

// estos son los guardados que salen en el figma
// los posts que guardo en explore con el boton "Save" se agregan a estos
export const guardadosFigma: Guardado[] = [
    {
        tipo: 'Post',
        nombre: '@dani.mindful',
        texto: 'Three breaths to calm anxiety before an interview.',
        imagen: daniMindful,
        idExplore: 2,
    },
    {
        tipo: 'Place',
        nombre: 'Calm Café',
        texto: 'Safe spot in the network: you can wait here or ask to be accompanied.',
        imagen: cafeCalma,
        idExplore: 0,
    },
    {
        tipo: 'Creator',
        nombre: '@laura.psi',
        texto: 'I support people through anxiety and grief. I post short exercises.',
        imagen: lauraPsi,
        idExplore: 0,
    },
];