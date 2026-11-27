import { NavLink } from 'react-router-dom';
import './BottomNav.css';

// Íconos del menú: uno gris y uno rosado (para la página actual)
import homeIcon from '../../assets/icons/home.svg';
import homeActiveIcon from '../../assets/icons/home-active.svg';
import exploreIcon from '../../assets/icons/explore.svg';
import exploreActiveIcon from '../../assets/icons/explore-active.svg';
import communityIcon from '../../assets/icons/community.svg';
import communityActiveIcon from '../../assets/icons/community-active.svg';
import favoritesIcon from '../../assets/icons/favorites.svg';
import favoritesActiveIcon from '../../assets/icons/favorites-active.svg';
import helpIcon from '../../assets/icons/help.svg';
import helpActiveIcon from '../../assets/icons/help-active.svg';

// Menú de abajo, solo se ve en celular
// Cada link tiene los dos íconos; el CSS muestra el rosado solo si el link está activo
function BottomNav() {
    return (
        <nav className="bottom-nav" aria-label="Mobile navigation">
            <NavLink to="/" end className="bottom-link">
                <img src={homeIcon} alt="" className="bottom-icon" />
                <img src={homeActiveIcon} alt="" className="bottom-icon-active" />
                Home
            </NavLink>
            <NavLink to="/explore" className="bottom-link">
                <img src={exploreIcon} alt="" className="bottom-icon" />
                <img src={exploreActiveIcon} alt="" className="bottom-icon-active" />
                Explore
            </NavLink>
            <NavLink to="/community" className="bottom-link">
                <img src={communityIcon} alt="" className="bottom-icon" />
                <img src={communityActiveIcon} alt="" className="bottom-icon-active" />
                Community
            </NavLink>
            <NavLink to="/favorites" className="bottom-link">
                <img src={favoritesIcon} alt="" className="bottom-icon" />
                <img src={favoritesActiveIcon} alt="" className="bottom-icon-active" />
                Favorites
            </NavLink>
            <NavLink to="/help" className="bottom-link">
                <img src={helpIcon} alt="" className="bottom-icon" />
                <img src={helpActiveIcon} alt="" className="bottom-icon-active" />
                Help
            </NavLink>
        </nav>
    );
}

export default BottomNav;
