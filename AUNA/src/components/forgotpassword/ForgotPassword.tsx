import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import './forgotpassword.css';

// tipado de las props: el login me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface ForgotPasswordProps {
    abierto: boolean;
    onCerrar: () => void;
}

// modal de "Forgot your password?" (se abre desde el Login)
// en js lo creaba con createElement e innerHTML, ahora es un componente
function ForgotPassword({ abierto, onCerrar }: ForgotPasswordProps) {
    // el correo que voy escribiendo
    const [correo, setCorreo] = useState('');

    // true si el correo no es valido
    const [hayError, setHayError] = useState(false);

    // si ya envie el link muestro el mensaje de enviado
    const [enviado, setEnviado] = useState(false);

    // dejo todo limpio y cierro
    function cerrar() {
        setCorreo('');
        setHayError(false);
        setEnviado(false);
        onCerrar();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!abierto) return;

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                setCorreo('');
                setHayError(false);
                setEnviado(false);
                onCerrar();
            }
        }

        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', alPresionarTecla);
    }, [abierto, onCerrar]);

    // cuando envio (click en Send recovery link o Enter)
    function alEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue

        // reviso que el correo tenga @ y un punto
        const limpio = correo.trim();
        if (!limpio.includes('@') || !limpio.includes('.')) {
            setHayError(true);
            return;
        }

        // muestro el mensaje de que se envio
        setCorreo(limpio);
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
        <div className="olvido-fondo abierto" onClick={alClickFondo}>
            {/* la clase enviado esconde el form y muestra el mensaje (lo hace el css) */}
            <div className={enviado ? 'olvido-modal enviado' : 'olvido-modal'} role="dialog" aria-label="Forgot your password?">

                <div className="olvido-arriba">
                    <span className="olvido-icono">🔒</span>
                    <button type="button" className="olvido-cerrar" aria-label="Close" onClick={cerrar}>×</button>
                </div>

                <h3>Forgot your password?</h3>

                <form className="olvido-form" onSubmit={alEnviar}>
                    <p className="olvido-texto">
                        Enter the email you signed up with and we'll send you a link to create a new password.
                    </p>

                    <label htmlFor="olvido-correo">Email address</label>
                    {/* al escribir guardo el correo y quito el error */}
                    <input
                        type="text"
                        id="olvido-correo"
                        className={hayError ? 'olvido-input olvido-error' : 'olvido-input'}
                        placeholder="you@email.com"
                        value={correo}
                        onChange={(evento) => {
                            setCorreo(evento.target.value);
                            setHayError(false);
                        }}
                        autoFocus
                    />
                    <p className={hayError ? 'olvido-mensaje-error visible' : 'olvido-mensaje-error'}>
                        Please write a valid email address.
                    </p>

                    <button type="submit" className="olvido-enviar">Send recovery link</button>
                </form>

                <div className="olvido-enviado">
                    <p className="olvido-texto">
                        We sent a recovery link to <span className="olvido-correo">{correo}</span>.
                        Check your inbox and follow the steps to create a new password.
                    </p>
                    <button type="button" className="olvido-enviar" onClick={cerrar}>Back to login</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;