// datos de prueba de favorites: los posts de explore y los guardados del figma
// los separe en este archivo para que favorites.js quede solo con la logica
// favorites.html carga este archivo antes de favorites.js
// aqui guardo las publicaciones de explore
// las necesito para saber cuales guardo el usuario con el boton "Save"
const postsExplore = [
    { id: 1, usuario: "@ana.rutas", texto: "Map of lit bike paths in the north. We built it together — add yours.", imagen: "../../assets/images/ana-rutas.png" },
    { id: 2, usuario: "@dani.mindful", texto: "Three breaths to calm anxiety before an interview.", imagen: "../../assets/images/dani-mindful.png" },
    { id: 3, usuario: "@renata.libros", texto: "We finished chapter five and still have questions. Did anyone else cry on page 200?", imagen: "../../assets/images/renata-libros.png" },
    { id: 4, usuario: "@sara.estudia", texto: "Online study session on Tuesdays at 7pm. Camera optional, company guaranteed.", imagen: "../../assets/images/sara-estudia.png" },
    { id: 5, usuario: "@juli.mamis", texto: "We took the little ones to the park on 12th. There's shade, clean restrooms, and other moms nearby.", imagen: "../../assets/images/juli-mamis.png" },
    { id: 6, usuario: "@nina.taller", texto: "I opened spots for Saturday's ceramics workshop. Small space, only eight spots.", imagen: "../../assets/images/nina-taller.png" }
];

// estos son los guardados que salen en el figma
// me sirve para filtrar con las tabs (Post, Place o Creator)
// idExplore es el id del post en explore (0 si no viene de explore)
const guardadosFigma = [
    {
        tipo: "Post",
        nombre: "@dani.mindful",
        texto: "Three breaths to calm anxiety before an interview.",
        imagen: "../../assets/images/dani-mindful.png",
        idExplore: 2
    },
    {
        tipo: "Place",
        nombre: "Calm Café",
        texto: "Safe spot in the network: you can wait here or ask to be accompanied.",
        imagen: "../../assets/images/cafe-calma.png",
        idExplore: 0
    },
    {
        tipo: "Creator",
        nombre: "@laura.psi",
        texto: "I support people through anxiety and grief. I post short exercises.",
        imagen: "../../assets/images/laura-psi.png",
        idExplore: 0
    }
];