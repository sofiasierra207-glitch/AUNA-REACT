// datos de prueba de explore: las publicaciones que salen en la pagina
// los separe en este archivo para que explore.js quede solo con la logica
// explore.html carga este archivo antes de explore.js, asi explore.js ya puede usar el array
// aqui guardo todas las publicaciones en un array de objetos
// cada objeto es una publicacion con sus datos
// con esta lista creo las tarjetas desde el js y no las escribo una por una en el html
const publicaciones = [
    {
        id: 1,                         // numero para identificar cada post
        usuario: "@ana.rutas",
        meta: "Places Community · 1h ago",
        tema: "Places",                // tiene que ser igual al data-tema del filtro
        texto: "Map of lit bike paths in the north. We built it together — add yours.",
        imagen: "../../assets/images/ana-rutas.png",
        descripcionImagen: "Lit bike path at sunset",  // lo uso como alt de la imagen
        comentarios: 62,
        likes: 418
    },
    {
        id: 2,
        usuario: "@dani.mindful",
        meta: "Verified creator · 3h ago",
        tema: "Wellness",
        texto: "Three breaths to calm anxiety before an interview. They even work for me on the bus.",
        imagen: "../../assets/images/dani-mindful.png",
        descripcionImagen: "Hands holding a warm cup",
        comentarios: 95,
        likes: 733
    },
    {
        id: 3,
        usuario: "@renata.libros",
        meta: "Book club · 6h ago",
        tema: "Reading",
        texto: "We finished chapter five and still have questions. Did anyone else cry on page 200?",
        imagen: "../../assets/images/renata-libros.png",
        descripcionImagen: "Stack of books by a window",
        comentarios: 41,
        likes: 289
    },
    {
        id: 4,
        usuario: "@sara.estudia",
        meta: "Study Community · 9h ago",
        tema: "Study",
        texto: "Online study session on Tuesdays at 7pm. Camera optional, company guaranteed.",
        imagen: "../../assets/images/sara-estudia.png",
        descripcionImagen: "Desk with a notebook and coffee",
        comentarios: 28,
        likes: 512
    },
    {
        id: 5,
        usuario: "@juli.mamis",
        meta: "Weekly meetup · 1d ago",
        tema: "Motherhood",
        texto: "We took the little ones to the park on 12th. There's shade, clean restrooms, and other moms nearby.",
        imagen: "../../assets/images/juli-mamis.png",
        descripcionImagen: "Playground in the morning",
        comentarios: 77,
        likes: 604
    },
    {
        id: 6,
        usuario: "@nina.taller",
        meta: "Verified creator · 2d ago",
        tema: "Creativity",
        texto: "I opened spots for Saturday's ceramics workshop. Small space, only eight spots.",
        imagen: "../../assets/images/nina-taller.png",
        descripcionImagen: "Hands shaping ceramics",
        comentarios: 33,
        likes: 356
    }
];