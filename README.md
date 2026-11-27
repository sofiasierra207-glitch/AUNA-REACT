# AÚNA

AÚNA is a safe social network for women. You can share posts, find verified professionals and safe places, save what helps you, and ask the community for help.

**Live site:** https://auna-react.onrender.com

Final project for *Diseño con Algoritmos* (Universidad Icesi, 2026-2) by Ana Sofía Sierra and Camila Martínez.


## What you can do

- Sign up with a unique username and log in
- Edit your profile: name, username, bio and photo
- Create posts with a photo
- Search posts by topic or word
- Like, comment and save posts (saved posts appear in Favorites)
- See new posts appear without reloading the page
- Ask the community for help


## Built with

React, TypeScript and Vite, with React Router for the pages. Supabase stores the users, posts, likes, comments, saved posts and photos, and sends new posts in real time. The site is published on Render.


## How to run it

1. Go to the app folder and install the packages:

   ```bash
   cd AUNA
   npm install
   ```

2. Create a file called `.env` inside `AUNA/` with the Supabase keys:

   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-publishable-key
   ```

3. Start the app and open http://localhost:5173

   ```bash
   npm run dev
   ```


## Folders

- `AUNA/src/pages` – one folder per page (Home, Explore, Community, Favorites, Help, Login, 404)
- `AUNA/src/components` – reusable pieces and modals
- `AUNA/src/hooks` – custom hooks (profile, posts, likes, comments, saved posts)
- `AUNA/src/supabaseClient.ts` – the connection to Supabase


## Team

- **Ana Sofía Sierra** – Home, Community, Help, Login, layout, profile, likes, saved posts and deploy
- **Camila Martínez** – Explore, Favorites, modals, database setup, posts, comments and real time
