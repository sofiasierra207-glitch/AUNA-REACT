// Forma que tiene cada profesional
export interface Professional {
    name: string;
    user: string;
    initial: string;
    category: string;
    specialty: string;
    description: string;
    followers: number;
    replies: string;
}

// Forma que tiene cada círculo
export interface Circle {
    name: string;
    initial: string;
    description: string;
    members: number;
    privacy: string;
}

// Filtros por especialidad
export const categories = ["All", "Psychology", "Legal", "Health", "Finance", "Creativity"];

// Profesionales verificadas
export const professionals: Professional[] = [
    {
        name: "Laura Restrepo",
        user: "@laura.psi",
        initial: "L",
        category: "Psychology",
        specialty: "Psychology",
        description: "I support people through anxiety and grief. I post short exercises every week.",
        followers: 2400,
        replies: "Replies within 1 day"
    },
    {
        name: "Marcela Ávila",
        user: "@marce.legal",
        initial: "M",
        category: "Legal",
        specialty: "Legal advice",
        description: "I answer questions about filing complaints, rentals, and labor rights.",
        followers: 1800,
        replies: "Replies within 2 days"
    },
    {
        name: "Tatiana Ruiz",
        user: "@tati.entrena",
        initial: "T",
        category: "Health",
        specialty: "Movement",
        description: "Short routines to do at home, no equipment, no pressure to look a certain way.",
        followers: 5100,
        replies: "Replies within 3h"
    },
    {
        name: "Paula Gómez",
        user: "@paula.nutre",
        initial: "P",
        category: "Health",
        specialty: "Nutrition",
        description: "Real food, real portions. Menus for busy weeks.",
        followers: 3600,
        replies: "Replies within 1 day"
    },
    {
        name: "Camila Ortiz",
        user: "@cami.escribe",
        initial: "C",
        category: "Creativity",
        specialty: "Writing",
        description: "Workshops for saying out loud what's hard to say.",
        followers: 940,
        replies: "Replies within 5h"
    },
    {
        name: "Diana Peña",
        user: "@diana.finanzas",
        initial: "D",
        category: "Finance",
        specialty: "Finance",
        description: "Savings, debt, and starting a business explained in plain language.",
        followers: 2900,
        replies: "Replies within 2 days"
    }
];

// Círculos abiertos esta semana
export const circles: Circle[] = [
    {
        name: "Circle of Calm",
        initial: "C",
        description: "Tuesday meetups to talk about anxiety, no diagnoses required.",
        members: 312,
        privacy: "Moderated"
    },
    {
        name: "Read together",
        initial: "L",
        description: "One book a month and a video call to discuss it.",
        members: 188,
        privacy: "Open"
    },
    {
        name: "Real Motherhood",
        initial: "M",
        description: "We rotate hosts every week. No filters, no unsolicited advice.",
        members: 245,
        privacy: "Private"
    }
];
