import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Forma de una fila de la tabla comments, con el usuario de quien comentó
// profiles viene de la FK user_id → profiles.id
export interface CommentRow {
    id: string;
    content: string;
    profiles: {
        username: string;
    } | null;
}

// Columnas que pido: las del comentario y el @usuario de su autora
const commentColumns = "id, content, profiles!comments_user_id_fkey ( username )";

// Custom hook: los comentarios de un post (tabla comments)
// Lo usan FeedCard (Home) y PostCard (Explore), así no repiten el código
function useComments(postId: string) {
    const [comments, setComments] = useState<CommentRow[]>([]);

    // Al mostrar la tarjeta, pide los comentarios de su post (los más viejos primero)
    useEffect(() => {
        let active = true;

        async function loadComments() {
            const { data, error } = await supabase
                .from('comments')
                .select(commentColumns)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (!active) return;

            if (error) {
                console.error('Error loading comments:', error);
            } else {
                setComments(data as unknown as CommentRow[]);
            }
        }

        loadComments();

        // Limpieza: si la tarjeta se quita antes de que lleguen, no actualiza el estado
        return () => {
            active = false;
        };
    }, [postId]);

    // Guarda un comentario nuevo en la tabla comments
    // Devuelve "login" si no hay sesión, un mensaje si falla, o "" si salió bien
    async function addComment(text: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return "login";

        // RLS: solo deja crear comentarios con el user_id de quien inició sesión
        const { data, error } = await supabase
            .from('comments')
            .insert({ post_id: postId, user_id: userData.user.id, content: text })
            .select(commentColumns)
            .single();

        if (error) {
            console.error('Error creating comment:', error);
            return "We couldn't send your comment. Try again.";
        }

        // Lo agrega al final de la lista (sin volver a pedir todo)
        setComments((prev) => [...prev, data as unknown as CommentRow]);
        return "";
    }

    return { comments, addComment };
}

export default useComments;
