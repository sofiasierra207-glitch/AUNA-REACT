import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import './createprofile.css';

// tipado de las props
// onCreate le pasa el correo al login para dejar la sesion iniciada (estado global de App)
interface CreateProfileProps {
    open: boolean;
    onClose: () => void;
    onCreate: (email: string) => void;
}

// los campos del formulario
interface ProfileForm {
    name: string;
    email: string;
    password: string;
    city: string;
}

// lo que guardo de la usuaria nueva (la contraseña no se guarda)
interface User {
    name: string;
    email: string;
    city: string;
}

// como empieza el formulario: todo vacio
const emptyForm: ProfileForm = {
    name: '',
    email: '',
    password: '',
    city: '',
};

// modal para crear una cuenta (se abre desde el Login)
// en js lo creaba con createElement e innerHTML, ahora es un componente
function CreateProfile({ open, onClose, onCreate }: CreateProfileProps) {
    // lo que voy escribiendo en los 4 campos, en un solo objeto
    const [formData, setFormData] = useState<ProfileForm>(emptyForm);

    // si acepte los terminos
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // mensaje de error y cual campo lo tiene ("" si ninguno)
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState('');

    // si ya cree el perfil muestro la bienvenida
    const [created, setCreated] = useState(false);

    // guardo la usuaria con el custom hook
    const [, setUser] = useLocalStorage<User | null>('aunaUser', null);

    // dejo todo limpio y cierro
    function close() {
        setFormData(emptyForm);
        setAcceptedTerms(false);
        setError('');
        setErrorField('');
        setCreated(false);
        onClose();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setFormData(emptyForm);
                setAcceptedTerms(false);
                setError('');
                setErrorField('');
                setCreated(false);
                onClose();
            }
        }

        document.addEventListener('keydown', handleKey);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // cuando escribo en un campo guardo el valor y quito el error
    // name dice cual campo es (nombre, correo, contrasena o ciudad)
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError('');
        setErrorField('');
    }

    // muestro el error en un campo
    function showError(field: string, message: string) {
        setErrorField(field);
        setError(message);
    }

    // cuando envio el formulario: reviso los campos uno por uno
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue

        const name = formData.name.trim();
        const email = formData.email.trim();
        const city = formData.city.trim();

        if (name === '') {
            showError('name', 'Write your full name.');
        } else if (!email.includes('@') || !email.includes('.')) {
            showError('email', 'Write a valid email address.');
        } else if (formData.password.length < 8) {
            showError('password', 'Your password needs at least 8 characters.');
        } else if (city === '') {
            showError('city', 'Tell us your city.');
        } else if (!acceptedTerms) {
            showError('', 'Accept the Terms and Community Guidelines to continue.');
        } else {
            // todo esta bien: guardo la usuaria y dejo la sesion iniciada
            setUser({ name: name, email: email, city: city });
            onCreate(email);

            // cambio el formulario por la bienvenida
            setCreated(true);
        }
    }

    // si doy click en el fondo oscuro (afuera de la caja) se cierra
    function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            close();
        }
    }

    // arma la clase del campo: si tiene error le agrego error
    function fieldClass(field: string) {
        return errorField === field ? 'create-input error' : 'create-input';
    }

    // si esta cerrado no muestro nada
    if (!open) return null;

    return (
        <div className="create-overlay open" onClick={handleBackdropClick}>
            {/* la clase done esconde el form y muestra la bienvenida (lo hace el css) */}
            <div className={created ? 'create-modal done' : 'create-modal'} role="dialog" aria-modal="true" aria-labelledby="create-title">

                <div className="create-header">
                    <h3 id="create-title">Create your profile</h3>
                    <button type="button" className="create-close" aria-label="Close" onClick={close}>×</button>
                </div>

                <form className="create-form" onSubmit={handleSubmit} noValidate>
                    <p className="create-text">Join the AÚNA community in a minute. Your data is protected, and you decide what to share.</p>

                    <label htmlFor="create-name">Full name</label>
                    <input type="text" id="create-name" name="name" className={fieldClass('name')}
                        placeholder="E.g. Valentina Torres" value={formData.name} onChange={handleChange} autoFocus />

                    <label htmlFor="create-email">Email address</label>
                    <input type="text" id="create-email" name="email" className={fieldClass('email')}
                        placeholder="you@email.com" value={formData.email} onChange={handleChange} />

                    <label htmlFor="create-password">Password</label>
                    <input type="password" id="create-password" name="password" className={fieldClass('password')}
                        placeholder="Create a secure password" value={formData.password} onChange={handleChange} />

                    <label htmlFor="create-city">City</label>
                    <input type="text" id="create-city" name="city" className={fieldClass('city')}
                        placeholder="Where are you joining from?" value={formData.city} onChange={handleChange} />

                    <label className="create-check">
                        <input
                            type="checkbox"
                            id="create-terms"
                            checked={acceptedTerms}
                            onChange={(event) => {
                                setAcceptedTerms(event.target.checked);
                                setError('');
                            }}
                        />
                        I accept AÚNA's Terms and Community Guidelines.
                    </label>

                    <p className="create-error">{error}</p>

                    <button type="submit" className="create-button">Create my profile</button>

                    {/* "Log in" cierra el modal y deja el login a la vista */}
                    <p className="create-login">
                        Already have an account?{' '}
                        <button type="button" className="create-login-button" onClick={close}>Log in</button>
                    </p>
                </form>

                <div className="create-welcome">
                    <p className="create-text">Welcome to AÚNA, {formData.name.trim()}! Your profile is ready.</p>
                    <Link to="/" className="create-button">Go to home</Link>
                </div>
            </div>
        </div>
    );
}

export default CreateProfile;