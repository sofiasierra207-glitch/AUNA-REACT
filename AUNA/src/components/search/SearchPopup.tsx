import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './search.css';

// tipado de las props: el header me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface SearchPopupProps {
    open: boolean;
    onClose: () => void;
}

// sugerencias 
const suggestions = ['Community', 'Help', 'Wellness'];

// si escribo el nombre de una pagina voy directo a esa ruta
const pages: Record<string, string> = {
    home: '/',
    explore: '/explore',
    community: '/community',
    favorites: '/favorites',
    help: '/help',
    'auna help': '/help',
};

// popup de buscar
// en js lo creaba con createElement e innerHTML, ahora es un componente
// el header lo muestra u oculta con la prop "open"
function SearchPopup({ open, onClose }: SearchPopupProps) {
    // lo que voy escribiendo en el buscador
    const [text, setText] = useState('');

    // useNavigate me deja cambiar de pagina desde el codigo
    const navigate = useNavigate();

    // cierro el popup y limpio lo que habia escrito
    function close() {
        setText('');
        onClose();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el popup esta abierto
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setText('');
                onClose();
            }
        }

        document.addEventListener('keydown', handleKey);

        // limpieza: quito el evento cuando se cierra el popup
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // busca la palabra: si es una pagina voy a esa pagina
    // si no, voy a explore con la palabra en la url (/explore?q=...)
    function search(typedWord: string) {
        const clean = typedWord.trim();
        if (clean === '') return;

        const route = pages[clean.toLowerCase()];

        if (route) {
            navigate(route);
        } else {
            // encodeURIComponent para que los espacios y tildes no rompan la url
            navigate(`/explore?q=${encodeURIComponent(clean)}`);
        }
        close();
    }

    // Enter o click en el boton Search
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue
        search(text);
    }

    // si doy click en el fondo oscuro (afuera de la caja blanca) se cierra
    // target es donde di click y currentTarget es el fondo
    function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            close();
        }
    }

    // si esta cerrado no muestro nada
    if (!open) return null;

    return (
        <div className="buscar-fondo abierto" onClick={handleBackdropClick}>
            <div className="buscar-popup" role="dialog" aria-label="Search AÚNA">
                <h3>Search AÚNA</h3>

                <form className="buscar-form" onSubmit={handleSubmit}>
                    {/* input controlado: su valor sale del estado text
                        autoFocus pone el cursor de una para escribir */}
                    <input
                        type="text"
                        className="buscar-input"
                        placeholder="Search people, topics, or posts"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        autoFocus
                    />
                    {/* boton para buscar con click (Enter tambien funciona) */}
                    <button type="submit" className="buscar-boton">Search</button>
                </form>

                <p className="buscar-subtitulo">Suggestions</p>

                {/* al darle click a una sugerencia busco esa palabra de una */}
                <div className="buscar-tags">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            className="buscar-tag"
                            onClick={() => search(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                <Link to="/" className="buscar-volver" onClick={close}>
                    Back to home
                </Link>
            </div>
        </div>
    );
}

export default SearchPopup;