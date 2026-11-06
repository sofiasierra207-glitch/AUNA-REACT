import { useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../../components/postcard/PostCard';
import CollectionCard from '../../components/collectioncard/CollectionCard';
import useLocalStorage from '../../hooks/useLocalStorage';
import { coleccionesSemana, publicaciones, temas } from './data';
import iconoBuscar from '../../assets/icons/search.svg';
import './explore.css';

const cantidadInicial = 6; // cuantos posts muestro al inicio

// tipado de las props: los guardados vienen del estado global de App
interface ExploreProps {
    guardados: number[];
    onGuardar: (id: number) => void;
}

// pagina de Explore
function Explore({ guardados, onGuardar }: ExploreProps) {
    // la busqueda vive en la url (/explore?q=park)
    // asi el popup de buscar me puede mandar una palabra desde cualquier pagina
    const [searchParams, setSearchParams] = useSearchParams();
    const textoBuscado = (searchParams.get('q') ?? '').trim().toLowerCase();

    // estados de la pagina
    const [temaActual, setTemaActual] = useState('All');                      // filtro seleccionado
    const [inputTexto, setInputTexto] = useState(searchParams.get('q') ?? ''); // lo que escribo en el buscador
    const [cantidadVisible, setCantidadVisible] = useState(cantidadInicial);

    // si la palabra de la url cambia (busque desde el popup estando en explore)
    // actualizo el input y vuelvo a mostrar 6 posts
    const [busquedaAnterior, setBusquedaAnterior] = useState(textoBuscado);
    if (busquedaAnterior !== textoBuscado) {
        setBusquedaAnterior(textoBuscado);
        setInputTexto(searchParams.get('q') ?? '');
        setCantidadVisible(cantidadInicial);
    }

    // likes con mi custom hook, se guardan en localStorage
    // los guardados ya no van aqui: vienen de App por props (estado global)
    const [likes, setLikes] = useLocalStorage<number[]>('aunaLikes', []);

    // filtro los posts por tema y por texto
    const filtradas = publicaciones.filter((post) => {
        // pasa si el filtro es All o si el tema del post es igual al filtro
        const coincideTema = temaActual === 'All' || post.tema === temaActual;

        // junto usuario, tema y texto en minusculas y reviso si tiene lo que busque
        const contenido = `${post.usuario} ${post.tema} ${post.texto}`.toLowerCase();
        const coincideTexto = contenido.includes(textoBuscado);

        return coincideTema && coincideTexto;
    });

    // slice toma solo los que se ven
    const visibles = filtradas.slice(0, cantidadVisible);
    const todoCargado = cantidadVisible >= filtradas.length;

    // agrega o quita un id de un array (lo uso para los likes)
    // includes revisa si ya esta, filter crea un array nuevo sin ese id
    function alternar(lista: number[], id: number) {
        return lista.includes(id) ? lista.filter((item) => item !== id) : [...lista, id];
    }

    function cambiarTema(tema: string) {
        setTemaActual(tema);
        setCantidadVisible(cantidadInicial);
    }

    // buscador: Enter o click en Search
    function buscar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue
        const limpio = inputTexto.trim();

        // pongo la palabra en la url, si esta vacio la quito
        setSearchParams(limpio === '' ? {} : { q: limpio });
    }

    // boton "Clear search"
    function limpiarBusqueda() {
        setInputTexto('');
        setSearchParams({});
    }

    // si dejo el buscador vacio vuelven a salir todas las publicaciones
    function alEscribir(valor: string) {
        setInputTexto(valor);
        if (valor.trim() === '' && textoBuscado !== '') {
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

                <form className="buscador" onSubmit={buscar}>
                    <div className="input-buscar">
                        {/* alt vacio porque la lupa es solo decoracion */}
                        <img src={iconoBuscar} alt="" />
                        <input
                            type="text"
                            placeholder="Search topics, places, or creators"
                            value={inputTexto}
                            onChange={(evento) => alEscribir(evento.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-principal">Search</button>
                </form>

                {/* filtros: un boton por cada tema, el seleccionado lleva filtro-activo */}
                <div className="filtros">
                    {temas.map((tema) => (
                        <button
                            key={tema.valor}
                            type="button"
                            className={`filtro ${temaActual === tema.valor ? 'filtro-activo' : ''}`}
                            onClick={() => cambiarTema(tema.valor)}
                        >
                            {tema.texto}
                        </button>
                    ))}
                </div>
            </section>

            {/* las publicaciones van justo debajo de los filtros:
                asi al cambiar de filtro se ve de una que la lista cambia */}
            <section className="publicaciones">
                <div className="publicaciones-titulo">
                    <h2>{textoBuscado ? 'Search results' : 'Recent posts'}</h2>
                    <span className="ordenar">Sort by: most recent</span>
                </div>

                {/* resultado de la busqueda: solo sale si busque algo */}
                {textoBuscado && (
                    <div className="resultado-busqueda">
                        <p>
                            {filtradas.length} {filtradas.length === 1 ? 'result' : 'results'} for "{textoBuscado}"
                        </p>
                        <button type="button" className="btn-limpiar" onClick={limpiarBusqueda}>
                            Clear search
                        </button>
                    </div>
                )}

                {/* map crea una tarjeta (componente PostCard) por cada post
                    key le ayuda a react a saber cual es cual */}
                <div className="grid">
                    {visibles.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            tieneLike={likes.includes(post.id)}
                            estaGuardado={guardados.includes(post.id)}
                            onLike={(id) => setLikes(alternar(likes, id))}
                            onGuardar={onGuardar}
                        />
                    ))}
                </div>

                {filtradas.length === 0 && (
                    <p className="sin-resultados">No posts found. Try another topic or word.</p>
                )}

                {/* si todavia hay posts escondidos muestro 3 mas */}
                <div className="cargar-mas">
                    <button
                        type="button"
                        className="btn-secundario"
                        disabled={todoCargado}
                        onClick={() => setCantidadVisible(cantidadVisible + 3)}
                    >
                        {todoCargado ? "You're all caught up" : 'Load more posts'}
                    </button>
                </div>
            </section>

            <section className="colecciones">
                <h2>This week's collections</h2>

                {/* "View collection" lleva a favorites, donde estan las colecciones */}
                <div className="colecciones-lista">
                    {coleccionesSemana.map((coleccion) => (
                        <CollectionCard
                            key={coleccion.titulo}
                            titulo={coleccion.titulo}
                            texto={coleccion.texto}
                            color={coleccion.color}
                            link="/favorites"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Explore;