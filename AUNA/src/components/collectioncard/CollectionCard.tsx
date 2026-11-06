import { Link } from 'react-router-dom';
import './CollectionCard.css';

// tipado de las props
// color solo puede ser uno de estos 3, asi no me equivoco escribiendolo
// link es opcional (?): en explore lleva a favorites, en favorites no lleva link
interface CollectionCardProps {
    title: string;
    text: string;
    color: 'rosa-claro' | 'rosa' | 'oscura';
    link?: string;
}

// tarjeta de color de una coleccion, la uso en Explore y en Favorites
function CollectionCard({ title, text, color, link }: CollectionCardProps) {
    return (
        // la clase del color la armo con el valor de la prop
        <article className={`coleccion coleccion-${color}`}>
            <h3>{title}</h3>
            <p>{text}</p>
            {/* && : solo muestro el link si me lo pasaron */}
            {link && <Link to={link}>View collection &nbsp;→</Link>}
        </article>
    );
}

export default CollectionCard;