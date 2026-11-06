import { useState } from 'react';
import CollectionCard from '../../components/collectioncard/CollectionCard';
import SavedCard from '../../components/savedcard/SavedCard';
import { publicaciones } from '../explore/data';
import { posts } from '../index/data';
import { guardadosFigma, misColecciones, tabs } from './data';
import type { Guardado, TipoGuardado } from './data';
import './favorites.css';

// tipado de las props: los ids guardados vienen del estado global de App
// son los que guarde con el boton "Save" en Explore o en el Home
interface FavoritesProps {
    idsGuardados: number[];
}

// pagina de Favorites
function Favorites({ idsGuardados }: FavoritesProps) {

    // la tab seleccionada, empieza en All
    const [tipoActual, setTipoActual] = useState<'All' | TipoGuardado>('All');

    // busco los posts de explore que tienen el id guardado
    // y los convierto al mismo formato de los guardados del figma
    // ya no copio los posts en otro archivo: los importo de explore/data.ts
    const deExplore: Guardado[] = publicaciones
        .filter((post) => idsGuardados.includes(post.id))
        .map((post) => ({
            tipo: 'Post',
            nombre: post.usuario,
            texto: post.texto,
            imagen: post.imagen,
            idExplore: post.id,
        }));

    // lo mismo con los posts del Home que guarde
    const deHome: Guardado[] = posts
        .filter((post) => idsGuardados.includes(post.id))
        .map((post) => ({
            tipo: 'Post',
            nombre: post.user,
            texto: post.text,
            imagen: post.image,
            idExplore: 0,
        }));

    // quito del figma los que ya guarde en explore, asi no sale el mismo post dos veces
    const delFigma = guardadosFigma.filter((item) => !idsGuardados.includes(item.idExplore));

    // primero los del figma y al final los que guarde en explore y en el home
    const todosLosGuardados = [...delFigma, ...deExplore, ...deHome];

    // cuantos hay de cada tipo, para la pastilla de cada tab
    function contar(tipo: 'All' | TipoGuardado) {
        if (tipo === 'All') return todosLosGuardados.length;
        return todosLosGuardados.filter((item) => item.tipo === tipo).length;
    }

    // si la tab es All muestro todo, si no solo los de ese tipo
    const filtrados = todosLosGuardados.filter(
        (item) => tipoActual === 'All' || item.tipo === tipoActual,
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
                            key={tab.valor}
                            type="button"
                            className={`tab ${tipoActual === tab.valor ? 'tab-activa' : ''}`}
                            onClick={() => setTipoActual(tab.valor)}
                        >
                            {tab.texto} <span className="tab-numero">{contar(tab.valor)}</span>
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
                    {filtrados.map((item) => (
                        <SavedCard key={`${item.tipo}-${item.nombre}`} item={item} />
                    ))}
                </div>

                {/* si en esa tab no hay nada muestro el mensaje */}
                {filtrados.length === 0 && (
                    <p className="sin-resultados">You haven't saved anything here yet.</p>
                )}
            </section>

            <section className="colecciones">
                <h2>My collections</h2>

                {/* dos map: uno para las filas y otro para las colecciones de cada fila
                    reuso el mismo componente CollectionCard de Explore, aqui sin link */}
                {misColecciones.map((fila, indice) => (
                    <div className="colecciones-fila" key={indice}>
                        {fila.map((coleccion) => (
                            <CollectionCard
                                key={coleccion.titulo}
                                titulo={coleccion.titulo}
                                texto={coleccion.texto}
                                color={coleccion.color}
                            />
                        ))}
                    </div>
                ))}
            </section>
        </main>
    );
}

export default Favorites;