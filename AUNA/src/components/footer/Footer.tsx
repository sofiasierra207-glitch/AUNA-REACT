import { Link } from 'react-router-dom';
import './Footer.css';

// Pie de página: nombre, frase y links
function Footer() {
    return (
        <footer>

            <div className="footer-brand">
                <strong>AÚNA</strong>
                <p>Made with care so every woman finds her place.</p>
            </div>

            <nav className="footer-navigation" aria-label="Footer navigation">
                <Link to="/community">Community</Link>
                <Link to="/help">Help</Link>
                <Link to="/explore">Explore</Link>
            </nav>

        </footer>
    );
}

export default Footer;
