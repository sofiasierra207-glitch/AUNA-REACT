import { Link, NavLink } from 'react-router-dom';
import './Header.css';

import logo from '../../assets/images/logoauna.png';
import searchIcon from '../../assets/icons/search.svg';
import profileIcon from '../../assets/icons/profile.svg';
import languageIcon from '../../assets/icons/language.svg';

// Barra de arriba: logo, menú y botones redondos
function Header() {
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

                    <button type="button" className="icon-button" id="search-button" aria-label="Search">
                        <img src={searchIcon} alt="" />
                    </button>

                    <button type="button" className="icon-button" id="profile-button" aria-label="Profile">
                        <img src={profileIcon} alt="" />
                    </button>

                    <button type="button" className="icon-button" id="language-button" aria-label="Change language">
                        <img src={languageIcon} alt="" />
                    </button>

                </div>

            </div>

        </header>
    );
}

export default Header;
