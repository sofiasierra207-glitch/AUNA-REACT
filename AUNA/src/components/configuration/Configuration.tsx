import { useEffect, useState } from 'react';
import type { ChangeEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { supabase } from '../../supabaseClient';
import type { ProfileData } from '../../hooks/useProfile';
import './configuration.css';

// tipado de las props
// onLogout borra la sesion del estado global de App (lo hace el Header)
interface ConfigurationProps {
    open: boolean;
    email: string;                   // correo con la sesion abierta
    profile: ProfileData | null;     // su fila en profiles (Supabase)
    onProfileChange: () => void;     // vuelve a pedir el perfil despues de guardar
    onClose: () => void;
    onLogout: () => void;
}

// tipado de una fila de la cuenta: type dice si es texto, correo o contraseña
// column es la columna de la tabla profiles que cambia esa fila
interface AccountField {
    label: string;
    value: string;
    type: string;
    column: string;
}

// letras que puede tener un usuario (igual que en Create account)
const usernameLetters = 'abcdefghijklmnopqrstuvwxyz0123456789._';

// revisa que el usuario tenga de 3 a 30 letras y solo las permitidas
function isValidUsername(username: string) {
    if (username.length < 3 || username.length > 30) return false;
    return username.split('').every((letter) => usernameLetters.includes(letter));
}

// tipado de un interruptor de notificaciones o privacidad
interface Toggle {
    group: string;
    title: string;
    text: string;
    on: boolean;
}

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
function Configuration({ open, email, profile, onProfileChange, onClose, onLogout }: ConfigurationProps) {
    // filas de la cuenta: salen de su perfil en Supabase
    // la contraseña nunca se muestra: la fila solo tiene puntos
    const account: AccountField[] = [
        { label: 'Full name', value: profile ? profile.full_name : '', type: 'text', column: 'full_name' },
        { label: 'Username', value: profile ? profile.username : '', type: 'text', column: 'username' },
        { label: 'Bio', value: profile && profile.bio ? profile.bio : '', type: 'text', column: 'bio' },
        { label: 'Email address', value: email, type: 'email', column: '' },
        { label: 'Password', value: '', type: 'password', column: '' },
    ];

    // interruptores en estado
    const [toggles, setToggles] = useState<Toggle[]>(initialToggles);

    // error al guardar una fila (por ejemplo, usuario ocupado)
    const [rowError, setRowError] = useState('');

    // true mientras se sube la foto
    const [uploading, setUploading] = useState(false);

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

    // muestra el valor; si es contraseña muestra puntos; si está vacío invita a llenarlo
    function showValue(field: AccountField) {
        if (field.type === 'password') return '••••••••';
        if (field.value === '') return 'Add your ' + field.label.toLowerCase();
        return field.value;
    }

    // click en una fila
    // el nombre se edita en la misma fila
    // el correo y la contraseña abren el formulario seguro
    function startEdit(field: AccountField) {
        setSecureNotice('');
        setRowError('');
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

    // revisa la contraseña actual con Supabase Auth (iniciando sesion otra vez con ella)
    async function checkCurrentPassword() {
        const { error } = await supabase.auth.signInWithPassword({ email: email, password: currentPassword });
        return !error;
    }

    // Save del formulario seguro: revisa los campos y despues cambia en Supabase
    async function saveSecure() {
        if (currentPassword === '') {
            setSecureError('Write your current password.');
        } else if (secureChange === 'email') {
            const clean = newEmail.trim();
            if (!clean.includes('@') || !clean.includes('.')) {
                setSecureError('Write a valid email address.');
            } else if (!(await checkCurrentPassword())) {
                setSecureError('Your current password is not correct.');
            } else {
                // Supabase manda un enlace: el correo no cambia hasta que se confirme
                const { error } = await supabase.auth.updateUser({ email: clean });
                if (error) {
                    setSecureError(error.message);
                } else {
                    cancelSecure();
                    setSecureNotice('We sent a confirmation link to ' + clean + '. Your email will change once you confirm it.');
                }
            }
        } else if (newPassword.length < 8) {
            setSecureError('Your new password needs at least 8 characters.');
        } else if (newPassword === currentPassword) {
            setSecureError('Your new password must be different from the current one.');
        } else if (newPassword !== confirmPassword) {
            setSecureError("The new passwords don't match.");
        } else if (!(await checkCurrentPassword())) {
            setSecureError('Your current password is not correct.');
        } else {
            // Supabase guarda la contraseña nueva encriptada; en la app no se guarda en ninguna parte
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                setSecureError(error.message);
            } else {
                cancelSecure();
                setSecureNotice('Your password was updated.');
            }
        }
    }

    // guardo lo que escribi en su fila de profiles (Supabase)
    // si no cambio nada o queda vacio (menos la bio) no se guarda
    async function saveEdit() {
        const field = account.find((item) => item.label === editing);
        setEditing('');
        if (!field || !profile) return;

        let clean = editText.trim();
        if (clean === field.value) return;

        if (field.column === 'full_name' && clean === '') {
            setRowError('Your name cannot be empty.');
            return;
        }

        if (field.column === 'bio' && clean.length > 200) {
            setRowError('Your bio can have up to 200 characters.');
            return;
        }

        if (field.column === 'username') {
            // mismo formato que en Create account: minusculas, sin @ ni espacios
            clean = clean.toLowerCase().replace('@', '');
            if (!isValidUsername(clean)) {
                setRowError('Use 3 to 30 letters, numbers, dots or underscores, with no spaces.');
                return;
            }
            clean = '@' + clean;
            if (clean === field.value) return;

            // ¿ya lo tiene otra cuenta?
            const { data: taken } = await supabase.from('profiles').select('id').eq('username', clean).maybeSingle();
            if (taken) {
                setRowError('That username is already taken.');
                return;
            }
        }

        // RLS solo deja cambiar la fila propia (id = la cuenta con sesion)
        const { error } = await supabase.from('profiles').update({ [field.column]: clean }).eq('id', profile.id);
        if (error) {
            setRowError('We could not save it. Try again.');
        } else {
            onProfileChange();
        }
    }

    // foto de perfil: se sube al bucket avatars, dentro de la carpeta de la usuaria
    async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file || !profile) return;

        if (!file.type.startsWith('image/')) {
            setRowError('Choose an image file.');
            return;
        }

        setRowError('');
        setUploading(true);

        // la ruta empieza con su id, si no Supabase la rechaza (regla de Storage)
        // Date.now() hace un nombre nuevo cada vez, asi no queda la foto vieja en cache
        const path = profile.id + '/' + Date.now() + '-' + file.name;
        const { error } = await supabase.storage.from('avatars').upload(path, file);

        if (error) {
            setUploading(false);
            setRowError('We could not upload your photo. Try again.');
            return;
        }

        // URL publica de la foto para guardarla en su perfil
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.id);

        setUploading(false);
        onProfileChange();
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
                    {/* foto de perfil: el label abre el selector de archivos (el input esta escondido) */}
                    <div className="settings-photo">
                        {profile && profile.avatar_url
                            ? <img className="settings-photo-img" src={profile.avatar_url} alt="Your profile photo" />
                            : <span className="settings-photo-img">{profile ? profile.full_name.charAt(0).toUpperCase() : ''}</span>}
                        <div>
                            <span className="settings-label">Profile photo</span>
                            <label className="settings-photo-button">
                                {uploading ? 'Uploading...' : 'Change photo'}
                                <input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} hidden />
                            </label>
                        </div>
                    </div>

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

                    {/* error al guardar una fila o la foto */}
                    {rowError !== '' && <p className="settings-secure-error" role="status">{rowError}</p>}

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
