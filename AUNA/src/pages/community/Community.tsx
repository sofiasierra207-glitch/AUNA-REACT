import { useState } from 'react';

// Paleta y estilos de la página
import './community.css';

import ProfessionalCard from '../../components/professionalcard/ProfessionalCard';
import CircleCard from '../../components/circlecard/CircleCard';
import { categories, professionals, circles } from './data';

// Página de comunidad
function Community() {

    // Filtro elegido ("All" muestra todas)
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Mensaje de abajo; si está vacío no se ve
    const [toast, setToast] = useState("");

    // Muestra el mensaje y lo borra después de 2,5 segundos
    function showToast(message: string) {
        setToast(message);
        setTimeout(() => setToast(""), 2500);
    }

    // El header, el menú y el footer los pone MainLayout
    return (
        <main className="community-page">

            {/* ===== Introducción ===== */}
            <section className="community-intro">

                <div className="intro-content">

                    <span className="page-label">COMMUNITY</span>

                    <h1><em>Who's</em> behind every piece of advice</h1>

                    <p>
                        Every AÚNA creator and professional goes through verification before posting. Here you can see
                        their specialty, response time, and what the community thinks.
                    </p>

                    {/* Filtros por especialidad */}
                    <div className="filter-chips">
                        {categories.map((category) => (
                            <button key={category} type="button"
                                className={selectedCategory === category ? "filter-chip active" : "filter-chip"}
                                onClick={() => setSelectedCategory(category)}>
                                {category}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Caja oscura con los pasos */}
                <div className="verify-steps">
                    <h2>How we verify</h2>
                    <ol>
                        <li><span className="step-number">1</span>We review documents and professional profiles with the AÚNA team.</li>
                        <li><span className="step-number">2</span>We request real references from other users in the network.</li>
                        <li><span className="step-number">3</span>Annual review and open reports for the whole community.</li>
                    </ol>
                </div>

            </section>


            {/* ===== Profesionales verificadas ===== */}
            <section className="professionals">

                <div className="professionals-heading">
                    <h2>Verified professionals</h2>
                    <span>86 active profiles</span>
                </div>

                {/* Una tarjeta por profesional; solo las de la categoría elegida */}
                <div className="professionals-grid">
                    {professionals.map((professional) => (
                        (selectedCategory === "All" || selectedCategory === professional.category) ? (
                            <ProfessionalCard key={professional.user} professional={professional}
                                onFollow={(name) => showToast("You are now following " + name)} />
                        ) : null
                    ))}
                </div>

            </section>


            {/* ===== Círculos abiertos ===== */}
            <section className="circles">

                <h2>Open circles this week</h2>
                <p className="circles-subtitle">Small, moderated groups where conversations happen calmly.</p>

                {/* Una fila por círculo */}
                <div className="circles-list">
                    {circles.map((circle) => (
                        <CircleCard key={circle.name} circle={circle}
                            onJoin={(name) => showToast("You joined " + name)} />
                    ))}
                </div>

            </section>


            {/* ===== Caja para verificarse ===== */}
            <section className="get-verified">

                <div>
                    <h2>Do you work in health, law, or education?</h2>
                    <p>Apply to get verified and support the community with your experience.</p>
                </div>

                {/* Aquí se conecta verified de Cami */}
                <button type="button" className="verify-button">I want to get verified</button>

            </section>

            {/* Mensaje corto de abajo */}
            <div className={toast !== "" ? "toast visible" : "toast"} role="status">{toast}</div>

        </main>
    );
}

export default Community;
