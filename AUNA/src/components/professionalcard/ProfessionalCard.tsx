import { useState } from 'react';
import './ProfessionalCard.css';

import type { Professional } from '../../pages/community/data';
import checkIcon from '../../assets/icons/check.svg';

// Datos que recibe la tarjeta
// onFollow es la función de la página que muestra el mensaje de abajo
interface ProfessionalCardProps {
    professional: Professional;
    onFollow: (name: string) => void;
}

// Tarjeta de una profesional verificada
function ProfessionalCard({ professional, onFollow }: ProfessionalCardProps) {

    // Estados de la tarjeta (como el contador de clase)
    const [following, setFollowing] = useState(false);
    const [followers, setFollowers] = useState(professional.followers);

    // Follow: suma 1 seguidor; si ya la seguía, resta 1
    function handleFollow() {
        if (following) {
            setFollowing(false);
            setFollowers(followers - 1);
        } else {
            setFollowing(true);
            setFollowers(followers + 1);
            onFollow(professional.name);
        }
    }

    // Seguidores cortos: 2400 se ve como "2.4k"
    let followersText = followers + "";
    if (followers >= 1000) {
        followersText = (followers / 1000).toFixed(1) + "k";
    }

    return (
        <article className="professional-card">
            <span className="professional-avatar">{professional.initial}</span>
            <h3>{professional.name}</h3>
            <p className="professional-user">{professional.user}</p>

            <span className="verified-tag">
                <img src={checkIcon} alt="" />
                {professional.specialty} · Verified
            </span>

            <p className="professional-description">{professional.description}</p>

            <p className="professional-stats">
                <strong className="followers-count">{followersText} followers</strong>
                <span className="stats-dot"></span>
                {professional.replies}
            </p>

            {/* Follow */}
            <button type="button" className={following ? "professional-follow following" : "professional-follow"}
                onClick={handleFollow}>
                {following ? "Following" : "Follow"}
            </button>
        </article>
    );
}

export default ProfessionalCard;
