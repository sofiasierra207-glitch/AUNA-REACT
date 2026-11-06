import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './verified.css';

// tipado de las props: la pagina me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface VerifiedProps {
    abierto: boolean;
    onCerrar: () => void;
}

// tipado de la postulacion que guardo
interface Postulacion {
    nombre: string;
    area: string;
    correo: string;
    experiencia: string;
}

// como empieza el formulario: todos los campos vacios
const formularioVacio: Postulacion = {
    nombre: '',
    area: '',
    correo: '',
    experiencia: '',
};

// modal para postularme a verificacion
// en js lo creaba con createElement e innerHTML, ahora es un componente
function Verified({ abierto, onCerrar }: VerifiedProps) {
    // lo que voy escribiendo en los 4 campos, en un solo objeto
    const [datos, setDatos] = useState<Postulacion>(formularioVacio);

    // nombres de los campos que tienen error (para pintarlos de rosado)
    const [camposConError, setCamposConError] = useState<string[]>([]);

    // mensaje de error de abajo ("" si no hay error)
    const [error, setError] = useState('');

    // si ya envie la postulacion muestro el mensaje de gracias
    const [enviado, setEnviado] = useState(false);

    // guardo la postulacion con el custom hook (antes era localStorage.setItem)
    const [, setPostulacion] = useLocalStorage<Postulacion | null>('aunaVerificacion', null);

    // cierro el modal y lo dejo limpio para la proxima vez
    function cerrar() {
        setDatos(formularioVacio);
        setCamposConError([]);
        setError('');
        setEnviado(false);
        onCerrar();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!abierto) return;

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                setDatos(formularioVacio);
                setCamposConError([]);
                setError('');
                setEnviado(false);
                onCerrar();
            }
        }

        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', alPresionarTecla);
    }, [abierto, onCerrar]);

    // cuando escribo en un campo guardo el valor y le quito el error a ese campo
    // name dice cual campo es (nombre, area, correo o experiencia)
    function alEscribir(evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = evento.target;
        setDatos({ ...datos, [name]: value });
        setCamposConError(camposConError.filter((campo) => campo !== name));
    }

    // cuando envio la postulacion (click en Submit application)
    function alEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault(); // evito que la pagina se recargue

        // reviso cuales campos estan vacios
        // Object.keys me da los nombres de los campos del objeto
        const vacios = Object.keys(datos).filter(
            (campo) => datos[campo as keyof Postulacion].trim() === '',
        );

        // si hay alguno vacio no envio
        if (vacios.length > 0) {
            setCamposConError(vacios);
            setError('Please fill in all the fields.');
            return;
        }

        // reviso que el correo tenga @ y un punto
        const correo = datos.correo.trim();
        if (!correo.includes('@') || !correo.includes('.')) {
            setCamposConError(['correo']);
            setError('Please write a valid email address.');
            return;
        }

        // guardo la postulacion sin espacios de mas
        setPostulacion({
            nombre: datos.nombre.trim(),
            area: datos.area.trim(),
            correo: correo,
            experiencia: datos.experiencia.trim(),
        });

        // escondo el form y muestro el mensaje de gracias
        setError('');
        setEnviado(true);
    }

    // si doy click en el fondo oscuro (afuera de la caja blanca) se cierra
    function alClickFondo(evento: MouseEvent<HTMLDivElement>) {
        if (evento.target === evento.currentTarget) {
            cerrar();
        }
    }

    // arma la clase del campo: si tiene error le agrego verif-error
    function claseCampo(nombre: string) {
        return camposConError.includes(nombre) ? 'verif-input verif-error' : 'verif-input';
    }

    // si esta cerrado no muestro nada
    if (!abierto) return null;

    return (
        <div className="verif-fondo" onClick={alClickFondo}>
            <div className="verif-modal" role="dialog" aria-label="Apply to get verified">

                <div className="verif-header">
                    <h3>Apply to get verified</h3>
                    <button type="button" className="verif-cerrar" aria-label="Close" onClick={cerrar}>×</button>
                </div>

                {/* si ya envie muestro el mensaje de gracias, si no el formulario */}
                {enviado ? (
                    <div className="verif-enviado">
                        <p className="verif-texto">
                            Thanks for applying! We'll review your application and write to your email soon.
                        </p>
                        <button type="button" className="verif-enviar" onClick={cerrar}>Done</button>
                    </div>
                ) : (
                    <>
                        <p className="verif-texto">
                            Tell us about your experience in health, law, or education. Our team reviews
                            every application before activating your verified profile.
                        </p>

                        {/* htmlFor del label tiene que ser igual al id del input,
                            asi al darle click al texto se selecciona el campo */}
                        <form className="verif-form" onSubmit={alEnviar}>
                            <div className="verif-campo">
                                <label htmlFor="verif-nombre">Full name</label>
                                <input
                                    type="text"
                                    id="verif-nombre"
                                    name="nombre"
                                    className={claseCampo('nombre')}
                                    placeholder="E.g. Valentina Torres"
                                    value={datos.nombre}
                                    onChange={alEscribir}
                                    autoFocus
                                />
                            </div>

                            <div className="verif-campo">
                                <label htmlFor="verif-area">Professional field</label>
                                <input
                                    type="text"
                                    id="verif-area"
                                    name="area"
                                    className={claseCampo('area')}
                                    placeholder="E.g. Psychology, Labor law, Early childhood education..."
                                    value={datos.area}
                                    onChange={alEscribir}
                                />
                            </div>

                            <div className="verif-campo">
                                <label htmlFor="verif-correo">Email address</label>
                                <input
                                    type="text"
                                    id="verif-correo"
                                    name="correo"
                                    className={claseCampo('correo')}
                                    placeholder="you@email.com"
                                    value={datos.correo}
                                    onChange={alEscribir}
                                />
                            </div>

                            <div className="verif-campo">
                                <label htmlFor="verif-experiencia">Tell us about your experience</label>
                                <textarea
                                    id="verif-experiencia"
                                    name="experiencia"
                                    className={claseCampo('experiencia')}
                                    placeholder="Years of experience, certifications, who you'd like to support..."
                                    value={datos.experiencia}
                                    onChange={alEscribir}
                                />
                            </div>

                            {/* el mensaje de error solo sale si hay error */}
                            {error && <p className="verif-mensaje-error">{error}</p>}

                            <button type="submit" className="verif-enviar">Submit application</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Verified;