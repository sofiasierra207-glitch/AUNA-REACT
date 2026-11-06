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
const cuentaInicial: DatoCuenta[] = [
    { label: 'Full name', value: 'Valentina Torres', type: 'text' },
    { label: 'Email address', value: 'valen.torres@email.com', type: 'email' },
    { label: 'Password', value: 'auna2026', type: 'password' },
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

    // primer click en "Delete my account" pide confirmar
    const [confirmarBorrar, setConfirmarBorrar] = useState(false);

    // el perfil guardado por createprofile, para borrarlo al eliminar la cuenta
    const [, setUsuaria] = useLocalStorage<object | null>('aunaUser', null);

    // cierro y dejo "Delete" como al inicio
    function cerrar() {
        setEditando('');
        setConfirmarBorrar(false);
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

    // click en una fila: empiezo a editarla con su valor actual
    function empezarEditar(dato: DatoCuenta) {
        if (editando !== dato.label) {
            setEditando(dato.label);
            setTextoEditar(dato.value);
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
