import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import './createprofile.css';

// tipado de las props
// onCrear le pasa el correo al login para dejar la sesion iniciada (estado global de App)
interface CreateProfileProps {
    abierto: boolean;
    onCerrar: () => void;
    onCrear: (correo: string) => void;
}

// los campos del formulario
interface Datos {
    nombre: string;
    correo: string;
    contrasena: string;
    ciudad: string;
}

// lo que guardo de la usuaria nueva (la contraseña no se guarda)
interface Usuaria {
    nombre: string;
    correo: string;
    ciudad: string;
}

// como empieza el formulario: todo vacio
const formularioVacio: Datos = {
    nombre: '',
    correo: '',
    contrasena: '',
    ciudad: '',
};

// modal para crear una cuenta (se abre desde el Login)
// en js lo creaba con createElement e innerHTML, ahora es un componente
function CreateProfile({ abierto, onCerrar, onCrear }: CreateProfileProps) {
    // lo que voy escribiendo en los 4 campos, en un solo objeto
    const [datos, setDatos] = useState<Datos>(formularioVacio);

    // si acepte los terminos
    const [terminos, setTerminos] = useState(false);

    // mensaje de error y cual campo lo tiene ("" si ninguno)
    const [error, setError] = useState('');
    const [campoConError, setCampoConError] = useState('');

    // si ya cree el perfil muestro la bienvenida
    const [creado, setCreado] = useState(false);

    // guardo la usuaria con el custom hook
    const [, setUsuaria] = useLocalStorage<Usuaria | null>('aunaUser', null);

    // dejo todo limpio y cierro
    function cerrar() {
        setDatos(formularioVacio);
        setTerminos(false);
        setError('');
        setCampoConError('');
        setCreado(false);
        onCerrar();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!abierto) return;

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                setDatos(formularioVacio);
                setTerminos(false);
                setError('');
                setCampoConError('');
                setCreado(false);
                onCerrar();
            }
        }

        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', alPresionarTecla);
    }, [abierto, onCerrar]);

    // cuando escribo en un campo guardo el valor y quito el error
    // name dice cual campo es (nombre, correo, contrasena o ciudad)
    function alEscribir(evento: ChangeEvent<HTMLInputElement>) {
        const { name, value } = evento.target;
        setDatos({ ...datos, [name]: value });
        setError('');
        setCampoConError('');
    }

    // muestro el error en un campo
    function mostrarError(campo: string, mensaje: string) {
        setCampoConError(campo);
        setError(mensaje);
    }

    // cuando envio el formulario: reviso los campos uno por uno
    function alEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue

        const nombre = datos.nombre.trim();
        const correo = datos.correo.trim();
        const ciudad = datos.ciudad.trim();

        if (nombre === '') {
            mostrarError('nombre', 'Write your full name.');
        } else if (!correo.includes('@') || !correo.includes('.')) {
            mostrarError('correo', 'Write a valid email address.');
        } else if (datos.contrasena.length < 8) {
            mostrarError('contrasena', 'Your password needs at least 8 characters.');
        } else if (ciudad === '') {
            mostrarError('ciudad', 'Tell us your city.');
        } else if (!terminos) {
            mostrarError('', 'Accept the Terms and Community Guidelines to continue.');
        } else {
            // todo esta bien: guardo la usuaria y dejo la sesion iniciada
            setUsuaria({ nombre: nombre, correo: correo, ciudad: ciudad });
            onCrear(correo);

            // cambio el formulario por la bienvenida
            setCreado(true);
        }
    }

    // si doy click en el fondo oscuro (afuera de la caja) se cierra
    function alClickFondo(evento: MouseEvent<HTMLDivElement>) {
        if (evento.target === evento.currentTarget) {
            cerrar();
        }
    }

    // arma la clase del campo: si tiene error le agrego error
    function claseCampo(campo: string) {
        return campoConError === campo ? 'create-input error' : 'create-input';
    }

    // si esta cerrado no muestro nada
    if (!abierto) return null;

    return (
        <div className="create-overlay open" onClick={alClickFondo}>
            {/* la clase done esconde el form y muestra la bienvenida (lo hace el css) */}
            <div className={creado ? 'create-modal done' : 'create-modal'} role="dialog" aria-modal="true" aria-labelledby="create-title">

                <div className="create-header">
                    <h3 id="create-title">Create your profile</h3>
                    <button type="button" className="create-close" aria-label="Close" onClick={cerrar}>×</button>
                </div>

                <form className="create-form" onSubmit={alEnviar} noValidate>
                    <p className="create-text">Join the AÚNA community in a minute. Your data is protected, and you decide what to share.</p>

                    <label htmlFor="create-name">Full name</label>
                    <input type="text" id="create-name" name="nombre" className={claseCampo('nombre')}
                        placeholder="E.g. Valentina Torres" value={datos.nombre} onChange={alEscribir} autoFocus />

                    <label htmlFor="create-email">Email address</label>
                    <input type="text" id="create-email" name="correo" className={claseCampo('correo')}
                        placeholder="you@email.com" value={datos.correo} onChange={alEscribir} />

                    <label htmlFor="create-password">Password</label>
                    <input type="password" id="create-password" name="contrasena" className={claseCampo('contrasena')}
                        placeholder="Create a secure password" value={datos.contrasena} onChange={alEscribir} />

                    <label htmlFor="create-city">City</label>
                    <input type="text" id="create-city" name="ciudad" className={claseCampo('ciudad')}
                        placeholder="Where are you joining from?" value={datos.ciudad} onChange={alEscribir} />

                    <label className="create-check">
                        <input
                            type="checkbox"
                            id="create-terms"
                            checked={terminos}
                            onChange={(evento) => {
                                setTerminos(evento.target.checked);
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
                        <button type="button" className="create-login-button" onClick={cerrar}>Log in</button>
                    </p>
                </form>

                <div className="create-welcome">
                    <p className="create-text">Welcome to AÚNA, {datos.nombre.trim()}! Your profile is ready.</p>
                    <Link to="/" className="create-button">Go to home</Link>
                </div>
            </div>
        </div>
    );
}

export default CreateProfile;