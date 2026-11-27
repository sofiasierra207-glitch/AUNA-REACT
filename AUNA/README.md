# AÚNA (app)

This folder is the React + TypeScript app of AÚNA, built with Vite.

**Live site:** https://auna-react.onrender.com

The full documentation (features, database, deploy and team) is in the [main README](../README.md).


## How to run it

1. Install the packages:

   ```bash
   npm install
   ```

2. Create a `.env` file in this folder with the Supabase keys:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-key
   ```

3. Start the app and open http://localhost:5173:

   ```bash
   npm run dev
   ```

Other commands:

- `npm run build`: checks the types and builds the project into `dist/`
- `npm run lint`: checks the code with ESLint
