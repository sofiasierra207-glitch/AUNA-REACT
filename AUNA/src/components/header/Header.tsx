import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import SearchPopup from '../search/SearchPopup';
import Profile from '../profile/Profile';
import './Header.css';

import logo from '../../assets/images/logoauna.png';
import searchIcon from '../../assets/icons/search.svg';
import profileIcon from '../../assets/icons/profile.svg';
import languageIcon from '../../assets/icons/language.svg';

// Datos que recibe el Header desde MainLayout (vienen del estado global de App)
interface HeaderProps {
    session: string;        // correo con la sesión abierta ("" si no hay sesión)
    onLogout: () => void;   // borra la sesión
}

// Barra de arriba: logo, menú y botones redondos
function Header({ session, onLogout }: HeaderProps) {
    // estado para saber si el popup de buscar esta abierto o cerrado
    const [buscarAbierto, setBuscarAbierto] = useState(false);

    // ¿Está abierta la ventana del perfil?
    const [profileOpen, setProfileOpen] = useState(false);

    // Para ir a otra página desde el código
    const navigate = useNavigate();

    // Botón de perfil: si no hay sesión va al Login; si hay, abre el perfil
    function handleProfile() {
        if (session === "") {
            navigate("/login");
        } else {
            setProfileOpen(true);
        }
    }

    // Log out: borra la sesión, cierra el perfil y va al Login
    function handleLogout() {
        onLogout();
        setProfileOpen(false);
        navigate("/login");
    }

    return (
        <header>

            <div className="header">

                {/* Logo que lleva al inicio */}
                <Link to="/" className="logo" aria-label="AÚNA home">
                    <img src={logo} alt="AÚNA logo" />
                </Link>

                {/* Menú principal; NavLink le pone "active" a la página actual */}
                <nav className="main-nav" aria-label="Main navigation">
                    <ul>
                        <li><NavLink to="/" end className="nav-link">Home</NavLink></li>
                        <li><NavLink to="/explore" className="nav-link">Explore</NavLink></li>
                        <li><NavLink to="/community" className="nav-link">Community</NavLink></li>
                        <li><NavLink to="/favorites" className="nav-link">Favorites</NavLink></li>
                        <li><NavLink to="/help" className="nav-link">AÚNA Help</NavLink></li>
                    </ul>
                </nav>

                {/* Botones de buscar, perfil e idioma; aquí se conectan sus componentes */}
                <div className="header-actions">

                    {/* la lupa abre el popup de buscar (componente SearchPopup) */}
                    <button
                        type="button"
                        className="icon-button"
                        id="search-button"
                        aria-label="Search"
                        onClick={() => setBuscarAbierto(true)}
                    >
                        <img src={searchIcon} alt="" />
                    </button>

                    {/* el perfil abre la ventana Profile (o el Login si no hay sesión) */}
                    <button type="button" className="icon-button" id="profile-button" aria-label="Profile"
                        onClick={handleProfile}>
                        <img src={profileIcon} alt="" />
                    </button>

                    <button type="button" className="icon-button" id="language-button" aria-label="Change language">
                        <img src={languageIcon} alt="" />
                    </button>

                </div>

            </div>

            {/* popup de buscar: le paso si esta abierto y la funcion para cerrarlo */}
            <SearchPopup
                abierto={buscarAbierto}
                onCerrar={() => setBuscarAbierto(false)}
            />

            {/* Ventana del perfil */}
            <Profile open={profileOpen} session={session}
                onClose={() => setProfileOpen(false)} onLogout={handleLogout} />

        </header>
    );
}

export default Header;