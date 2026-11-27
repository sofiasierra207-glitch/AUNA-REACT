import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../pages/explore/data';
import useComments from '../../hooks/useComments';
import commentIcon from '../../assets/icons/comment.svg';
import heartIcon from '../../assets/icons/heart.svg';
import heartFilledIcon from '../../assets/icons/heart-filled.svg';
import saveIcon from '../../assets/icons/save.svg';
import saveFilledIcon from '../../assets/icons/save-filled.svg';
import './PostCard.css';

// tipado de las props
// el padre (Explore) me dice si el post tiene like o esta guardado
// y me pasa las funciones para cambiarlo; esos datos los guarda App en Supabase
interface PostCardProps {
    post: Post;
    isLiked: boolean;
    isSaved: boolean;
    onLike: (id: string) => void;
    onSave: (id: string) => void;
}

// tarjeta de una publicacion de explore
// en js la armaba pieza por pieza con createElement, ahora es JSX
function PostCard({ post, isLiked, isSaved, onLike, onSave }: PostCardProps) {
    // comentarios de este post (tabla comments, con el custom hook useComments)
    const { comments, addComment } = useComments(post.id);

    // estados que solo le importan a esta tarjeta
    const [boxOpen, setBoxOpen] = useState(false);       // caja de comentar abierta o no
    const [comment, setComment] = useState('');          // lo que escribo en la caja
    const [commentError, setCommentError] = useState(''); // mensaje si no se pudo enviar
    const [sending, setSending] = useState(false);        // se esta guardando el comentario

    const navigate = useNavigate();

    // cuantos likes tiene: ya vienen contados de la tabla likes (incluye el mio)
    const totalLikes = post.likes;

    // circulo con la inicial: charAt(1) porque la posicion 0 es el @
    const initial = post.user.charAt(1).toUpperCase();

    // cuando envio el comentario (click en Send o Enter): lo guardo en Supabase
    async function sendComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue

        // si no escribi nada (o ya se esta enviando) no lo envio
        if (comment.trim() === '' || sending) return;

        setSending(true);
        const result = await addComment(comment.trim());
        setSending(false);

        // sin sesion: lleva al Login (igual que el like y el guardar)
        if (result === 'login') {
            navigate('/login');
        } else if (result !== '') {
            setCommentError(result);
        } else {
            setComment('');
            setCommentError('');
        }
    }

    return (
        <article className="post">
            <img className="post-portada" src={post.image} alt={post.imageAlt} />

            <div className="post-cuerpo">
                <div className="post-autora">
                    <div className="avatar">{initial}</div>
                    <div>
                        <p className="post-usuario">{post.user}</p>
                        <p className="post-meta">{post.meta}</p>
                    </div>
                </div>

                <span className="post-tag">{post.topic}</span>

                <p className="post-texto">{post.text}</p>

                <div className="post-acciones">
                    <div className="post-metricas">
                        {/* el icono de comentarios abre o cierra la caja (!boxOpen la invierte) */}
                        <button
                            type="button"
                            className="post-accion btn-comentar"
                            onClick={() => setBoxOpen(!boxOpen)}
                        >
                            <img src={commentIcon} alt="Comments" /> {comments.length}
                        </button>

                        {/* si tiene like uso el corazon lleno y la clase activo (rosado) */}
                        <button
                            type="button"
                            className={`post-accion btn-like ${isLiked ? 'activo' : ''}`}
                            onClick={() => onLike(post.id)}
                        >
                            <img src={isLiked ? heartFilledIcon : heartIcon} alt="Like" /> {totalLikes}
                        </button>
                    </div>

                    {/* lo que guardo aqui aparece despues en Favorites */}
                    <button
                        type="button"
                        className={`post-accion btn-guardar ${isSaved ? 'activo' : ''}`}
                        onClick={() => onSave(post.id)}
                    >
                        <img src={isSaved ? saveFilledIcon : saveIcon} alt="" />
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>

                {/* los comentarios guardados se ven al abrir la caja */}
                {boxOpen && comments.length > 0 && (
                    <ul className="lista-comentarios">
                        {comments.map((item) => (
                            <li key={item.id}>
                                <strong>{item.profiles ? item.profiles.username : '@auna'}</strong> {item.content}
                            </li>
                        ))}
                    </ul>
                )}

                {/* la caja de comentar solo se muestra si boxOpen es true */}
                {boxOpen && (
                    <form className="caja-comentario" onSubmit={sendComment}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            maxLength={300}
                            value={comment}
                            onChange={(event) => { setComment(event.target.value); setCommentError(''); }}
                            autoFocus
                        />
                        <button type="submit" className="btn-enviar" disabled={sending}>
                            {sending ? '...' : 'Send'}
                        </button>
                    </form>
                )}
                {commentError !== '' && <p className="comentario-error">{commentError}</p>}
            </div>
        </article>
    );
}

export default PostCard;