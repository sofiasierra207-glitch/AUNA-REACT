import { useState } from 'react';
import { Link } from 'react-router-dom';

// Paleta, estilos generales y estilos del Home
import './index.css';

import FeedCard from '../../components/feedcard/FeedCard';
import { currentUser, posts, resources } from './data';
import type { Post } from './data';

// Imágenes e íconos
import principal from '../../assets/images/principal.png';
import libroanimado from '../../assets/images/libroanimado.png';
import parque from '../../assets/images/parque.png';
import cafe from '../../assets/images/cafe.png';
import libro from '../../assets/images/libro.png';

// Opciones del formulario
const types = ["Photo", "Video"];
const topics = ["Mental wellness", "Book club", "Safe spaces", "Creativity", "Motherhood", "Study & career"];
const covers = [
    { image: libroanimado, alt: "Notebook with stickers" },
    { image: parque, alt: "Park with trees" },
    { image: cafe, alt: "Latte with heart art" },
    { image: libro, alt: "Open book" }
];

// Página de inicio de AÚNA (index)
function Index() {

    // Posts que se ven en la página
    const [feed, setFeed] = useState(posts);

    // ¿Ya sigue a la creadora de arriba?
    const [following, setFollowing] = useState(false);

    // Lo que la usuaria llena en el formulario
    const [postText, setPostText] = useState("");
    const [postError, setPostError] = useState("");
    const [type, setType] = useState("");
    const [topic, setTopic] = useState("");
    const [cover, setCover] = useState(0); // número de la portada elegida

    // Botón Post: publica si hay sesión y texto
    function handlePost() {
        // Revisa si la usuaria inició sesión
        const session = localStorage.getItem("aunaSession");

        if (session === null) {
            setPostError("login");
        } else if (postText.trim() === "") {
            setPostError("Write something before posting.");
        } else {
            // Si no eligió tema, queda "Community"
            let postTopic = "Community";
            if (topic !== "") {
                postTopic = topic;
            }

            // Post nuevo
            const newPost: Post = {
                user: currentUser.user,
                initial: currentUser.initial,
                role: currentUser.role,
                time: "Just now",
                tag: postTopic,
                text: postText.trim(),
                image: covers[cover].image,
                imageAlt: covers[cover].alt,
                comments: 0,
                likes: 0,
                liked: false,
                saved: false
            };

            // Pone el post nuevo de primero
            setFeed([newPost, ...feed]);

            // Limpia el formulario
            setPostText("");
            setPostError("");
            setType("");
            setTopic("");

            // Aquí se abre el componente posted
        }
    }

    // El header, el menú y el footer los pone MainLayout
    return (
        <main className="home">

            {/* ===== Hero ===== */}
            <section className="hero" id="home">

                {/* Tarjeta del post destacado */}
                <article className="hero-card">

                    <img src={principal} alt="Creator taking a selfie while styling her hair"
                        className="hero-card-image" />

                    {/* Usuaria y botón Follow */}
                    <div className="hero-card-author">
                        <span className="user-avatar">V</span>
                        <div className="hero-card-info">
                            <strong>@valen.creativa</strong>
                            <span>Verified creator</span>
                        </div>
                        {/* Cambia entre Follow y Following */}
                        <button type="button" className={following ? "follow-button following" : "follow-button"}
                            onClick={() => setFollowing(!following)}>
                            {following ? "Following" : "Follow"}
                        </button>
                    </div>

                    <p className="hero-card-stats">2,448 likes and 186 comments</p>

                </article>

                {/* Texto de bienvenida */}
                <div className="hero-content">

                    <span className="hero-tag"><span className="dot"></span>A safe, verified community</span>

                    <h1>A space of your own,<br />safe and just yours.</h1>

                    <p>
                        Connect with friends, family, and creators. Share experiences, discover inspiration, and ask for
                        help whenever you need it. AÚNA is made so every woman feels welcome.
                    </p>

                    {/* Botón que baja a la comunidad */}
                    <a href="#community" className="hero-button">Explore content</a>

                    <ul className="hero-features">
                        <li><span className="dot"></span>120k+ active users</li>
                        <li><span className="dot"></span>Verified creators</li>
                        <li><span className="dot"></span>Inclusive and accessible design</li>
                    </ul>

                </div>

            </section>


            {/* ===== Comunidad ===== */}
            <section className="community-section" id="community">

                <div className="section-heading">
                    <span>LIVE COMMUNITY</span>
                    <h2>Voices that look out for each other</h2>
                    <Link to="/explore">View all →</Link>
                </div>


                {/* Formulario para crear un post */}
                <div className="create-post">

                    <h3>Share something with the community</h3>
                    <p>Post a photo or video and choose a topic to help others find it.</p>

                    {/* Al escribir se borra el error */}
                    <textarea id="post-text" placeholder="What do you want to share today?"
                        aria-label="What do you want to share today?" value={postText}
                        onChange={(event) => { setPostText(event.target.value); setPostError(""); }}></textarea>

                    {/* Mensaje de error */}
                    <p className="form-error" id="post-error">
                        {postError === "login" ? <>Log in to share a post. <Link to="/login">Log in</Link></> : postError}
                    </p>

                    <div className="post-options">

                        {/* Tipo de contenido */}
                        <div className="option-group">
                            <span className="option-label">Content type</span>
                            <div className="chips type-chips">
                                {types.map((item) => (
                                    <button key={item} type="button" className={type === item ? "chip active" : "chip"}
                                        aria-pressed={type === item} onClick={() => setType(item)}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tema del post */}
                        <div className="option-group">
                            <span className="option-label">Topic</span>
                            <div className="chips topic-chips">
                                {topics.map((item) => (
                                    <button key={item} type="button"
                                        className={topic === item ? "chip topic-chip active" : "chip topic-chip"}
                                        aria-pressed={topic === item} onClick={() => setTopic(item)}>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Portada del post */}
                    <div className="option-group">
                        <span className="option-label">Choose a cover</span>
                        <div className="covers">
                            {covers.map((item, index) => (
                                <button key={item.alt} type="button" className={cover === index ? "cover active" : "cover"}
                                    aria-pressed={cover === index} onClick={() => setCover(index)}>
                                    <img src={item.image} alt={item.alt} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="post-actions">
                        <button type="button" className="post-button" onClick={handlePost}>Post</button>
                    </div>

                </div>


                {/* Una tarjeta por cada post */}
                <div className="posts-grid">
                    {feed.map((post) => (
                        <FeedCard key={post.user + post.time + post.text} post={post} />
                    ))}
                </div>


                {/* Estadísticas de la comunidad */}
                <div className="community-stats">

                    <div className="stat stat-left">
                        <strong>120k+</strong>
                        <span>active users every month</span>
                    </div>

                    <div className="stat">
                        <strong>4.5k</strong>
                        <span>verified creators and professionals</span>
                    </div>

                    <div className="stat stat-right">
                        <strong>92%</strong>
                        <span>say they feel safe on AÚNA</span>
                    </div>

                </div>

            </section>


            {/* ===== AÚNA Help ===== */}
            <section className="auna-help" id="help">

                <div className="help-content">
                    <span className="help-icon">A</span>
                    <h2>AÚNA Help</h2>
                    <span className="help-label">RESOURCES NEAR YOU</span>
                    <p>Need to sort something out today? Find health centers, services, and support nearby in seconds.</p>
                    {/* Aquí se conecta communityhelp de Cami */}
                    <button type="button" className="help-button">Ask the community for help</button>
                </div>

                {/* Una tarjeta por cada lugar */}
                <ul className="help-resources">
                    {resources.map((resource) => (
                        <li key={resource.name}>
                            <Link to="/help" className="resource-card">
                                <span className="user-avatar">{resource.initial}</span>
                                <span className="resource-info">
                                    <strong>{resource.name}</strong>
                                    <span>{resource.details}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

            </section>

        </main>
    );
}

export default Index;
