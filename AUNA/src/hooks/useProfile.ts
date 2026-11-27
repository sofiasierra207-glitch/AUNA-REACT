import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Datos de una usuaria (una fila de la tabla profiles)
export interface ProfileData {
    id: string;
    username: string;
    full_name: string;
    city: string;
    role: string;
    bio: string | null;
    avatar_url: string | null;
}

// custom hook: trae el perfil de la usuaria con la sesión abierta
// y cuántos posts y guardados tiene (cada cuenta ve solo lo suyo)
// se vuelve a pedir cada vez que cambia la sesión
function useProfile(session: string) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [postCount, setPostCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);

    // cada vez que sube este número, el perfil se vuelve a pedir (después de editarlo)
    const [version, setVersion] = useState(0);

    useEffect(() => {
        // si se cierra la sesión mientras llega la respuesta, no la uso
        let active = true;

        async function load() {
            // ¿quién inició sesión?
            const { data } = await supabase.auth.getUser();
            const user = data.user;

            if (!user) {
                if (active) setProfile(null);
                return;
            }

            // su fila en profiles (el id es el mismo de la cuenta)
            const { data: row } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

            // count: 'exact' y head: true cuentan las filas sin traerlas
            const { count: posts } = await supabase.from('posts')
                .select('*', { count: 'exact', head: true }).eq('user_id', user.id);
            const { count: saved } = await supabase.from('saved_posts')
                .select('*', { count: 'exact', head: true }).eq('user_id', user.id);

            if (active) {
                setProfile(row);
                setPostCount(posts ?? 0);
                setSavedCount(saved ?? 0);
            }
        }

        load();

        // limpieza: si la sesión cambia antes de terminar, se ignora esta respuesta
        return () => { active = false; };
    }, [session, version]);

    // Edit profile la llama después de guardar para ver los cambios sin recargar
    function reload() {
        setVersion(version + 1);
    }

    return { profile, postCount, savedCount, reload };
}

export default useProfile;
