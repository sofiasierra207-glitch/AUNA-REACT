import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import type { ProfileData } from '../../hooks/useProfile';
import './profile.css';

// Intereses y colecciones (se pintan con .map)
const profileInterests = ["Mental wellness", "Reading", "Creativity", "Motherhood", "Safe spaces"];

const profileCollections = [
    { name: "Safe routes", details: "8 places" },
    { name: "For slow reading", details: "12 posts" },
    { name: "Voices that support you", details: "9 stories" }
];

// Datos que recibe la ventana desde el Header
interface ProfileProps {
    open: boolean;
    session: string;        // correo con la sesión abierta
    profile: ProfileData | null; // su fila en la tabla profiles (Supabase)
    postCount: number;      // cuántos posts tiene en la tabla posts
    savedCount: number;     // cuántos guardó en la tabla saved_posts
    onClose: () => void;
    onLogout: () => void;   // borra la sesión del estado global
    onEdit: () => void;     // abre la ventana de Settings 
}

// Ventana con el perfil de la usuaria
function Profile({ open, session, profile, postCount, savedCount, onClose, onLogout, onEdit }: ProfileProps) {

    // Colección elegida ("" si no hay ninguna)
    const [activeCollection, setActiveCollection] = useState("");

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

    // Clic en el fondo oscuro (fuera de la caja) también cierra
    // target es donde se hizo clic y currentTarget es el fondo
    function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    // Si está cerrada no se muestra nada
    if (!open) {
        return null;
    }

    // Datos de su fila en profiles (mientras carga, quedan vacíos)
    const name = profile ? profile.full_name : "";
    const user = profile ? profile.username : "";
    const initial = name.charAt(0).toUpperCase();
    const bio = profile && profile.bio ? profile.bio : "No bio yet. Add one from Edit profile.";
    const verified = profile !== null && profile.role === "Verified creator";

    return (
        <div className="profile-overlay" onClick={handleOverlayClick}>
            <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-name">

                <div className="profile-top">
                    {/* Si subió foto se ve la foto; si no, la inicial */}
                    {profile && profile.avatar_url
                        ? <img className="profile-avatar" src={profile.avatar_url} alt={name} />
                        : <span className="profile-avatar">{initial}</span>}
                    <div className="profile-names">
                        <div className="profile-title">
                            <h3 id="profile-name">{name}</h3>
                            {/* El sello solo sale si su rol es Verified creator */}
                            {verified && <span className="profile-badge">✓ Verified</span>}
                        </div>
                        <p className="profile-user">{user}</p>
                        {/* Correo que viene del estado global */}
                        <p className="profile-session">Signed in as {session}</p>
                    </div>
                    <button type="button" className="profile-close" aria-label="Close" onClick={onClose}>×</button>
                </div>

                <p className="profile-bio">{bio}</p>

                {/* Números reales: se cuentan en las tablas de Supabase */}
                <div className="profile-stats">
                    <div><strong>{postCount}</strong><span>Posts</span></div>
                    <div className="profile-stat-middle"><strong>{savedCount}</strong><span>Saved</span></div>
                    <div><strong>{profileCollections.length}</strong><span>Collections</span></div>
                </div>

                <h4 className="profile-subtitle">Interests</h4>
                <div className="profile-interests">
                    {profileInterests.map((interest) => (
                        <span key={interest} className="profile-chip">{interest}</span>
                    ))}
                </div>

                {/* Al hacer clic en una colección queda marcada */}
                <h4 className="profile-subtitle">Collections</h4>
                <div className="profile-collections">
                    {profileCollections.map((collection) => (
                        <button key={collection.name} type="button"
                            className={activeCollection === collection.name ? "profile-collection active" : "profile-collection"}
                            onClick={() => setActiveCollection(collection.name)}>
                            <strong>{collection.name}</strong>
                            <span>{collection.details}</span>
                        </button>
                    ))}
                </div>

                {/* Abre la ventana de Settings (componente Configuration) */}
                <button type="button" className="profile-edit" onClick={onEdit}>Edit profile</button>

                <button type="button" className="profile-logout" onClick={onLogout}>Log out</button>

            </div>
        </div>
    );
}

export default Profile;
