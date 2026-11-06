import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Post } from '../../pages/explore/data';
import commentIcon from '../../assets/icons/comment.svg';
import heartIcon from '../../assets/icons/heart.svg';
import heartFilledIcon from '../../assets/icons/heart-filled.svg';
import saveIcon from '../../assets/icons/save.svg';
import saveFilledIcon from '../../assets/icons/save-filled.svg';
import './PostCard.css';

// tipado de las props
// el padre (Explore) me dice si el post tiene like o esta guardado
// y me pasa las funciones para cambiarlo, porque esos datos los guarda el en localStorage
interface PostCardProps {
    post: Post;
    isLiked: boolean;
    isSaved: boolean;
    onLike: (id: number) => void;
    onSave: (id: number) => void;
}

// tarjeta de una publicacion de explore
// en js la armaba pieza por pieza con createElement, ahora es JSX
function PostCard({ post, isLiked, isSaved, onLike, onSave }: PostCardProps) {
    // estados que solo le importan a esta tarjeta
    const [comments, setComments] = useState(post.comments); // numero de comentarios
    const [boxOpen, setBoxOpen] = useState(false);            // caja de comentar abierta o no
    const [comment, setComment] = useState('');                 // lo que escribo en la caja

    // si tiene like le sumo 1 al numero
    const totalLikes = isLiked ? post.likes + 1 : post.likes;

    // circulo con la inicial: charAt(1) porque la posicion 0 es el @
    const initial = post.user.charAt(1).toUpperCase();

    // cuando envio el comentario (click en Send o Enter)
    function sendComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue

        // si no escribi nada no lo envio
        if (comment.trim() === '') return;

        // le sumo 1 a los comentarios, limpio el input y cierro la caja
        setComments(comments + 1);
        setComment('');
        setBoxOpen(false);
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
                            <img src={commentIcon} alt="Comments" /> {comments}
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

                {/* la caja de comentar solo se muestra si boxOpen es true */}
                {boxOpen && (
                    <form className="caja-comentario" onSubmit={sendComment}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn-enviar">Send</button>
                    </form>
                )}
            </div>
        </article>
    );
}

export default PostCard;