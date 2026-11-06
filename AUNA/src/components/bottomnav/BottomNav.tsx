import { NavLink } from 'react-router-dom';
import './BottomNav.css';

// Menú de abajo, solo se ve en celular
function BottomNav() {
    return (
        <nav className="bottom-nav" aria-label="Mobile navigation">
            <NavLink to="/" end className="bottom-link"><span className="dot"></span>Home</NavLink>
            <NavLink to="/explore" className="bottom-link"><span className="dot"></span>Explore</NavLink>
            <NavLink to="/community" className="bottom-link"><span className="dot"></span>Community</NavLink>
            <NavLink to="/favorites" className="bottom-link"><span className="dot"></span>Favorites</NavLink>
            <NavLink to="/help" className="bottom-link"><span className="dot"></span>Help</NavLink>
        </nav>
    );
}

export default BottomNav;
