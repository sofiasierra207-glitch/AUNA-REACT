import { useEffect, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './configuration.css';

// tipado de las props
// onLogout borra la sesion del estado global de App (lo hace el Header)
interface ConfigurationProps {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
}

// tipado de una fila de la cuenta: type dice si es texto, correo o contraseña
interface AccountField {
    label: string;
    value: string;
    type: string;
}

// tipado de un interruptor de notificaciones o privacidad
interface Toggle {
    group: string;
    title: string;
    text: string;
    on: boolean;
}

// datos de la cuenta (como en el figma)
// la contraseña no se guarda en el codigo: la fila solo muestra puntos
const initialAccount: AccountField[] = [
    { label: 'Full name', value: 'Valentina Torres', type: 'text' },
    { label: 'Email address', value: 'valen.torres@email.com', type: 'email' },
    { label: 'Password', value: '', type: 'password' },
];

// interruptores de notificaciones y privacidad
const initialToggles: Toggle[] = [
    { group: 'Notifications', title: 'Push notifications', text: 'Alerts for likes, comments, and messages', on: true },
    { group: 'Notifications', title: 'Weekly emails', text: 'A weekly recap of your community', on: false },
    { group: 'Notifications', title: 'Wellness reminders', text: 'A gentle message whenever you need it', on: true },
    { group: 'Privacy', title: 'Public profile', text: 'Other users can see your profile', on: true },
    { group: 'Privacy', title: 'Anonymous mode by default', text: "Your posts won't show your name", on: true },
];

// ventana de Settings (se abre desde el boton "Edit profile" del perfil)
// en js la armaba con createElement e innerHTML, ahora es un componente
function Configuration({ open, onClose, onLogout }: ConfigurationProps) {
    // datos de la cuenta y de los interruptores en estado
    const [account, setAccount] = useState<AccountField[]>(initialAccount);
    const [toggles, setToggles] = useState<Toggle[]>(initialToggles);

    // fila que estoy editando ("" si ninguna) y lo que escribo en ella
    const [editing, setEditing] = useState('');
    const [editText, setEditText] = useState('');

    // cambio seguro de correo o contraseña ("" si no hay ninguno abierto)
    // por seguridad no se editan en la fila: piden la contraseña actual
    const [secureChange, setSecureChange] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');           // contraseña actual
    const [newPassword, setNewPassword] = useState('');             // contraseña nueva
    const [confirmPassword, setConfirmPassword] = useState('');     // contraseña nueva otra vez
    const [secureError, setSecureError] = useState('');
    const [secureNotice, setSecureNotice] = useState(''); // mensaje cuando sale bien

    // primer click en "Delete my account" pide confirmar
    const [confirmDelete, setConfirmDelete] = useState(false);

    // el perfil guardado por createprofile, para borrarlo al eliminar la cuenta
    const [, setUser] = useLocalStorage<object | null>('aunaUser', null);

    // cierro el formulario seguro y borro lo que se escribio
    function cancelSecure() {
        setSecureChange('');
        setNewEmail('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSecureError('');
    }

    // cierro y dejo todo como al inicio
    function close() {
        setEditing('');
        setConfirmDelete(false);
        cancelSecure();
        setSecureNotice('');
        onClose();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras la ventana esta abierta
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setEditing('');
                setConfirmDelete(false);
                onClose();
            }
        }

        document.addEventListener('keydown', handleKey);

        // limpieza: quito el evento cuando se cierra la ventana
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // muestra el valor; si es contraseña muestra puntos
    function showValue(field: AccountField) {
        return field.type === 'password' ? '••••••••' : field.value;
    }

    // click en una fila
    // el nombre se edita en la misma fila
    // el correo y la contraseña abren el formulario seguro
    function startEdit(field: AccountField) {
        setSecureNotice('');
        if (field.type === 'text') {
            if (editing !== field.label) {
                setEditing(field.label);
                setEditText(field.value);
            }
        } else if (secureChange !== field.type) {
            cancelSecure();
            setSecureChange(field.type);
        }
    }

    // Save del formulario seguro: revisa los campos antes de cambiar algo
    // la contraseña actual solo se revisa que este escrita
    // (en la entrega final la revisa el servicio de autenticacion)
    function saveSecure() {
        if (currentPassword === '') {
            setSecureError('Write your current password.');
        } else if (secureChange === 'email') {
            const clean = newEmail.trim();
            if (!clean.includes('@') || !clean.includes('.')) {
                setSecureError('Write a valid email address.');
            } else {
                // el correo no cambia hasta que se confirme desde el enlace
                cancelSecure();
                setSecureNotice('We sent a confirmation link to ' + clean + '. Your email will change once you confirm it.');
            }
        } else if (newPassword.length < 8) {
            setSecureError('Your new password needs at least 8 characters.');
        } else if (newPassword === currentPassword) {
            setSecureError('Your new password must be different from the current one.');
        } else if (newPassword !== confirmPassword) {
            setSecureError("The new passwords don't match.");
        } else {
            // la contraseña no se guarda en ninguna parte
            cancelSecure();
            setSecureNotice('Your password was updated.');
        }
    }

    // guardo lo que escribi; si esta vacio dejo el valor anterior
    // map crea un array nuevo cambiando solo la fila que edite
    function saveEdit() {
        const clean = editText.trim();
        if (clean !== '') {
            setAccount(account.map((field) => (field.label === editing ? { ...field, value: clean } : field)));
        }
        setEditing('');
    }

    // Enter guarda el cambio
    function handleEnter(event: ReactKeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            saveEdit();
        }
    }

    // cambia un interruptor entre encendido y apagado (! lo invierte)
    function toggle(title: string) {
        setToggles(toggles.map((item) => (item.title === title ? { ...item, on: !item.on } : item)));
    }

    // "Delete my account": el primer click pide confirmar, el segundo borra el perfil y cierra la sesion
    function deleteAccount() {
        if (confirmDelete) {
            setUser(null);
            setConfirmDelete(false);
            onLogout();
        } else {
            setConfirmDelete(true);
        }
    }

    // si doy click en el fondo oscuro (afuera de la caja) se cierra
    function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            close();
        }
    }

    // pinta los interruptores de un grupo (Notifications o Privacy)
    // filter deja solo los del grupo y map crea una fila por cada uno
    function groupRows(groupName: string) {
        return toggles
            .filter((item) => item.group === groupName)
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
                        onClick={() => toggle(item.title)}
                    >
                        <span className="switch-dot"></span>
                    </button>
                </div>
            ));
    }

    // si esta cerrada no muestro nada
    if (!open) return null;

    return (
        <div className="settings-overlay open" onClick={handleBackdropClick}>
            <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">

                <div className="settings-header">
                    <h3 id="settings-title">Settings</h3>
                    <button type="button" className="settings-close" aria-label="Close" onClick={close}>×</button>
                </div>

                <p className="settings-group">ACCOUNT</p>
                <div className="settings-account">
                    {/* una fila por dato; la que estoy editando lleva la clase editing (el css muestra el input) */}
                    {account.map((field) => (
                        <div
                            key={field.label}
                            className={editing === field.label ? 'settings-row editing' : 'settings-row'}
                            onClick={() => startEdit(field)}
                        >
                            <span className="settings-label">{field.label}</span>
                            <span className="settings-value">{showValue(field)}</span>
                            {editing === field.label && (
                                <input
                                    className="settings-input"
                                    type={field.type}
                                    aria-label={field.label}
                                    value={editText}
                                    onChange={(event) => setEditText(event.target.value)}
                                    onKeyDown={handleEnter}
                                    onBlur={saveEdit}
                                    autoFocus
                                />
                            )}
                            <span className="settings-arrow">›</span>
                        </div>
                    ))}

                    {/* formulario seguro: solo se ve si toque el correo o la contraseña */}
                    {secureChange !== '' && (
                        <div className="settings-secure">
                            <p className="settings-secure-title">
                                {secureChange === 'email' ? 'Change your email' : 'Change your password'}
                            </p>

                            {/* el correo nuevo solo se pide si cambio el correo */}
                            {secureChange === 'email' && (
                                <input
                                    className="settings-secure-input"
                                    type="email"
                                    placeholder="New email address"
                                    aria-label="New email address"
                                    value={newEmail}
                                    onChange={(event) => { setNewEmail(event.target.value); setSecureError(''); }}
                                />
                            )}

                            <input
                                className="settings-secure-input"
                                type="password"
                                placeholder="Current password"
                                aria-label="Current password"
                                value={currentPassword}
                                onChange={(event) => { setCurrentPassword(event.target.value); setSecureError(''); }}
                            />

                            {/* la contraseña nueva se escribe dos veces para confirmarla */}
                            {secureChange === 'password' && (
                                <>
                                    <input
                                        className="settings-secure-input"
                                        type="password"
                                        placeholder="New password (8+ characters)"
                                        aria-label="New password"
                                        value={newPassword}
                                        onChange={(event) => { setNewPassword(event.target.value); setSecureError(''); }}
                                    />
                                    <input
                                        className="settings-secure-input"
                                        type="password"
                                        placeholder="Confirm new password"
                                        aria-label="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(event) => { setConfirmPassword(event.target.value); setSecureError(''); }}
                                    />
                                </>
                            )}

                            <p className="settings-secure-error" role="status">{secureError}</p>

                            <div className="settings-secure-actions">
                                <button type="button" className="settings-secure-cancel" onClick={cancelSecure}>Cancel</button>
                                <button type="button" className="settings-secure-save" onClick={saveSecure}>Save</button>
                            </div>
                        </div>
                    )}

                    {/* mensaje cuando el cambio sale bien */}
                    {secureNotice !== '' && <p className="settings-secure-ok" role="status">{secureNotice}</p>}
                </div>

                <p className="settings-group">NOTIFICATIONS</p>
                <div className="settings-switches">{groupRows('Notifications')}</div>

                <p className="settings-group">PRIVACY</p>
                <div className="settings-switches">{groupRows('Privacy')}</div>

                <button type="button" className="settings-logout" onClick={onLogout}>Log out</button>
                <button
                    type="button"
                    className={confirmDelete ? 'settings-delete confirm' : 'settings-delete'}
                    onClick={deleteAccount}
                >
                    {confirmDelete ? 'Click again to delete your account' : 'Delete my account'}
                </button>
            </div>
        </div>
    );
}

export default Configuration;
