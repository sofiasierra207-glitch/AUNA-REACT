import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './communityhelp.css';

// tipado de las props: la pagina me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface CommunityHelpProps {
    open: boolean;
    onClose: () => void;
}

// tipado de un pedido de ayuda
interface HelpRequest {
    text: string;
    category: string;
    anonymous: boolean;
}

// opciones del select de categoria
const categories = ['Health', 'Safe space', 'Support', 'Legal', 'Everyday'];

// modal para pedir ayuda a la comunidad (se abre desde Home y Help)
// en js lo creaba con createElement e innerHTML, ahora es un componente
function CommunityHelp({ open, onClose }: CommunityHelpProps) {
    // lo que escribo en la caja, la categoria y si es anonimo
    const [text, setText] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [anonymous, setAnonymous] = useState(true);

    // true si intente enviar con la caja vacia
    const [hasError, setHasError] = useState(false);

    // si ya envie el pedido muestro el mensaje de enviado
    const [sent, setSent] = useState(false);

    // los pedidos se guardan con el custom hook (antes era localStorage a mano)
    const [requests, setRequests] = useLocalStorage<HelpRequest[]>('aunaPedidosAyuda', []);

    // dejo todo como al inicio para la proxima vez que lo abra
    function reset() {
        setText('');
        setCategory(categories[0]);
        setAnonymous(true);
        setHasError(false);
        setSent(false);
    }

    function close() {
        reset();
        onClose();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setText('');
                setCategory(categories[0]);
                setAnonymous(true);
                setHasError(false);
                setSent(false);
                onClose();
            }
        }

        document.addEventListener('keydown', handleKey);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // cuando envio el pedido (click en Send request)
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue

        const clean = text.trim();

        // si no escribi nada muestro el error y no envio
        if (clean === '') {
            setHasError(true);
            return;
        }

        // agrego el pedido nuevo al array (... copia los que ya estaban)
        setRequests([...requests, { text: clean, category: category, anonymous: anonymous }]);

        // escondo el form y muestro el mensaje de enviado
        setSent(true);
    }

    // si doy click en el fondo oscuro (afuera de la caja) se cierra
    function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            close();
        }
    }

    // si esta cerrado no muestro nada
    if (!open) return null;

    return (
        <div className="ayuda-fondo abierto" onClick={handleBackdropClick}>
            {/* la clase enviado esconde el form y muestra el mensaje (lo hace el css) */}
            <div className={sent ? 'ayuda-modal enviado' : 'ayuda-modal'} role="dialog" aria-label="Ask the community for help">

                <div className="ayuda-header">
                    <h3>Ask the community for help</h3>
                    <button type="button" className="ayuda-cerrar" aria-label="Close" onClick={close}>×</button>
                </div>

                <p className="ayuda-texto">
                    Tell us what you need. Your message only reaches verified users nearby,
                    and you can post it anonymously.
                </p>

                <form className="ayuda-form" onSubmit={handleSubmit}>
                    <div className="ayuda-campo">
                        <label htmlFor="ayuda-necesito">What do you need today?</label>
                        {/* al escribir guardo el texto y quito el error */}
                        <textarea
                            id="ayuda-necesito"
                            className={hasError ? 'ayuda-textarea ayuda-error' : 'ayuda-textarea'}
                            placeholder="E.g. Looking for company to a doctor's appointment Thursday afternoon."
                            value={text}
                            onChange={(event) => {
                                setText(event.target.value);
                                setHasError(false);
                            }}
                            autoFocus
                        />
                        <p className={hasError ? 'ayuda-mensaje-error visible' : 'ayuda-mensaje-error'}>
                            Tell us what you need before sending.
                        </p>
                    </div>

                    <div className="ayuda-fila">
                        <div className="ayuda-campo">
                            <label htmlFor="ayuda-categoria">Category</label>
                            {/* map crea una opcion por cada categoria */}
                            <select
                                id="ayuda-categoria"
                                className="ayuda-select"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            >
                                {categories.map((categoryOption) => (
                                    <option key={categoryOption}>{categoryOption}</option>
                                ))}
                            </select>
                        </div>

                        {/* checked dice si esta marcado */}
                        <label className="ayuda-check">
                            <input
                                type="checkbox"
                                className="ayuda-anonimo"
                                checked={anonymous}
                                onChange={(event) => setAnonymous(event.target.checked)}
                            />
                            Send anonymously
                        </label>
                    </div>

                    <button type="submit" className="ayuda-enviar">Send request</button>
                </form>

                <div className="ayuda-enviado">
                    <p className="ayuda-texto">Your request was sent. Verified users nearby will see it soon.</p>
                    <button type="button" className="ayuda-enviar" onClick={close}>Done</button>
                </div>
            </div>
        </div>
    );
}

export default CommunityHelp;