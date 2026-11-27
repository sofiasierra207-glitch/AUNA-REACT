import { useEffect, useState } from 'react';
import CollectionCard from '../../components/collectioncard/CollectionCard';
import SavedCard from '../../components/savedcard/SavedCard';
import { supabase } from '../../supabaseClient';
import { postColumns } from '../../hooks/usePosts';
import type { PostRow } from '../index/data';
import { figmaSaved, myCollections, tabs } from './data';
import type { SavedItem, SavedType } from './data';
import libroAnimado from '../../assets/images/libroanimado.png';
import './favorites.css';

// tipado de las props: los ids guardados vienen del estado global de App
// son los que guarde con el boton "Save" en Explore o en el Home
interface FavoritesProps {
    savedIds: string[]; // texto, porque los posts de Supabase usan uuid
}

// pagina de Favorites
function Favorites({ savedIds }: FavoritesProps) {

    // la tab seleccionada, empieza en All
    const [currentType, setCurrentType] = useState<'All' | SavedType>('All');

    // los posts guardados, traidos de la tabla posts de Supabase
    const [savedPosts, setSavedPosts] = useState<SavedItem[]>([]);

    // cada vez que cambian los ids guardados, pido esos posts a Supabase
    useEffect(() => {
        let active = true;

        async function load() {
            // si no hay guardados no pregunto nada
            if (savedIds.length === 0) {
                if (active) setSavedPosts([]);
                return;
            }

            // .in trae solo los posts cuyo id esta en la lista de guardados
            const { data } = await supabase.from('posts').select(postColumns).in('id', savedIds);
            if (!active) return;

            // los convierto al formato de las tarjetas de Favorites
            const rows = (data ?? []) as unknown as PostRow[];
            setSavedPosts(rows.map((row) => ({
                type: 'Post',
                name: row.profiles ? row.profiles.username : '@auna',
                text: row.content,
                image: row.image_url ?? libroAnimado,
                exploreId: row.id,
            })));
        }

        load();

        // limpieza: si los guardados cambian antes de terminar, ignoro esta respuesta
        return () => { active = false; };
    }, [savedIds]);

    // del figma solo quedan los lugares y creadoras de ejemplo (todavia no tienen tabla)
    // los posts ya son los reales de Supabase
    const fromFigma = figmaSaved.filter((item) => item.type !== 'Post');

    // primero mis posts guardados y despues los lugares y creadoras
    const allSaved = [...savedPosts, ...fromFigma];

    // cuantos hay de cada tipo, para la pastilla de cada tab
    function count(type: 'All' | SavedType) {
        if (type === 'All') return allSaved.length;
        return allSaved.filter((item) => item.type === type).length;
    }

    // si la tab es All muestro todo, si no solo los de ese tipo
    const filteredItems = allSaved.filter(
        (item) => currentType === 'All' || item.type === currentType,
    );

    return (
        <main className="favorites">
            <section className="hero">
                <p className="etiqueta">YOUR SAVED ITEMS</p>

                <h1>Everything you wanted to read again</h1>

                <p className="hero-texto">
                    Everything you save from the feed lands here. Organize it into collections
                    so you can find it when you need it.
                </p>

                {/* tabs: la seleccionada lleva tab-activa */}
                <div className="tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            className={`tab ${currentType === tab.value ? 'tab-activa' : ''}`}
                            onClick={() => setCurrentType(tab.value)}
                        >
                            {tab.text} <span className="tab-numero">{count(tab.value)}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Recently saved va justo debajo de las tabs:
                asi al cambiar de tab se ve de una que la lista cambia */}
            <section className="recientes">
                <h2>Recently saved</h2>

                {/* una SavedCard por cada guardado */}
                <div className="recientes-lista">
                    {filteredItems.map((item) => (
                        <SavedCard key={`${item.type}-${item.exploreId}-${item.name}`} item={item} />
                    ))}
                </div>

                {/* si en esa tab no hay nada muestro el mensaje */}
                {filteredItems.length === 0 && (
                    <p className="sin-resultados">You haven't saved anything here yet.</p>
                )}
            </section>

            <section className="colecciones">
                <h2>My collections</h2>

                {/* dos map: uno para las filas y otro para las colecciones de cada fila
                    reuso el mismo componente CollectionCard de Explore, aqui sin link */}
                {myCollections.map((row, index) => (
                    <div className="colecciones-fila" key={index}>
                        {row.map((collection) => (
                            <CollectionCard
                                key={collection.title}
                                title={collection.title}
                                text={collection.text}
                                color={collection.color}
                            />
                        ))}
                    </div>
                ))}
            </section>
        </main>
    );
}

export default Favorites;