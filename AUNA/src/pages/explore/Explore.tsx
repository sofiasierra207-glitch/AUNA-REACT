import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../../components/postcard/PostCard';
import CollectionCard from '../../components/collectioncard/CollectionCard';
import useLocalStorage from '../../hooks/useLocalStorage';
import usePosts, { timeAgo } from '../../hooks/usePosts';
import { weeklyCollections, topics } from './data';
import type { Post } from './data';
import type { PostRow } from '../index/data';
import searchIcon from '../../assets/icons/search.svg';
import libroAnimado from '../../assets/images/libroanimado.png';
import './explore.css';

const initialCount = 6; // cuantos posts muestro al inicio

// pasa una fila de la tabla posts a la forma que usa PostCard
// meta junta el rol de la autora y hace cuanto lo publico
function toExplorePost(row: PostRow): Post {
    return {
        id: row.id,
        user: row.profiles ? row.profiles.username : '@auna',
        meta: (row.profiles ? row.profiles.role : 'Member') + ' · ' + timeAgo(row.created_at),
        topic: row.topic,
        text: row.content,
        // si el post no tiene foto uso la portada del cuaderno
        image: row.image_url ?? libroAnimado,
        imageAlt: row.image_alt ?? 'Notebook with stickers',
        comments: 0, // los comentarios y likes reales se conectan despues
        likes: 0,
    };
}

// tipado de las props: los guardados vienen del estado global de App
interface ExploreProps {
    saved: string[];                // ids guardados como texto (los de Supabase son uuid)
    onSave: (id: string) => void;
}

// pagina de Explore
function Explore({ saved, onSave }: ExploreProps) {
    // la busqueda vive en la url (/explore?q=park)
    // asi el popup de buscar me puede mandar una palabra desde cualquier pagina
    const [searchParams, setSearchParams] = useSearchParams();
    const searchedText = (searchParams.get('q') ?? '').trim().toLowerCase();

    // estados de la pagina
    const [currentTopic, setCurrentTopic] = useState('All');                      // filtro seleccionado
    const [inputText, setInputText] = useState(searchParams.get('q') ?? ''); // lo que escribo en el buscador
    const [visibleCount, setVisibleCount] = useState(initialCount);

    // si la palabra de la url cambia (busque desde el popup estando en explore)
    // actualizo el input y vuelvo a mostrar 6 posts
    const [previousSearch, setPreviousSearch] = useState(searchedText);
    if (previousSearch !== searchedText) {
        setPreviousSearch(searchedText);
        setInputText(searchParams.get('q') ?? '');
        setVisibleCount(initialCount);
    }

    // likes con mi custom hook, se guardan en localStorage
    // los guardados ya no van aqui: vienen de App por props (estado global)
    const [likes, setLikes] = useLocalStorage<string[]>('aunaLikes', []);

    // posts de la tabla posts de Supabase (custom hook usePosts, el mismo del Home)
    const { rows, loading, error } = usePosts();

    // filtro los posts por tema y por texto
    // la busqueda revisa la autora, el tema y el texto de cada post de la base de datos
    const filtered = rows.map(toExplorePost).filter((post) => {
        // pasa si el filtro es All o si el tema del post es igual al filtro
        const matchesTopic = currentTopic === 'All' || post.topic === currentTopic;

        // junto usuario, tema y texto en minusculas y reviso si tiene lo que busque
        const content = `${post.user} ${post.topic} ${post.text}`.toLowerCase();
        const matchesText = content.includes(searchedText);

        return matchesTopic && matchesText;
    });

    // slice toma solo los que se ven
    const visible = filtered.slice(0, visibleCount);
    const allLoaded = visibleCount >= filtered.length;

    // agrega o quita un id de un array (lo uso para los likes)
    // includes revisa si ya esta, filter crea un array nuevo sin ese id
    function toggle(list: string[], id: string) {
        return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    }

    function changeTopic(topic: string) {
        setCurrentTopic(topic);
        setVisibleCount(initialCount);
    }

    // buscador: Enter o click en Search
    function search(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue
        const clean = inputText.trim();

        // pongo la palabra en la url, si esta vacio la quito
        setSearchParams(clean === '' ? {} : { q: clean });
    }

    // boton "Clear search"
    function clearSearch() {
        setInputText('');
        setSearchParams({});
    }

    // si dejo el buscador vacio vuelven a salir todas las publicaciones
    function handleChange(value: string) {
        setInputText(value);
        if (value.trim() === '' && searchedText !== '') {
            setSearchParams({});
        }
    }

    return (
        <main className="explore">
            <section className="hero">
                <p className="etiqueta">EXPLORE</p>

                <h1>Discover what's inspiring the community today</h1>

                <p className="hero-texto">
                    Filter by topic, discover new creators, and save what makes you feel good.
                    Everything you see here comes from verified women in the network.
                </p>

                <form className="buscador" onSubmit={search}>
                    <div className="input-buscar">
                        {/* alt vacio porque la lupa es solo decoracion */}
                        <img src={searchIcon} alt="" />
                        <input
                            type="text"
                            placeholder="Search topics, places, or creators"
                            value={inputText}
                            onChange={(event) => handleChange(event.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-principal">Search</button>
                </form>

                {/* filtros: un boton por cada tema, el seleccionado lleva filtro-activo */}
                <div className="filtros">
                    {topics.map((topic) => (
                        <button
                            key={topic.value}
                            type="button"
                            className={`filtro ${currentTopic === topic.value ? 'filtro-activo' : ''}`}
                            onClick={() => changeTopic(topic.value)}
                        >
                            {topic.text}
                        </button>
                    ))}
                </div>
            </section>

            {/* las publicaciones van justo debajo de los filtros:
                asi al cambiar de filtro se ve de una que la lista cambia */}
            <section className="publicaciones">
                <div className="publicaciones-titulo">
                    <h2>{searchedText ? 'Search results' : 'Recent posts'}</h2>
                    <span className="ordenar">Sort by: most recent</span>
                </div>

                {/* resultado de la busqueda: solo sale si busque algo */}
                {searchedText && (
                    <div className="resultado-busqueda">
                        <p>
                            {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for "{searchedText}"
                        </p>
                        <button type="button" className="btn-limpiar" onClick={clearSearch}>
                            Clear search
                        </button>
                    </div>
                )}

                {/* map crea una tarjeta (componente PostCard) por cada post
                    key le ayuda a react a saber cual es cual */}
                <div className="grid">
                    {visible.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            isLiked={likes.includes(post.id)}
                            isSaved={saved.includes(post.id)}
                            onLike={(id) => setLikes(toggle(likes, id))}
                            onSave={onSave}
                        />
                    ))}
                </div>

                {/* mensajes mientras cargan los posts o si hubo un error */}
                {loading && <p className="sin-resultados">Loading posts...</p>}
                {error !== '' && <p className="sin-resultados">{error}</p>}

                {!loading && error === '' && filtered.length === 0 && (
                    <p className="sin-resultados">No posts found. Try another topic or word.</p>
                )}

                {/* si todavia hay posts escondidos muestro 3 mas */}
                <div className="cargar-mas">
                    <button
                        type="button"
                        className="btn-secundario"
                        disabled={allLoaded}
                        onClick={() => setVisibleCount(visibleCount + 3)}
                    >
                        {allLoaded ? "You're all caught up" : 'Load more posts'}
                    </button>
                </div>
            </section>

            <section className="colecciones">
                <h2>This week's collections</h2>

                {/* "View collection" lleva a favorites, donde estan las colecciones */}
                <div className="colecciones-lista">
                    {weeklyCollections.map((collection) => (
                        <CollectionCard
                            key={collection.title}
                            title={collection.title}
                            text={collection.text}
                            color={collection.color}
                            link="/favorites"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Explore;