import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedCard.css';

import useComments from '../../hooks/useComments';
import type { Post } from '../../pages/index/data';
import commentIcon from '../../assets/icons/comment.svg';
import heartIcon from '../../assets/icons/heart.svg';
import heartFilledIcon from '../../assets/icons/heart-filled.svg';
import saveIcon from '../../assets/icons/save.svg';
import saveFilledIcon from '../../assets/icons/save-filled.svg';

// Datos que recibe la tarjeta
// saved, liked y sus funciones vienen del estado global de App (pasan por el Home)
// y App los guarda en Supabase (tablas saved_posts y likes)
interface FeedCardProps {
    post: Post;
    saved: boolean;      // ¿este post está guardado?
    onSave: () => void;  // guarda o quita el post
    liked: boolean;      // ¿le di like?
    likes: number;       // cuántos likes tiene (contados en la tabla likes)
    onLike: () => void;  // pone o quita el like
}

// Tarjeta de un post del feed del Home
function FeedCard({ post, saved, onSave, liked, likes, onLike }: FeedCardProps) {

    // Comentarios de este post (tabla comments, con el custom hook useComments)
    const { comments, addComment } = useComments(post.id);

    // Estados que solo le importan a la tarjeta
    const [commentOpen, setCommentOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");
    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    // Send: guarda el comentario en Supabase si hay texto
    async function handleSend() {
        if (commentText.trim() === "" || sending) return;

        setSending(true);
        const result = await addComment(commentText.trim());
        setSending(false);

        // Sin sesión: lleva al Login (igual que el like y el guardar)
        if (result === "login") {
            navigate("/login");
        } else if (result !== "") {
            setCommentError(result);
        } else {
            setCommentText("");
            setCommentError("");
        }
    }

    return (
        <article className="post-card">
            <img src={post.image} alt={post.imageAlt} />

            <div className="post-content">

                <div className="post-user">
                    <span className="user-avatar">{post.initial}</span>
                    <div>
                        <strong>{post.user}</strong>
                        <p className="post-meta">{post.role} · {post.time}</p>
                    </div>
                </div>

                <span className="post-tag">{post.tag}</span>

                <p className="post-text">{post.text}</p>

                <div className="post-interactions">

                    {/* Abre o cierra la caja de comentario */}
                    <button type="button" className="action-button comment-button" aria-label="Comment"
                        onClick={() => setCommentOpen(!commentOpen)}>
                        <img src={commentIcon} alt="" />
                        <span className="comment-count">{comments.length}</span>
                    </button>

                    {/* Like */}
                    <button type="button" className={liked ? "action-button like-button liked" : "action-button like-button"}
                        aria-label="Like" onClick={onLike}>
                        <img src={liked ? heartFilledIcon : heartIcon} alt="" className="like-icon" />
                        <span className="like-count">{likes}</span>
                    </button>

                    {/* Guardar */}
                    <button type="button" className={saved ? "action-button save-button saved" : "action-button save-button"}
                        onClick={onSave}>
                        <img src={saved ? saveFilledIcon : saveIcon} alt="" className="save-icon" />
                        <span className="save-text">{saved ? "Saved" : "Save"}</span>
                    </button>

                </div>

                {/* Comentarios guardados: se ven al abrir la caja */}
                {commentOpen && comments.length > 0 && (
                    <ul className="comment-list">
                        {comments.map((item) => (
                            <li key={item.id}>
                                <strong>{item.profiles ? item.profiles.username : "@auna"}</strong> {item.content}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Caja para comentar (Enter también envía) */}
                <div className={commentOpen ? "comment-box open" : "comment-box"}>
                    <input type="text" placeholder="Write a comment..." aria-label="Write a comment"
                        maxLength={300} value={commentText}
                        onChange={(event) => { setCommentText(event.target.value); setCommentError(""); }}
                        onKeyDown={(event) => { if (event.key === "Enter") handleSend(); }} />
                    <button type="button" className="send-button" onClick={handleSend} disabled={sending}>
                        {sending ? "..." : "Send"}
                    </button>
                </div>
                {commentError !== "" && <p className="comment-error">{commentError}</p>}

            </div>
        </article>
    );
}

export default FeedCard;
