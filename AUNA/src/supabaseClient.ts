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

// Crea la fila de la usuaria en la tabla profiles si todavía no existe
// Se llama cuando ya hay sesión, porque RLS solo deja crear el perfil propio
export async function createProfileIfMissing() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;

    // ¿Ya tiene perfil?
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
    if (profile) return;

    // Los datos del registro quedaron guardados en Auth (user_metadata)
    const email = user.email ?? '';
    await supabase.from('profiles').insert({
        id: user.id,
        username: '@' + email.split('@')[0],
        full_name: user.user_metadata.full_name ?? '',
        city: user.user_metadata.city ?? ''
    });
}
