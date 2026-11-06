import { useState } from 'react';
import './ResourceCard.css';

import type { HelpResource } from '../../pages/help/data';

// Datos que recibe la tarjeta
// onContact es la función de la página que muestra el mensaje de abajo
interface ResourceCardProps {
    resource: HelpResource;
    onContact: (name: string) => void;
}

// Tarjeta de un lugar de AÚNA Help: categoría, nombre, datos y botón Contact
function ResourceCard({ resource, onContact }: ResourceCardProps) {

    // ¿Ya se contactó este lugar?
    const [contacted, setContacted] = useState(resource.contacted);

    // Contact: cambia entre Contact y Contacted
    function handleContact() {
        if (contacted) {
            setContacted(false);
        } else {
            setContacted(true);
            onContact(resource.name);
        }
    }

    return (
        <article className="help-resource-card">
            <span className="resource-tag">{resource.category}</span>
            <h3>{resource.name}</h3>
            <p className="resource-description">{resource.description}</p>
            <p className="resource-details"><span className="dot"></span>{resource.details}</p>
            <button type="button" className={contacted ? "contact-button contacted" : "contact-button"}
                onClick={handleContact}>
                {contacted ? "Contacted" : "Contact"}
            </button>
        </article>
    );
}

export default ResourceCard;
