import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

// Paleta, estilos generales y estilos del Home
import './index.css';

import FeedCard from '../../components/feedcard/FeedCard';
import CommunityHelp from '../../components/communityhelp/CommunityHelp';
import Posted from '../../components/posted/Posted';
import { resources } from './data';
import type { Post, PostRow } from './data';

// Imágenes e íconos
import principal from '../../assets/images/principal.png';
import libroanimado from '../../assets/images/libroanimado.png';
import parque from '../../assets/images/parque.png';
import cafe from '../../assets/images/cafe.png';
import libro from '../../assets/images/libro.png';

// Opciones del formulario
const types = ["Photo", "Video"];
// value es lo que se guarda en la tabla posts (los mismos temas que acepta el check de Supabase)
// text es lo que se ve en el botón
const topics = [
    { value: "Wellness", text: "Mental wellness" },
    { value: "Reading", text: "Book club" },
    { value: "Places", text: "Safe spaces" },
    { value: "Creativity", text: "Creativity" },
    { value: "Motherhood", text: "Motherhood" },
    { value: "Study", text: "Study & career" }
];
const covers = [
    { image: libroanimado, alt: "Notebook with stickers" },
    { image: parque, alt: "Park with trees" },
    { image: cafe, alt: "Latte with heart art" },
    { image: libro, alt: "Open book" }
];

// Columnas que pido a Supabase: las del post y, por la FK, los datos de la autora en profiles
// posts y profiles también se conectan por likes, saved_posts y comments,
// por eso digo cuál FK usar: posts_user_id_fkey (la de la autora del post)
const postColumns = "id, content, topic, image_url, image_alt, created_at, profiles!posts_user_id_fkey ( username, full_name, role )";

// Convierte la fecha del post en "Just now", "5m ago", "2h ago" o "3d ago"
function timeAgo(date: string) {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return minutes + "m ago";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    return Math.floor(hours / 24) + "d ago";
}

// Pasa una fila de la tabla posts a la forma que usa FeedCard
function toPost(row: PostRow): Post {
    const name = row.profiles ? row.profiles.full_name : "";
    const user = row.profiles ? row.profiles.username : "@auna";
    return {
        id: row.id,
        user: user,
        initial: (name || user.replace("@", "")).charAt(0).toUpperCase(),
        role: row.profiles ? row.profiles.role : "Member",
        time: timeAgo(row.created_at),
        tag: row.topic,
        text: row.content,
        // Si el post no tiene foto, usa la primera portada
        image: row.image_url ?? covers[0].image,
        imageAlt: row.image_alt ?? covers[0].alt,
        comments: 0,   // los comentarios y likes reales se conectan después
        likes: 0,
        liked: false
    };
}

// Datos que recibe la página desde App
interface IndexProps {
    session: string;               // correo con la sesión abierta ("" si no hay sesión)
    saved: string[];               // ids de los posts guardados (estado global)
    onSave: (id: string) => void;  // guarda o quita un post
}

// Página de inicio de AÚNA (index)
function Index({ session, saved, onSave }: IndexProps) {

    // Posts que se ven en la página (llegan de la tabla posts de Supabase)
    const [feed, setFeed] = useState<Post[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(true);
    const [feedError, setFeedError] = useState("");

    // Al abrir la página, pide los posts a Supabase (los más nuevos primero)
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
                setFeedError("We couldn't load the posts. Try again later.");
            } else {
                setFeed((data as unknown as PostRow[]).map(toPost));
            }
            setLoadingFeed(false);
        }

        loadPosts();

        // Limpieza: se ejecuta cuando la página se cierra
        return () => {
            active = false;
        };
    }, []);

    // ¿Ya sigue a la creadora de arriba?
    const [following, setFollowing] = useState(false);


    // Si el modal de pedir ayuda está abierto o cerrado
    const [helpOpen, setHelpOpen] = useState(false);

    // Lo que la usuaria llena en el formulario
    const [postText, setPostText] = useState("");
    const [postError, setPostError] = useState("");
    const [type, setType] = useState("");
    const [topic, setTopic] = useState("");
    const [cover, setCover] = useState(0); // número de la portada elegida

    // ¿Está abierta la ventana de "Posted successfully"?
    const [postedOpen, setPostedOpen] = useState(false);

    // ¿Se está guardando el post? (evita publicar dos veces con doble clic)
    const [posting, setPosting] = useState(false);

    // Botón Post: guarda el post en la tabla posts de Supabase
    async function handlePost() {
        // Revisa si la usuaria inició sesión (la sesión viene de App)
        if (session === "") {
            setPostError("login");
            return;
        }
        if (postText.trim() === "") {
            setPostError("Write something before posting.");
            return;
        }

        setPosting(true);

        // La autora es la cuenta con la sesión abierta en Supabase
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            setPostError("login");
            setPosting(false);
            return;
        }

        // Si no eligió tema, queda "Community"
        let postTopic = "Community";
        if (topic !== "") {
            postTopic = topic;
        }

        // insert guarda la fila; select y single devuelven el post nuevo con su autora
        const { data, error } = await supabase
            .from('posts')
            .insert({
                user_id: userData.user.id,
                content: postText.trim(),
                topic: postTopic
            })
            .select(postColumns)
            .single();

        if (error) {
            console.error('Error creating post:', error);
            setPostError("We couldn't publish your post. Try again.");
        } else {
            // Pone el post nuevo de primero (sin volver a pedir toda la lista)
            setFeed([toPost(data as unknown as PostRow), ...feed]);

            // Limpia el formulario
            setPostText("");
            setPostError("");
            setType("");
            setTopic("");

            // Abre la ventana de "Posted successfully"
            setPostedOpen(true);
        }
        setPosting(false);
    }

    // El header, el menú y el footer los pone MainLayout
    return (
        <main>

            {/* ===== Hero ===== */}
            <section className="home-hero" id="home">

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
                                    <button key={item.value} type="button"
                                        className={topic === item.value ? "chip topic-chip active" : "chip topic-chip"}
                                        aria-pressed={topic === item.value} onClick={() => setTopic(item.value)}>
                                        {item.text}
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
                        <button type="button" className="post-button" onClick={handlePost} disabled={posting}>
                            {posting ? "Posting..." : "Post"}
                        </button>
                    </div>

                </div>


                {/* Una tarjeta por cada post */}
                {/* Mensajes mientras cargan los posts, si hay error o si todavía no hay ninguno */}
                {loadingFeed && <p className="feed-message">Loading posts...</p>}
                {feedError !== "" && <p className="feed-message">{feedError}</p>}
                {!loadingFeed && feedError === "" && feed.length === 0 && (
                    <p className="feed-message">No posts yet. Be the first to share something!</p>
                )}

                <div className="posts-grid">
                    {feed.map((post) => (
                        <FeedCard key={post.id} post={post}
                            saved={saved.includes(post.id)} onSave={() => onSave(post.id)} />
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
                    {/* Abre el modal de pedir ayuda (componente CommunityHelp) */}
                    <button type="button" className="help-button" onClick={() => setHelpOpen(true)}>
                        Ask the community for help
                    </button>
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

            {/* Ventana que aparece al publicar */}
            <Posted open={postedOpen} onClose={() => setPostedOpen(false)} />


            {/* Modal de pedir ayuda: le paso si está abierto y cómo cerrarlo */}
            <CommunityHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
        </main>
    );
}

export default Index;
