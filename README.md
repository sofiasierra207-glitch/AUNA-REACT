# AÚNA

AÚNA is a safe, verified social network for women. Users can share experiences, find verified professionals and safe places, save what helps them, and ask the community for help.

**Live site:** https://auna-react.onrender.com
**Design (Figma):** https://www.figma.com/design/xrh7kDiGHsQcATivayAOBl/A%C3%9ANA

Final project for *Diseño con Algoritmos* (Universidad Icesi, 2026-2), by Ana Sofía Sierra and Camila Martínez.


## How the project grew

| Delivery | What we built |
|---|---|
| 1 and 2 | The website in HTML, CSS and JavaScript |
| 3 | The same website rebuilt with **React + TypeScript**, one component per piece |
| Final | A real backend with **Supabase** (database, accounts, security and photos) and a public deploy on **Render** |


## Features

- [x] Sign up with a unique username (like Instagram), with Supabase Auth
- [x] Log in: only real accounts with the right password can enter
- [x] Log out (closes the session in the app and in Supabase)
- [x] Each account sees its own profile (name, username, bio, photo, posts and saved counts)
- [x] Edit profile: name, username, bio and profile photo (uploaded to Supabase Storage)
- [x] Change email or password safely (asks for the current password first)
- [x] Main panel, Explore, Community, Favorites and AÚNA Help
- [x] 404 page for addresses that do not exist
- [ ] Create posts with a photo, saved in the database
- [ ] Search posts from the database
- [ ] Likes, saved posts and comments in the database, in real time


## Technologies

- **React 19** with **TypeScript** and **Vite**
- **React Router** for pages and navigation
- **Supabase**: PostgreSQL database, Auth, Row Level Security, Storage and Realtime
- **Render** to publish the site (auto-deploy from GitHub)
- **CSS**: one file per page and per component; colors in `src/assets/colors.css`
- **ESLint**, **Git** and **GitHub**


## How to run it

You need Node.js installed.

1. Install the packages:

   ```bash
   cd AUNA
   npm install
   ```

2. Create a file called `.env` inside `AUNA/` with the Supabase keys (Supabase → Project Settings → API Keys):

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-key
   ```

   This file is in `.gitignore`, so it never goes to GitHub. Only the **publishable** key goes here, never the secret one.

3. Start the app:

   ```bash
   npm run dev
   ```

   Then open http://localhost:5173

Other commands:

- `npm run build`: checks the types and builds the project into `dist/`
- `npm run lint`: checks the code with ESLint


## Project structure

```
AUNA/src/
├── assets/            images, icons, fonts and the color palette
├── components/        reusable pieces and modals (one folder each, with its CSS)
├── hooks/
│   ├── useLocalStorage.ts   useState that also saves in the browser
│   └── useProfile.ts        loads the signed-in user's profile from Supabase
├── pages/             index (Home), explore, community, favorites, help, login, notfound
├── supabaseClient.ts  connection to Supabase (reads the .env keys)
├── App.tsx            routes and global state (session and saved posts)
└── main.tsx           starts the app with BrowserRouter
```

**Global state:** `App.tsx` keeps the session and the saved posts, and passes them down with props, so every page shares the same data.


## Database (Supabase)

Five tables connected with primary keys (PK) and foreign keys (FK). Email and password live in Supabase Auth (`auth.users`), never in our tables.

| Table | Main columns | Who can do what (RLS) |
|---|---|---|
| `profiles` | `id` (PK, FK → `auth.users`), `username` (unique), `full_name`, `city`, `role`, `bio`, `avatar_url` | Everyone reads · each user edits only her own row |
| `posts` | `id` (PK), `user_id` (FK → `profiles`), `content` (1–500), `topic`, `image_url`, `image_alt` | Everyone reads · only the author writes |
| `comments` | `id` (PK), `post_id` (FK → `posts`), `user_id` (FK → `profiles`), `content` (1–300) | Everyone reads · only the author writes |
| `likes` | `user_id` + `post_id` (composite PK) | Everyone reads · only the owner writes |
| `saved_posts` | `user_id` + `post_id` (composite PK) | Private: only the owner reads and writes |

All foreign keys use **cascade**: deleting a post deletes its comments, likes and saves.

**Storage:** two public buckets, `post-images` and `avatars`. Each user can only upload into her own folder (`user-id/photo.png`).


## Deploy

The site is a **Static Site on Render**:

| Setting | Value |
|---|---|
| Root directory | `AUNA` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Rewrite rule | `/*` → `/index.html` (so React Router handles every page) |

Every merge to the deploy branch publishes a new version automatically.


## How we work with Git

- Each page or component has its own branch (`feature/login`, `feature/profile`...).
- Every change goes through a pull request to `develop`; `main` only receives `develop` when a delivery is ready.
- Commits follow Conventional Commits in English (`feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`), one small commit per file.


## Team

| | Ana Sofía Sierra | Camila Martínez |
|---|---|---|
| Pages | Home, Community, Help, Login | Explore, Favorites |
| Layout | Header, BottomNav, Footer, MainLayout, React Router | — |
| Components | FeedCard, CircleCard, ProfessionalCard, ResourceCard | PostCard, CollectionCard, SavedCard |
| Modals | Posted, Profile, Language | Search, Verified, CommunityHelp, ForgotPassword, CreateProfile, Configuration, MiniProfile |
| State and hooks | Global state in App, `useProfile` | `useLocalStorage` |
| Supabase | Log in and sign up with Auth, unique usernames, real profile, Edit profile, Render deploy | Tables, RLS policies, Storage buckets, Realtime, posts |
