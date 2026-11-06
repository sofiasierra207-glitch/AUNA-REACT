import { useState } from 'react';
import CollectionCard from '../../components/collectioncard/CollectionCard';
import SavedCard from '../../components/savedcard/SavedCard';
import { explorePosts } from '../explore/data';
import { posts } from '../index/data';
import { figmaSaved, myCollections, tabs } from './data';
import type { SavedItem, SavedType } from './data';
import './favorites.css';

// tipado de las props: los ids guardados vienen del estado global de App
// son los que guarde con el boton "Save" en Explore o en el Home
interface FavoritesProps {
    savedIds: number[];
}

// pagina de Favorites
function Favorites({ savedIds }: FavoritesProps) {

    // la tab seleccionada, empieza en All
    const [currentType, setCurrentType] = useState<'All' | SavedType>('All');

    // busco los posts de explore que tienen el id guardado
    // y los convierto al mismo formato de los guardados del figma
    // ya no copio los posts en otro archivo: los importo de explore/data.ts
    const fromExplore: SavedItem[] = explorePosts
        .filter((post) => savedIds.includes(post.id))
        .map((post) => ({
            type: 'Post',
            name: post.user,
            text: post.text,
            image: post.image,
            exploreId: post.id,
        }));

    // lo mismo con los posts del Home que guarde
    const fromHome: SavedItem[] = posts
        .filter((post) => savedIds.includes(post.id))
        .map((post) => ({
            type: 'Post',
            name: post.user,
            text: post.text,
            image: post.image,
            exploreId: 0,
        }));

    // quito del figma los que ya guarde en explore, asi no sale el mismo post dos veces
    const fromFigma = figmaSaved.filter((item) => !savedIds.includes(item.exploreId));

    // primero los del figma y al final los que guarde en explore y en el home
    const allSaved = [...fromFigma, ...fromExplore, ...fromHome];

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
                        <SavedCard key={`${item.type}-${item.name}`} item={item} />
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