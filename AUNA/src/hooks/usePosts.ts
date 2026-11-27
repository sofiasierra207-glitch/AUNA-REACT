import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { PostRow } from '../pages/index/data';

// Columnas que pido a Supabase: las del post y, por la FK, los datos de la autora en profiles
// posts y profiles también se conectan por likes, saved_posts y comments,
// por eso digo cuál FK usar: posts_user_id_fkey (la de la autora del post)
export const postColumns = "id, content, topic, image_url, image_alt, created_at, profiles!posts_user_id_fkey ( username, full_name, role )";

// Convierte la fecha del post en "Just now", "5m ago", "2h ago" o "3d ago"
export function timeAgo(date: string) {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return minutes + "m ago";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    return Math.floor(hours / 24) + "d ago";
}

// Custom hook: pide los posts de la tabla posts (los más nuevos primero)
// Lo usan el Home y Explore, así no repiten el mismo código
function usePosts() {
    const [rows, setRows] = useState<PostRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Si la usuaria sale de la página antes de que lleguen, no actualiza el estado
        let active = true;

        async function loadPosts() {
            const { data, error } = await supabase
                .from('posts')
                .select(postColumns)
                .order('created_at', { ascending: false });

            if (!active) return;

            if (error) {
                console.error('Error loading posts:', error);
                setError("We couldn't load the posts. Try again later.");
            } else {
                setRows(data as unknown as PostRow[]);
            }
            setLoading(false);
        }

        loadPosts();

        // Limpieza: se ejecuta cuando la página se cierra
        return () => {
            active = false;
        };
    }, []);

    // Pone un post recién publicado de primero, sin volver a pedir toda la lista
    function addRow(row: PostRow) {
        setRows([row, ...rows]);
    }

    return { rows, loading, error, addRow };
}

export default usePosts;
