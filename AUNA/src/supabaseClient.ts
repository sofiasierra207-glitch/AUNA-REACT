import { createClient } from '@supabase/supabase-js';

// Lee la URL y la llave anon del archivo .env.local (no se suben a GitHub)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si falta alguna, avisa en vez de fallar sin explicación
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env.local");
}

// Cliente de Supabase: con él se hacen el login, las consultas y las subidas de fotos
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
