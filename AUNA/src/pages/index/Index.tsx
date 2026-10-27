import { useState } from 'react';

// Estilos del Home (el mismo de la entrega 2)
import './index.css';

import PostCard from '../../components/organisms/PostCard/PostCard';
import { currentUser, posts, resources } from './data';
import type { Post } from './data';

// Imágenes e íconos
import logo from '../../assets/images/logoauna.png';
import principal from '../../assets/images/principal.png';
import libroanimado from '../../assets/images/libroanimado.png';
import parque from '../../assets/images/parque.png';
import cafe from '../../assets/images/cafe.png';
import libro from '../../assets/images/libro.png';
import searchIcon from '../../assets/icons/search.svg';
import profileIcon from '../../assets/icons/profile.svg';
import languageIcon from '../../assets/icons/language.svg';

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

    return (
        <>
            {/* ===== Header ===== */}
            <header>

                <div className="header">

                    {/* Logo que lleva al inicio */}
                    <a href="/" className="logo" aria-label="AÚNA home">
                        <img src={logo} alt="AÚNA logo" />
                    </a>

                    {/* Menú principal */}
                    <nav className="main-nav" aria-label="Main navigation">
                        <ul>
                            <li><a href="/" className="nav-link active" aria-current="page">Home</a></li>
                            <li><a href="/explore" className="nav-link">Explore</a></li>
                            <li><a href="/community" className="nav-link">Community</a></li>
                            <li><a href="/favorites" className="nav-link">Favorites</a></li>
                            <li><a href="/help" className="nav-link">AÚNA Help</a></li>
                        </ul>
                    </nav>

                    {/* Botones de buscar, perfil e idioma */}
                    <div className="header-actions">

                        <button type="button" className="icon-button" id="search-button" aria-label="Search">
                            <img src={searchIcon} alt="" />
                        </button>

                        <button type="button" className="icon-button" id="profile-button" aria-label="Profile">
                            <img src={profileIcon} alt="" />
                        </button>

                        <button type="button" className="icon-button" id="language-button" aria-label="Change language">
                            <img src={languageIcon} alt="" />
                        </button>

                    </div>

                </div>

            </header>


            {/* Menú inferior, solo visible en celular */}
            <nav className="bottom-nav" aria-label="Mobile navigation">
                <a href="/" className="bottom-link active" aria-current="page"><span className="dot"></span>Home</a>
                <a href="/explore" className="bottom-link"><span className="dot"></span>Explore</a>
                <a href="/community" className="bottom-link"><span className="dot"></span>Community</a>
                <a href="/favorites" className="bottom-link"><span className="dot"></span>Favorites</a>
                <a href="/help" className="bottom-link"><span className="dot"></span>Help</a>
            </nav>


            {/* Contenido principal */}
            <main>

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
                        <a href="/explore">View all →</a>
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
                            {postError === "login" ? <>Log in to share a post. <a href="/login">Log in</a></> : postError}
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
                            <PostCard key={post.user + post.time + post.text} post={post} />
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
                                <a href="/help" className="resource-card">
                                    <span className="user-avatar">{resource.initial}</span>
                                    <span className="resource-info">
                                        <strong>{resource.name}</strong>
                                        <span>{resource.details}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                </section>

            </main>


            {/* ===== Footer ===== */}
            <footer>

                <div className="footer-brand">
                    <strong>AÚNA</strong>
                    <p>Made with care so every woman finds her place.</p>
                </div>

                <nav className="footer-navigation" aria-label="Footer navigation">
                    <a href="/community">Community</a>
                    <a href="/help">Help</a>
                    <a href="/explore">Explore</a>
                </nav>

            </footer>
        </>
    );
}

export default Index;
