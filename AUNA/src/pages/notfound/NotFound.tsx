import { Link } from 'react-router-dom';

// Estilos de la página
import './notfound.css';

// Página 404: sale cuando la dirección no existe
// El header, el menú y el footer los pone MainLayout
function NotFound() {
    return (
        <main className="notfound-page">
            <span className="notfound-code">404</span>
            <h1>Page not found</h1>
            <p>The page you're looking for doesn't exist or was moved.</p>
            <Link to="/" className="notfound-button">Back to home</Link>
        </main>
    );
}

export default NotFound;
