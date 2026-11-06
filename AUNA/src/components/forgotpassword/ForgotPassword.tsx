import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import './forgotpassword.css';

// tipado de las props: el login me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface ForgotPasswordProps {
    open: boolean;
    onClose: () => void;
}

// modal de "Forgot your password?" (se abre desde el Login)
// en js lo creaba con createElement e innerHTML, ahora es un componente
function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
    // el correo que voy escribiendo
    const [email, setEmail] = useState('');

    // true si el correo no es valido
    const [hasError, setHasError] = useState(false);

    // si ya envie el link muestro el mensaje de enviado
    const [sent, setSent] = useState(false);

    // dejo todo limpio y cierro
    function close() {
        setEmail('');
        setHasError(false);
        setSent(false);
        onClose();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setEmail('');
                setHasError(false);
                setSent(false);
                onClose();
            }
        }

        document.addEventListener('keydown', handleKey);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // cuando envio (click en Send recovery link o Enter)
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue

        // reviso que el correo tenga @ y un punto
        const clean = email.trim();
        if (!clean.includes('@') || !clean.includes('.')) {
            setHasError(true);
            return;
        }

        // muestro el mensaje de que se envio
        setEmail(clean);
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
        <div className="olvido-fondo abierto" onClick={handleBackdropClick}>
            {/* la clase enviado esconde el form y muestra el mensaje (lo hace el css) */}
            <div className={sent ? 'olvido-modal enviado' : 'olvido-modal'} role="dialog" aria-label="Forgot your password?">

                <div className="olvido-arriba">
                    <span className="olvido-icono">🔒</span>
                    <button type="button" className="olvido-cerrar" aria-label="Close" onClick={close}>×</button>
                </div>

                <h3>Forgot your password?</h3>

                <form className="olvido-form" onSubmit={handleSubmit}>
                    <p className="olvido-texto">
                        Enter the email you signed up with and we'll send you a link to create a new password.
                    </p>

                    <label htmlFor="olvido-correo">Email address</label>
                    {/* al escribir guardo el correo y quito el error */}
                    <input
                        type="text"
                        id="olvido-correo"
                        className={hasError ? 'olvido-input olvido-error' : 'olvido-input'}
                        placeholder="you@email.com"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setHasError(false);
                        }}
                        autoFocus
                    />
                    <p className={hasError ? 'olvido-mensaje-error visible' : 'olvido-mensaje-error'}>
                        Please write a valid email address.
                    </p>

                    <button type="submit" className="olvido-enviar">Send recovery link</button>
                </form>

                <div className="olvido-enviado">
                    <p className="olvido-texto">
                        We sent a recovery link to <span className="olvido-correo">{email}</span>.
                        Check your inbox and follow the steps to create a new password.
                    </p>
                    <button type="button" className="olvido-enviar" onClick={close}>Back to login</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;