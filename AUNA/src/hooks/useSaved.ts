import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// custom hook: los posts guardados de la usuaria, en la tabla saved_posts
// cada cuenta tiene sus propios guardados (RLS: solo la dueña los ve)
// se vuelven a pedir cada vez que cambia la sesión
function useSaved(session: string) {
    // ids de los posts guardados (texto, porque los posts usan uuid)
    const [saved, setSaved] = useState<string[]>([]);

    // id de la cuenta con sesión ("" si no hay nadie)
    const [userId, setUserId] = useState('');

    useEffect(() => {
        // si la sesión cambia antes de que llegue la respuesta, no la uso
        let active = true;

        async function load() {
            const { data } = await supabase.auth.getUser();
            const user = data.user;

            if (!user) {
                if (active) {
                    setSaved([]);
                    setUserId('');
                }
                return;
            }

            // sus filas de saved_posts; map se queda solo con el id del post
            const { data: rows } = await supabase.from('saved_posts').select('post_id').eq('user_id', user.id);

            if (active) {
                setUserId(user.id);
                setSaved(rows ? rows.map((row) => row.post_id) : []);
            }
        }

        load();

        // limpieza: ignora la respuesta si la sesión cambió
        return () => { active = false; };
    }, [session]);

    // Save: si ya estaba guardado lo borra de la tabla; si no, lo agrega
    // devuelve false si no hay sesión (para mandar al Login)
    async function toggleSave(id: string) {
        if (userId === '') return false;

        if (saved.includes(id)) {
            // primero cambia la pantalla y después la base de datos (se siente más rápido)
            setSaved(saved.filter((item) => item !== id));
            const { error } = await supabase.from('saved_posts').delete().eq('user_id', userId).eq('post_id', id);
            // si falla, vuelve a como estaba
            if (error) setSaved(saved);
        } else {
            setSaved([...saved, id]);
            const { error } = await supabase.from('saved_posts').insert({ user_id: userId, post_id: id });
            if (error) setSaved(saved);
        }
        return true;
    }

    return { saved, toggleSave };
}

export default useSaved;
