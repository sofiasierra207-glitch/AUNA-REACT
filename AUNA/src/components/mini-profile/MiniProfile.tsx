import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './mini-profile.css';

// datos de la usuaria que salen arriba del menu (como en el figma)
const usuaria = {
    nombre: 'Valentina Torres',
    usuario: '@valen.torres',
};

// tipado de las props: el Header me dice si estoy abierto
// y me pasa que hacer en cada opcion
interface MiniProfileProps {
    abierto: boolean;
    onCerrar: () => void;
    onVerPerfil: () => void;   // abre la ventana del perfil (profile de Anny)
    onAjustes: () => void;     // abre Settings (configuration de Cami)
    onLogout: () => void;      // cierra la sesion (estado global de App)
}

// mini perfil: menu que sale debajo del boton de perfil del header
// en js lo creaba con createElement e innerHTML, ahora es un componente
function MiniProfile({ abierto, onCerrar, onVerPerfil, onAjustes, onLogout }: MiniProfileProps) {
    // la inicial para el circulo: charAt(0) es la primera letra del nombre
    const inicial = usuaria.nombre.charAt(0);

    // click afuera del menu o tecla Escape: se cierra
    // solo escucho mientras el menu esta abierto
    useEffect(() => {
        if (!abierto) return;

        function alHacerClick(evento: MouseEvent) {
            // closest revisa si el click fue dentro del menu o en el boton de perfil
            const elemento = evento.target as HTMLElement;
            if (elemento.closest('.mini-perfil') === null && elemento.closest('#profile-button') === null) {
                onCerrar();
            }
        }

        function alPresionarTecla(evento: KeyboardEvent) {
            if (evento.key === 'Escape') {
                onCerrar();
            }
        }

        document.addEventListener('click', alHacerClick);
        document.addEventListener('keydown', alPresionarTecla);

        // limpieza: quito los eventos cuando se cierra el menu
        return () => {
            document.removeEventListener('click', alHacerClick);
            document.removeEventListener('keydown', alPresionarTecla);
        };
    }, [abierto, onCerrar]);

    // si esta cerrado no muestro nada
    if (!abierto) return null;

    return (
        <div className="mini-perfil abierto" role="menu">
            <div className="mini-perfil-arriba">
                <div className="perfil-avatar">{inicial}</div>
                <div>
                    <p className="mini-perfil-nombre">{usuaria.nombre}</p>
                    <p className="mini-perfil-usuario">{usuaria.usuario}</p>
                </div>
            </div>

            {/* cada opcion llama a la funcion que me paso el Header */}
            <button type="button" className="mini-perfil-opcion" onClick={onVerPerfil}>View my profile</button>
            <Link to="/favorites" className="mini-perfil-opcion" onClick={onCerrar}>My collections</Link>
            <button type="button" className="mini-perfil-opcion" onClick={onAjustes}>Settings</button>
            <button type="button" className="mini-perfil-opcion mini-perfil-salir" onClick={onLogout}>Log out</button>
        </div>
    );
}

export default MiniProfile;