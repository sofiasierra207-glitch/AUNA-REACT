import type { SavedItem } from '../../pages/favorites/data';
import './SavedCard.css';

// tipado de las props: recibo un guardado completo
interface SavedCardProps {
    item: SavedItem;
}

// tarjeta de "Recently saved" en Favorites
// en js la armaba con createElement en crearTarjeta, ahora es JSX
function SavedCard({ item }: SavedCardProps) {
    return (
        <article className="guardado">
            <img className="guardado-imagen" src={item.image} alt={item.name} />

            <div className="guardado-cuerpo">
                {/* tipo en mayusculas: POST, PLACE o CREATOR */}
                <p className="guardado-tipo">{item.type.toUpperCase()}</p>
                <p className="guardado-nombre">{item.name}</p>
                <p className="guardado-texto">{item.text}</p>
            </div>
        </article>
    );
}

export default SavedCard;