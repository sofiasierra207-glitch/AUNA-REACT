import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './communityhelp.css';

// tipado de las props: la pagina me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface CommunityHelpProps {
    abierto: boolean;
    onCerrar: () => void;
}

// tipado de un pedido de ayuda
interface Pedido {
    texto: string;
    categoria: string;
    anonimo: boolean;
}

// opciones del select de categoria
const categorias = ['Health', 'Safe space', 'Support', 'Legal', 'Everyday'];

// modal para pedir ayuda a la comunidad (se abre desde Home y Help)
// en js lo creaba con createElement e innerHTML, ahora es un componente
function CommunityHelp({ abierto, onCerrar }: CommunityHelpProps) {
    // lo que escribo en la caja, la categoria y si es anonimo
    const [texto, setTexto] = useState('');
    const [categoria, setCategoria] = useState(categorias[0]);
    const [anonimo, setAnonimo] = useState(true);

    // true si intente enviar con la caja vacia
    const [hayError, setHayError] = useState(false);

    // si ya envie el pedido muestro el mensaje de enviado
    const [enviado, setEnviado] = useState(false);

    // los pedidos se guardan con el custom hook (antes era localStorage a mano)
    const [pedidos, setPedidos] = useLocalStorage<Pedido[]>('aunaPedidosAyuda', []);

    // dejo todo como al inicio para la proxima vez que lo abra
    function limpiar() {
        setTexto('');
        setCategoria(categorias[0]);
        setAnonimo(true);
        setHayError(false);
        setEnviado(false);
    }

    function cerrar() {
        limpiar();
        onCerrar();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!abierto) return;

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                setTexto('');
                setCategoria(categorias[0]);
                setAnonimo(true);
                setHayError(false);
                setEnviado(false);
                onCerrar();
            }
        }

        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', alPresionarTecla);
    }, [abierto, onCerrar]);

    // cuando envio el pedido (click en Send request)
    function alEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue

        const limpio = texto.trim();

        // si no escribi nada muestro el error y no envio
        if (limpio === '') {
            setHayError(true);
            return;
        }

        // agrego el pedido nuevo al array (... copia los que ya estaban)
        setPedidos([...pedidos, { texto: limpio, categoria: categoria, anonimo: anonimo }]);

        // escondo el form y muestro el mensaje de enviado
        setEnviado(true);
    }

    // si doy click en el fondo oscuro (afuera de la caja) se cierra
    function alClickFondo(evento: MouseEvent<HTMLDivElement>) {
        if (evento.target === evento.currentTarget) {
            cerrar();
        }
    }

    // si esta cerrado no muestro nada
    if (!abierto) return null;

    return (
        <div className="ayuda-fondo abierto" onClick={alClickFondo}>
            {/* la clase enviado esconde el form y muestra el mensaje (lo hace el css) */}
            <div className={enviado ? 'ayuda-modal enviado' : 'ayuda-modal'} role="dialog" aria-label="Ask the community for help">

                <div className="ayuda-header">
                    <h3>Ask the community for help</h3>
                    <button type="button" className="ayuda-cerrar" aria-label="Close" onClick={cerrar}>×</button>
                </div>

                <p className="ayuda-texto">
                    Tell us what you need. Your message only reaches verified users nearby,
                    and you can post it anonymously.
                </p>

                <form className="ayuda-form" onSubmit={alEnviar}>
                    <div className="ayuda-campo">
                        <label htmlFor="ayuda-necesito">What do you need today?</label>
                        {/* al escribir guardo el texto y quito el error */}
                        <textarea
                            id="ayuda-necesito"
                            className={hayError ? 'ayuda-textarea ayuda-error' : 'ayuda-textarea'}
                            placeholder="E.g. Looking for company to a doctor's appointment Thursday afternoon."
                            value={texto}
                            onChange={(evento) => {
                                setTexto(evento.target.value);
                                setHayError(false);
                            }}
                            autoFocus
                        />
                        <p className={hayError ? 'ayuda-mensaje-error visible' : 'ayuda-mensaje-error'}>
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
                                value={categoria}
                                onChange={(evento) => setCategoria(evento.target.value)}
                            >
                                {categorias.map((opcion) => (
                                    <option key={opcion}>{opcion}</option>
                                ))}
                            </select>
                        </div>

                        {/* checked dice si esta marcado */}
                        <label className="ayuda-check">
                            <input
                                type="checkbox"
                                className="ayuda-anonimo"
                                checked={anonimo}
                                onChange={(evento) => setAnonimo(evento.target.checked)}
                            />
                            Send anonymously
                        </label>
                    </div>

                    <button type="submit" className="ayuda-enviar">Send request</button>
                </form>

                <div className="ayuda-enviado">
                    <p className="ayuda-texto">Your request was sent. Verified users nearby will see it soon.</p>
                    <button type="button" className="ayuda-enviar" onClick={cerrar}>Done</button>
                </div>
            </div>
        </div>
    );
}

export default CommunityHelp;