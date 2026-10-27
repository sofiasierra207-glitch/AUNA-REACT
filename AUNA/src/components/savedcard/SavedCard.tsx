import type { Guardado } from '../../pages/favorites/data';
import './SavedCard.css';

// tipado de las props: recibo un guardado completo
interface SavedCardProps {
    item: Guardado;
}

// tarjeta de "Recently saved" en Favorites
// en js la armaba con createElement en crearTarjeta, ahora es JSX
function SavedCard({ item }: SavedCardProps) {
    return (
        <article className="guardado">
            <img className="guardado-imagen" src={item.imagen} alt={item.nombre} />

            <div className="guardado-cuerpo">
                {/* tipo en mayusculas: POST, PLACE o CREATOR */}
                <p className="guardado-tipo">{item.tipo.toUpperCase()}</p>
                <p className="guardado-nombre">{item.nombre}</p>
                <p className="guardado-texto">{item.texto}</p>
            </div>
        </article>
    );
}

export default SavedCard;