import { useState } from 'react';
import './PostCard.css';

import type { Post } from '../../../pages/index/data';
import commentIcon from '../../../assets/icons/comment.svg';
import heartIcon from '../../../assets/icons/heart.svg';
import heartFilledIcon from '../../../assets/icons/heart-filled.svg';
import saveIcon from '../../../assets/icons/save.svg';
import saveFilledIcon from '../../../assets/icons/save-filled.svg';

// Datos que recibe la tarjeta
interface PostCardProps {
    post: Post;
}

// Tarjeta de un post del feed
function PostCard({ post }: PostCardProps) {

    // Estados de la tarjeta (como el contador de clase)
    const [liked, setLiked] = useState(post.liked);
    const [likes, setLikes] = useState(post.likes);
    const [saved, setSaved] = useState(post.saved);
    const [comments, setComments] = useState(post.comments);
    const [commentOpen, setCommentOpen] = useState(false);
    const [commentText, setCommentText] = useState("");

    // Like: pone o quita el like
    function handleLike() {
        if (liked) {
            setLiked(false);
            setLikes(likes - 1);
        } else {
            setLiked(true);
            setLikes(likes + 1);
        }
    }

    // Send: suma el comentario si hay texto
    function handleSend() {
        if (commentText.trim() !== "") {
            setComments(comments + 1);
            setCommentText("");
            setCommentOpen(false);
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
                        <span className="comment-count">{comments}</span>
                    </button>

                    {/* Like */}
                    <button type="button" className={liked ? "action-button like-button liked" : "action-button like-button"}
                        aria-label="Like" onClick={handleLike}>
                        <img src={liked ? heartFilledIcon : heartIcon} alt="" className="like-icon" />
                        <span className="like-count">{likes}</span>
                    </button>

                    {/* Guardar */}
                    <button type="button" className={saved ? "action-button save-button saved" : "action-button save-button"}
                        onClick={() => setSaved(!saved)}>
                        <img src={saved ? saveFilledIcon : saveIcon} alt="" className="save-icon" />
                        <span className="save-text">{saved ? "Saved" : "Save"}</span>
                    </button>

                </div>

                {/* Caja para comentar */}
                <div className={commentOpen ? "comment-box open" : "comment-box"}>
                    <input type="text" placeholder="Write a comment..." aria-label="Write a comment"
                        value={commentText} onChange={(event) => setCommentText(event.target.value)} />
                    <button type="button" className="send-button" onClick={handleSend}>Send</button>
                </div>

            </div>
        </article>
    );
}

export default PostCard;
