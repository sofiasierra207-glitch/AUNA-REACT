import { useState } from 'react';
import './CircleCard.css';

import type { Circle } from '../../pages/community/data';

// Datos que recibe la fila
// onJoin es la función de la página que muestra el mensaje de abajo
interface CircleCardProps {
    circle: Circle;
    onJoin: (name: string) => void;
}

// Fila de un círculo: inicial, nombre, descripción y botón Join
function CircleCard({ circle, onJoin }: CircleCardProps) {

    // Estados de la fila (como el contador de clase)
    const [joined, setJoined] = useState(false);
    const [members, setMembers] = useState(circle.members);

    // Join: suma 1 miembro; si ya estaba, resta 1
    function handleJoin() {
        if (joined) {
            setJoined(false);
            setMembers(members - 1);
        } else {
            setJoined(true);
            setMembers(members + 1);
            onJoin(circle.name);
        }
    }

    return (
        <article className="circle-card">
            <span className="circle-avatar">{circle.initial}</span>

            <div className="circle-info">
                <h3>{circle.name}</h3>
                <p>{circle.description}</p>
                <span className="circle-details">{members} members · {circle.privacy}</span>
            </div>

            {/* Join */}
            <button type="button" className={joined ? "join-button joined" : "join-button"} onClick={handleJoin}>
                {joined ? "Joined" : "Join"}
            </button>
        </article>
    );
}

export default CircleCard;
