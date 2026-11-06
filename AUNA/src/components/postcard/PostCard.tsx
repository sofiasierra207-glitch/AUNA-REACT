import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Post } from '../../pages/explore/data';
import iconoComentario from '../../assets/icons/comment.svg';
import iconoCorazon from '../../assets/icons/heart.svg';
import iconoCorazonLleno from '../../assets/icons/heart-filled.svg';
import iconoGuardar from '../../assets/icons/save.svg';
import iconoGuardarLleno from '../../assets/icons/save-filled.svg';
import './PostCard.css';

// tipado de las props
// el padre (Explore) me dice si el post tiene like o esta guardado
// y me pasa las funciones para cambiarlo, porque esos datos los guarda el en localStorage
interface PostCardProps {
    post: Post;
    tieneLike: boolean;
    estaGuardado: boolean;
    onLike: (id: number) => void;
    onGuardar: (id: number) => void;
}

// tarjeta de una publicacion de explore
// en js la armaba pieza por pieza con createElement, ahora es JSX
function PostCard({ post, tieneLike, estaGuardado, onLike, onGuardar }: PostCardProps) {
    // estados que solo le importan a esta tarjeta
    const [comentarios, setComentarios] = useState(post.comentarios); // numero de comentarios
    const [cajaAbierta, setCajaAbierta] = useState(false);            // caja de comentar abierta o no
    const [comentario, setComentario] = useState('');                 // lo que escribo en la caja

    // si tiene like le sumo 1 al numero
    const totalLikes = tieneLike ? post.likes + 1 : post.likes;

    // circulo con la inicial: charAt(1) porque la posicion 0 es el @
    const inicial = post.usuario.charAt(1).toUpperCase();

    // cuando envio el comentario (click en Send o Enter)
    function enviarComentario(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue

        // si no escribi nada no lo envio
        if (comentario.trim() === '') return;

        // le sumo 1 a los comentarios, limpio el input y cierro la caja
        setComentarios(comentarios + 1);
        setComentario('');
        setCajaAbierta(false);
    }

    return (
        <article className="post">
            <img className="post-portada" src={post.imagen} alt={post.descripcionImagen} />

            <div className="post-cuerpo">
                <div className="post-autora">
                    <div className="avatar">{inicial}</div>
                    <div>
                        <p className="post-usuario">{post.usuario}</p>
                        <p className="post-meta">{post.meta}</p>
                    </div>
                </div>

                <span className="post-tag">{post.tema}</span>

                <p className="post-texto">{post.texto}</p>

                <div className="post-acciones">
                    <div className="post-metricas">
                        {/* el icono de comentarios abre o cierra la caja (!cajaAbierta la invierte) */}
                        <button
                            type="button"
                            className="post-accion btn-comentar"
                            onClick={() => setCajaAbierta(!cajaAbierta)}
                        >
                            <img src={iconoComentario} alt="Comments" /> {comentarios}
                        </button>

                        {/* si tiene like uso el corazon lleno y la clase activo (rosado) */}
                        <button
                            type="button"
                            className={`post-accion btn-like ${tieneLike ? 'activo' : ''}`}
                            onClick={() => onLike(post.id)}
                        >
                            <img src={tieneLike ? iconoCorazonLleno : iconoCorazon} alt="Like" /> {totalLikes}
                        </button>
                    </div>

                    {/* lo que guardo aqui aparece despues en Favorites */}
                    <button
                        type="button"
                        className={`post-accion btn-guardar ${estaGuardado ? 'activo' : ''}`}
                        onClick={() => onGuardar(post.id)}
                    >
                        <img src={estaGuardado ? iconoGuardarLleno : iconoGuardar} alt="" />
                        {estaGuardado ? 'Saved' : 'Save'}
                    </button>
                </div>

                {/* la caja de comentar solo se muestra si cajaAbierta es true */}
                {cajaAbierta && (
                    <form className="caja-comentario" onSubmit={enviarComentario}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={comentario}
                            onChange={(evento) => setComentario(evento.target.value)}
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