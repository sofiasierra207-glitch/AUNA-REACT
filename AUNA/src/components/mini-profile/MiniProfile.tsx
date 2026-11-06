import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './mini-profile.css';

// datos de la usuaria que salen arriba del menu (como en el figma)
const profileUser = {
    name: 'Valentina Torres',
    user: '@valen.torres',
};

// tipado de las props: el Header me dice si estoy abierto
// y me pasa que hacer en cada opcion
interface MiniProfileProps {
    open: boolean;
    onClose: () => void;
    onViewProfile: () => void;   // abre la ventana del perfil (profile de Anny)
    onSettings: () => void;     // abre Settings (configuration de Cami)
    onLogout: () => void;      // cierra la sesion (estado global de App)
}

// mini perfil: menu que sale debajo del boton de perfil del header
// en js lo creaba con createElement e innerHTML, ahora es un componente
function MiniProfile({ open, onClose, onViewProfile, onSettings, onLogout }: MiniProfileProps) {
    // la inicial para el circulo: charAt(0) es la primera letra del nombre
    const initial = profileUser.name.charAt(0);

    // click afuera del menu o tecla Escape: se cierra
    // solo escucho mientras el menu esta abierto
    useEffect(() => {
        if (!open) return;

        function handleClick(event: MouseEvent) {
            // closest revisa si el click fue dentro del menu o en el boton de perfil
            const element = event.target as HTMLElement;
            if (element.closest('.mini-perfil') === null && element.closest('#profile-button') === null) {
                onClose();
            }
        }

        function handleKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKey);

        // limpieza: quito los eventos cuando se cierra el menu
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open, onClose]);

    // si esta cerrado no muestro nada
    if (!open) return null;

    return (
        <div className="mini-perfil abierto" role="menu">
            <div className="mini-perfil-arriba">
                <div className="perfil-avatar">{initial}</div>
                <div>
                    <p className="mini-perfil-nombre">{profileUser.name}</p>
                    <p className="mini-perfil-usuario">{profileUser.user}</p>
                </div>
            </div>

            {/* cada opcion llama a la funcion que me paso el Header */}
            <button type="button" className="mini-perfil-opcion" onClick={onViewProfile}>View my profile</button>
            <Link to="/favorites" className="mini-perfil-opcion" onClick={onClose}>My collections</Link>
            <button type="button" className="mini-perfil-opcion" onClick={onSettings}>Settings</button>
            <button type="button" className="mini-perfil-opcion mini-perfil-salir" onClick={onLogout}>Log out</button>
        </div>
    );
}

export default MiniProfile;