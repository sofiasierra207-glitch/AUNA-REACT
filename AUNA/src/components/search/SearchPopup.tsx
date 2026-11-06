import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './search.css';

// tipado de las props: el header me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface SearchPopupProps {
    abierto: boolean;
    onCerrar: () => void;
}

// sugerencias 
const sugerencias = ['Community', 'Help', 'Wellness'];

// si escribo el nombre de una pagina voy directo a esa ruta
const paginas: Record<string, string> = {
    home: '/',
    explore: '/explore',
    community: '/community',
    favorites: '/favorites',
    help: '/help',
    'auna help': '/help',
};

// popup de buscar
// en js lo creaba con createElement e innerHTML, ahora es un componente
// el header lo muestra u oculta con la prop "abierto"
function SearchPopup({ abierto, onCerrar }: SearchPopupProps) {
    // lo que voy escribiendo en el buscador
    const [texto, setTexto] = useState('');

    // useNavigate me deja cambiar de pagina desde el codigo
    const navigate = useNavigate();

    // cierro el popup y limpio lo que habia escrito
    function cerrar() {
        setTexto('');
        onCerrar();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el popup esta abierto
    useEffect(() => {
        if (!abierto) return;

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                setTexto('');
                onCerrar();
            }
        }

        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito el evento cuando se cierra el popup
        return () => document.removeEventListener('keydown', alPresionarTecla);
    }, [abierto, onCerrar]);

    // busca la palabra: si es una pagina voy a esa pagina
    // si no, voy a explore con la palabra en la url (/explore?q=...)
    function buscar(palabraEscrita: string) {
        const limpio = palabraEscrita.trim();
        if (limpio === '') return;

        const ruta = paginas[limpio.toLowerCase()];

        if (ruta) {
            navigate(ruta);
        } else {
            // encodeURIComponent para que los espacios y tildes no rompan la url
            navigate(`/explore?q=${encodeURIComponent(limpio)}`);
        }
        cerrar();
    }

    // Enter o click en el boton Search
    function alEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue
        buscar(texto);
    }

    // si doy click en el fondo oscuro (afuera de la caja blanca) se cierra
    // target es donde di click y currentTarget es el fondo
    function alClickFondo(evento: MouseEvent<HTMLDivElement>) {
        if (evento.target === evento.currentTarget) {
            cerrar();
        }
    }

    // si esta cerrado no muestro nada
    if (!abierto) return null;

    return (
        <div className="buscar-fondo abierto" onClick={alClickFondo}>
            <div className="buscar-popup" role="dialog" aria-label="Search AÚNA">
                <h3>Search AÚNA</h3>

                <form className="buscar-form" onSubmit={alEnviar}>
                    {/* input controlado: su valor sale del estado texto
                        autoFocus pone el cursor de una para escribir */}
                    <input
                        type="text"
                        className="buscar-input"
                        placeholder="Search people, topics, or posts"
                        value={texto}
                        onChange={(evento) => setTexto(evento.target.value)}
                        autoFocus
                    />
                    {/* boton para buscar con click (Enter tambien funciona) */}
                    <button type="submit" className="buscar-boton">Search</button>
                </form>

                <p className="buscar-subtitulo">Suggestions</p>

                {/* al darle click a una sugerencia busco esa palabra de una */}
                <div className="buscar-tags">
                    {sugerencias.map((sugerencia) => (
                        <button
                            key={sugerencia}
                            type="button"
                            className="buscar-tag"
                            onClick={() => buscar(sugerencia)}
                        >
                            {sugerencia}
                        </button>
                    ))}
                </div>

                <Link to="/" className="buscar-volver" onClick={cerrar}>
                    Back to home
                </Link>
            </div>
        </div>
    );
}

export default SearchPopup;