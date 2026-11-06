# AÚNA

AÚNA is a safe, verified social network for women. Users can share experiences, find verified professionals and safe places, save what helps them, and ask the community for help.

This is the third delivery of the project: the same website from delivery 2 (HTML, CSS and JavaScript), rebuilt with **React + TypeScript** using components.


## How to run it

You need Node.js installed.

```bash
cd AUNA
npm install
npm run dev
```

Then open http://localhost:5173

Other commands:

- `npm run build` — checks the types and builds the project
- `npm run lint` — checks the code with ESLint


## Technologies

- React 19 with TypeScript
- Vite
- React Router (pages and navigation)
- CSS (one file per page and per component, colors in `src/assets/colors.css`)
- localStorage through the custom hook `useLocalStorage`


## Project structure

```
src/
├── assets/       images, icons, fonts and the color palette
├── components/   reusable pieces and modals (one folder each)
├── hooks/        custom hooks (useLocalStorage)
├── pages/        the 6 pages (index, explore, community, favorites, help, login)
├── App.tsx       routes and global state (session)
└── main.tsx      starts the app with BrowserRouter
```

**Global state:** `App.tsx` keeps the session with `useLocalStorage` and passes it down with props, so it is shared by every page and is not lost when the page reloads.