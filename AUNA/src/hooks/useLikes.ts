import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// custom hook: los likes de la tabla likes
// liked = los posts a los que esta cuenta le dio like
// counts = cuántos likes tiene cada post (todas pueden ver los likes para contarlos)
function useLikes(session: string) {
    const [liked, setLiked] = useState<string[]>([]);

    // objeto { idDelPost: númeroDeLikes }
    const [counts, setCounts] = useState<Record<string, number>>({});

    // id de la cuenta con sesión ("" si no hay nadie)
    const [userId, setUserId] = useState('');

    useEffect(() => {
        let active = true;

        async function load() {
            const { data } = await supabase.auth.getUser();
            const user = data.user;

            // todos los likes: con ellos se cuenta cada post
            const { data: rows } = await supabase.from('likes').select('post_id, user_id');
            if (!active) return;

            const newCounts: Record<string, number> = {};
            const mine: string[] = [];
            for (const row of rows ?? []) {
                // suma 1 al post de esta fila (si no tenía, empieza en 0)
                newCounts[row.post_id] = (newCounts[row.post_id] ?? 0) + 1;
                // si el like es de esta cuenta, el corazón sale lleno
                if (user && row.user_id === user.id) mine.push(row.post_id);
            }

            setCounts(newCounts);
            setLiked(mine);
            setUserId(user ? user.id : '');
        }

        load();

        // limpieza: ignora la respuesta si la sesión cambió
        return () => { active = false; };
    }, [session]);

    // Like: si ya tenía like lo quita; si no, lo pone
    // devuelve false si no hay sesión (para mandar al Login)
    async function toggleLike(id: string) {
        if (userId === '') return false;

        const current = counts[id] ?? 0;

        if (liked.includes(id)) {
            // primero cambia la pantalla y después la base de datos
            setLiked(liked.filter((item) => item !== id));
            setCounts({ ...counts, [id]: current - 1 });
            const { error } = await supabase.from('likes').delete().eq('user_id', userId).eq('post_id', id);
            // si falla, vuelve a como estaba
            if (error) { setLiked(liked); setCounts(counts); }
        } else {
            setLiked([...liked, id]);
            setCounts({ ...counts, [id]: current + 1 });
            const { error } = await supabase.from('likes').insert({ user_id: userId, post_id: id });
            if (error) { setLiked(liked); setCounts(counts); }
        }
        return true;
    }

    return { liked, counts, toggleLike };
}

export default useLikes;
