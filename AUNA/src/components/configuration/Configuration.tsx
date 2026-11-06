import { useEffect, useState } from 'react';
import type { KeyboardEvent as TeclaReact, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './configuration.css';

// tipado de las props
// onLogout borra la sesion del estado global de App (lo hace el Header)
interface ConfigurationProps {
    abierto: boolean;
    onCerrar: () => void;
    onLogout: () => void;
}

// tipado de una fila de la cuenta: type dice si es texto, correo o contraseña
interface DatoCuenta {
    label: string;
    value: string;
    type: string;
}

// tipado de un interruptor de notificaciones o privacidad
interface Interruptor {
    group: string;
    title: string;
    text: string;
    on: boolean;
}

// datos de la cuenta (como en el figma)
// la contraseña no se guarda en el codigo: la fila solo muestra puntos
const cuentaInicial: DatoCuenta[] = [
    { label: 'Full name', value: 'Valentina Torres', type: 'text' },
    { label: 'Email address', value: 'valen.torres@email.com', type: 'email' },
    { label: 'Password', value: '', type: 'password' },
];

// interruptores de notificaciones y privacidad
const interruptoresIniciales: Interruptor[] = [
    { group: 'Notifications', title: 'Push notifications', text: 'Alerts for likes, comments, and messages', on: true },
    { group: 'Notifications', title: 'Weekly emails', text: 'A weekly recap of your community', on: false },
    { group: 'Notifications', title: 'Wellness reminders', text: 'A gentle message whenever you need it', on: true },
    { group: 'Privacy', title: 'Public profile', text: 'Other users can see your profile', on: true },
    { group: 'Privacy', title: 'Anonymous mode by default', text: "Your posts won't show your name", on: true },
];

// ventana de Settings (se abre desde el boton "Edit profile" del perfil)
// en js la armaba con createElement e innerHTML, ahora es un componente
function Configuration({ abierto, onCerrar, onLogout }: ConfigurationProps) {
    // datos de la cuenta y de los interruptores en estado
    const [cuenta, setCuenta] = useState<DatoCuenta[]>(cuentaInicial);
    const [interruptores, setInterruptores] = useState<Interruptor[]>(interruptoresIniciales);

    // fila que estoy editando ("" si ninguna) y lo que escribo en ella
    const [editando, setEditando] = useState('');
    const [textoEditar, setTextoEditar] = useState('');

    // cambio seguro de correo o contraseña ("" si no hay ninguno abierto)
    // por seguridad no se editan en la fila: piden la contraseña actual
    const [cambioSeguro, setCambioSeguro] = useState('');
    const [correoNuevo, setCorreoNuevo] = useState('');
    const [actual, setActual] = useState('');           // contraseña actual
    const [nueva, setNueva] = useState('');             // contraseña nueva
    const [confirmar, setConfirmar] = useState('');     // contraseña nueva otra vez
    const [errorSeguro, setErrorSeguro] = useState('');
    const [avisoSeguro, setAvisoSeguro] = useState(''); // mensaje cuando sale bien

    // primer click en "Delete my account" pide confirmar
    const [confirmarBorrar, setConfirmarBorrar] = useState(false);

    // el perfil guardado por createprofile, para borrarlo al eliminar la cuenta
    const [, setUsuaria] = useLocalStorage<object | null>('aunaUser', null);

    // cierro el formulario seguro y borro lo que se escribio
    function cancelarSeguro() {
        setCambioSeguro('');
        setCorreoNuevo('');
        setActual('');
        setNueva('');
        setConfirmar('');
        setErrorSeguro('');
    }

    // cierro y dejo todo como al inicio
    function cerrar() {
        setEditando('');
        setConfirmarBorrar(false);
        cancelarSeguro();
        setAvisoSeguro('');
        onCerrar();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras la ventana esta abierta
    useEffect(() => {
        if (!abierto) return;

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                setEditando('');
                setConfirmarBorrar(false);
                onCerrar();
            }
        }

        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito el evento cuando se cierra la ventana
        return () => document.removeEventListener('keydown', alPresionarTecla);
    }, [abierto, onCerrar]);

    // muestra el valor; si es contraseña muestra puntos
    function mostrarValor(dato: DatoCuenta) {
        return dato.type === 'password' ? '••••••••' : dato.value;
    }

    // click en una fila
    // el nombre se edita en la misma fila
    // el correo y la contraseña abren el formulario seguro
    function empezarEditar(dato: DatoCuenta) {
        setAvisoSeguro('');
        if (dato.type === 'text') {
            if (editando !== dato.label) {
                setEditando(dato.label);
                setTextoEditar(dato.value);
            }
        } else if (cambioSeguro !== dato.type) {
            cancelarSeguro();
            setCambioSeguro(dato.type);
        }
    }

    // Save del formulario seguro: revisa los campos antes de cambiar algo
    // la contraseña actual solo se revisa que este escrita
    // (en la entrega final la revisa el servicio de autenticacion)
    function guardarSeguro() {
        if (actual === '') {
            setErrorSeguro('Write your current password.');
        } else if (cambioSeguro === 'email') {
            const limpio = correoNuevo.trim();
            if (!limpio.includes('@') || !limpio.includes('.')) {
                setErrorSeguro('Write a valid email address.');
            } else {
                // el correo no cambia hasta que se confirme desde el enlace
                cancelarSeguro();
                setAvisoSeguro('We sent a confirmation link to ' + limpio + '. Your email will change once you confirm it.');
            }
        } else if (nueva.length < 8) {
            setErrorSeguro('Your new password needs at least 8 characters.');
        } else if (nueva === actual) {
            setErrorSeguro('Your new password must be different from the current one.');
        } else if (nueva !== confirmar) {
            setErrorSeguro("The new passwords don't match.");
        } else {
            // la contraseña no se guarda en ninguna parte
            cancelarSeguro();
            setAvisoSeguro('Your password was updated.');
        }
    }

    // guardo lo que escribi; si esta vacio dejo el valor anterior
    // map crea un array nuevo cambiando solo la fila que edite
    function guardarEdicion() {
        const limpio = textoEditar.trim();
        if (limpio !== '') {
            setCuenta(cuenta.map((dato) => (dato.label === editando ? { ...dato, value: limpio } : dato)));
        }
        setEditando('');
    }

    // Enter guarda el cambio
    function alPresionarEnter(evento: TeclaReact<HTMLInputElement>) {
        if (evento.key === 'Enter') {
            guardarEdicion();
        }
    }

    // cambia un interruptor entre encendido y apagado (! lo invierte)
    function alternar(titulo: string) {
        setInterruptores(interruptores.map((item) => (item.title === titulo ? { ...item, on: !item.on } : item)));
    }

    // "Delete my account": el primer click pide confirmar, el segundo borra el perfil y cierra la sesion
    function borrarCuenta() {
        if (confirmarBorrar) {
            setUsuaria(null);
            setConfirmarBorrar(false);
            onLogout();
        } else {
            setConfirmarBorrar(true);
        }
    }

    // si doy click en el fondo oscuro (afuera de la caja) se cierra
    function alClickFondo(evento: MouseEvent<HTMLDivElement>) {
        if (evento.target === evento.currentTarget) {
            cerrar();
        }
    }

    // pinta los interruptores de un grupo (Notifications o Privacy)
    // filter deja solo los del grupo y map crea una fila por cada uno
    function filasDelGrupo(grupo: string) {
        return interruptores
            .filter((item) => item.group === grupo)
            .map((item) => (
                <div key={item.title} className="switch-row">
                    <div>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                    </div>
                    <button
                        type="button"
                        className={item.on ? 'switch on' : 'switch'}
                        role="switch"
                        aria-checked={item.on}
                        aria-label={item.title}
                        onClick={() => alternar(item.title)}
                    >
                        <span className="switch-dot"></span>
                    </button>
                </div>
            ));
    }

    // si esta cerrada no muestro nada
    if (!abierto) return null;

    return (
        <div className="settings-overlay open" onClick={alClickFondo}>
            <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">

                <div className="settings-header">
                    <h3 id="settings-title">Settings</h3>
                    <button type="button" className="settings-close" aria-label="Close" onClick={cerrar}>×</button>
                </div>

                <p className="settings-group">ACCOUNT</p>
                <div className="settings-account">
                    {/* una fila por dato; la que estoy editando lleva la clase editing (el css muestra el input) */}
                    {cuenta.map((dato) => (
                        <div
                            key={dato.label}
                            className={editando === dato.label ? 'settings-row editing' : 'settings-row'}
                            onClick={() => empezarEditar(dato)}
                        >
                            <span className="settings-label">{dato.label}</span>
                            <span className="settings-value">{mostrarValor(dato)}</span>
                            {editando === dato.label && (
                                <input
                                    className="settings-input"
                                    type={dato.type}
                                    aria-label={dato.label}
                                    value={textoEditar}
                                    onChange={(evento) => setTextoEditar(evento.target.value)}
                                    onKeyDown={alPresionarEnter}
                                    onBlur={guardarEdicion}
                                    autoFocus
                                />
                            )}
                            <span className="settings-arrow">›</span>
                        </div>
                    ))}

                    {/* formulario seguro: solo se ve si toque el correo o la contraseña */}
                    {cambioSeguro !== '' && (
                        <div className="settings-secure">
                            <p className="settings-secure-title">
                                {cambioSeguro === 'email' ? 'Change your email' : 'Change your password'}
                            </p>

                            {/* el correo nuevo solo se pide si cambio el correo */}
                            {cambioSeguro === 'email' && (
                                <input
                                    className="settings-secure-input"
                                    type="email"
                                    placeholder="New email address"
                                    aria-label="New email address"
                                    value={correoNuevo}
                                    onChange={(evento) => { setCorreoNuevo(evento.target.value); setErrorSeguro(''); }}
                                />
                            )}

                            <input
                                className="settings-secure-input"
                                type="password"
                                placeholder="Current password"
                                aria-label="Current password"
                                value={actual}
                                onChange={(evento) => { setActual(evento.target.value); setErrorSeguro(''); }}
                            />

                            {/* la contraseña nueva se escribe dos veces para confirmarla */}
                            {cambioSeguro === 'password' && (
                                <>
                                    <input
                                        className="settings-secure-input"
                                        type="password"
                                        placeholder="New password (8+ characters)"
                                        aria-label="New password"
                                        value={nueva}
                                        onChange={(evento) => { setNueva(evento.target.value); setErrorSeguro(''); }}
                                    />
                                    <input
                                        className="settings-secure-input"
                                        type="password"
                                        placeholder="Confirm new password"
                                        aria-label="Confirm new password"
                                        value={confirmar}
                                        onChange={(evento) => { setConfirmar(evento.target.value); setErrorSeguro(''); }}
                                    />
                                </>
                            )}

                            <p className="settings-secure-error" role="status">{errorSeguro}</p>

                            <div className="settings-secure-actions">
                                <button type="button" className="settings-secure-cancel" onClick={cancelarSeguro}>Cancel</button>
                                <button type="button" className="settings-secure-save" onClick={guardarSeguro}>Save</button>
                            </div>
                        </div>
                    )}

                    {/* mensaje cuando el cambio sale bien */}
                    {avisoSeguro !== '' && <p className="settings-secure-ok" role="status">{avisoSeguro}</p>}
                </div>

                <p className="settings-group">NOTIFICATIONS</p>
                <div className="settings-switches">{filasDelGrupo('Notifications')}</div>

                <p className="settings-group">PRIVACY</p>
                <div className="settings-switches">{filasDelGrupo('Privacy')}</div>

                <button type="button" className="settings-logout" onClick={onLogout}>Log out</button>
                <button
                    type="button"
                    className={confirmarBorrar ? 'settings-delete confirm' : 'settings-delete'}
                    onClick={borrarCuenta}
                >
                    {confirmarBorrar ? 'Click again to delete your account' : 'Delete my account'}
                </button>
            </div>
        </div>
    );
}

export default Configuration;
