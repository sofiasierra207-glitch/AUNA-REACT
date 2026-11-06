import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './verified.css';

// tipado de las props: la pagina me dice si estoy abierto
// y me pasa la funcion para cerrarme
interface VerifiedProps {
    open: boolean;
    onClose: () => void;
}

// tipado de la postulacion que guardo
interface Application {
    name: string;
    area: string;
    email: string;
    experience: string;
}

// como empieza el formulario: todos los campos vacios
const emptyForm: Application = {
    name: '',
    area: '',
    email: '',
    experience: '',
};

// modal para postularme a verificacion
// en js lo creaba con createElement e innerHTML, ahora es un componente
function Verified({ open, onClose }: VerifiedProps) {
    // lo que voy escribiendo en los 4 campos, en un solo objeto
    const [formData, setFormData] = useState<Application>(emptyForm);

    // nombres de los campos que tienen error (para pintarlos de rosado)
    const [errorFields, setErrorFields] = useState<string[]>([]);

    // mensaje de error de abajo ("" si no hay error)
    const [error, setError] = useState('');

    // si ya envie la postulacion muestro el mensaje de gracias
    const [sent, setSent] = useState(false);

    // guardo la postulacion con el custom hook (antes era localStorage.setItem)
    const [, setApplication] = useLocalStorage<Application | null>('aunaVerificacion', null);

    // cierro el modal y lo dejo limpio para la proxima vez
    function close() {
        setFormData(emptyForm);
        setErrorFields([]);
        setError('');
        setSent(false);
        onClose();
    }

    // cerrar con la tecla Escape
    // solo escucho el teclado mientras el modal esta abierto
    useEffect(() => {
        if (!open) return;

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setFormData(emptyForm);
                setErrorFields([]);
                setError('');
                setSent(false);
                onClose();
            }
        }

        document.addEventListener('keydown', handleKey);

        // limpieza: quito el evento cuando se cierra el modal
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // cuando escribo en un campo guardo el valor y le quito el error a ese campo
    // name dice cual campo es (nombre, area, correo o experiencia)
    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrorFields(errorFields.filter((field) => field !== name));
    }

    // cuando envio la postulacion (click en Submit application)
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); // evito que la pagina se recargue

        // reviso cuales campos estan vacios
        // Object.keys me da los nombres de los campos del objeto
        const emptyFields = Object.keys(formData).filter(
            (field) => formData[field as keyof Application].trim() === '',
        );

        // si hay alguno vacio no envio
        if (emptyFields.length > 0) {
            setErrorFields(emptyFields);
            setError('Please fill in all the fields.');
            return;
        }

        // reviso que el correo tenga @ y un punto
        const email = formData.email.trim();
        if (!email.includes('@') || !email.includes('.')) {
            setErrorFields(['email']);
            setError('Please write a valid email address.');
            return;
        }

        // guardo la postulacion sin espacios de mas
        setApplication({
            name: formData.name.trim(),
            area: formData.area.trim(),
            email: email,
            experience: formData.experience.trim(),
        });

        // escondo el form y muestro el mensaje de gracias
        setError('');
        setSent(true);
    }

    // si doy click en el fondo oscuro (afuera de la caja blanca) se cierra
    function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            close();
        }
    }

    // arma la clase del campo: si tiene error le agrego verif-error
    function fieldClass(name: string) {
        return errorFields.includes(name) ? 'verif-input verif-error' : 'verif-input';
    }

    // si esta cerrado no muestro nada
    if (!open) return null;

    return (
        <div className="verif-fondo" onClick={handleBackdropClick}>
            <div className="verif-modal" role="dialog" aria-label="Apply to get verified">

                <div className="verif-header">
                    <h3>Apply to get verified</h3>
                    <button type="button" className="verif-cerrar" aria-label="Close" onClick={close}>×</button>
                </div>

                {/* si ya envie muestro el mensaje de gracias, si no el formulario */}
                {sent ? (
                    <div className="verif-enviado">
                        <p className="verif-texto">
                            Thanks for applying! We'll review your application and write to your email soon.
                        </p>
                        <button type="button" className="verif-enviar" onClick={close}>Done</button>
                    </div>
                ) : (
                    <>
                        <p className="verif-texto">
                            Tell us about your experience in health, law, or education. Our team reviews
                            every application before activating your verified profile.
                        </p>

                        {/* htmlFor del label tiene que ser igual al id del input,
                            asi al darle click al texto se selecciona el campo */}
                        <form className="verif-form" onSubmit={handleSubmit}>
                            <div className="verif-campo">
                                <label htmlFor="verif-nombre">Full name</label>
                                <input
                                    type="text"
                                    id="verif-nombre"
                                    name="name"
                                    className={fieldClass('name')}
                                    placeholder="E.g. Valentina Torres"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </div>

                            <div className="verif-campo">
                                <label htmlFor="verif-area">Professional field</label>
                                <input
                                    type="text"
                                    id="verif-area"
                                    name="area"
                                    className={fieldClass('area')}
                                    placeholder="E.g. Psychology, Labor law, Early childhood education..."
                                    value={formData.area}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="verif-campo">
                                <label htmlFor="verif-correo">Email address</label>
                                <input
                                    type="text"
                                    id="verif-correo"
                                    name="email"
                                    className={fieldClass('email')}
                                    placeholder="you@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="verif-campo">
                                <label htmlFor="verif-experiencia">Tell us about your experience</label>
                                <textarea
                                    id="verif-experiencia"
                                    name="experience"
                                    className={fieldClass('experience')}
                                    placeholder="Years of experience, certifications, who you'd like to support..."
                                    value={formData.experience}
                                    onChange={handleChange}
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