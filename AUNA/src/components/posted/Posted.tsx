import { useEffect } from 'react';
import './posted.css';

import checkIcon from '../../assets/icons/check.svg';

// Datos que recibe la ventana
// open dice si se ve y onClose es la función de la página para cerrarla
interface PostedProps {
    open: boolean;
    onClose: () => void;
}

// Ventana que aparece cuando se publica un post
function Posted({ open, onClose }: PostedProps) {

    // Tecla Escape: cierra la ventana
    // Solo escucha el teclado mientras la ventana está abierta
    useEffect(() => {
        if (!open) {
            return;
        }

        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKey);

        // Limpieza: deja de escuchar el teclado cuando se cierra
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    // "View post": cierra la ventana y baja hasta el primer post
    function handleViewPost() {
        onClose();

        const firstPost = document.querySelector(".post-card");
        if (firstPost) {
            firstPost.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    // Si está cerrada no se muestra nada
    if (!open) {
        return null;
    }

    return (
        <div className="posted-overlay">
            <div className="posted-modal" role="dialog" aria-modal="true" aria-labelledby="posted-title">
                <span className="posted-icon">
                    <img src={checkIcon} alt="" />
                </span>
                <h3 id="posted-title">Posted successfully!</h3>
                <p>Your post is now visible to the community.</p>

                {/* autoFocus pone el foco en el botón al abrir */}
                <button type="button" className="posted-button" autoFocus onClick={handleViewPost}>
                    View post
                </button>
            </div>
        </div>
    );
}

export default Posted;
