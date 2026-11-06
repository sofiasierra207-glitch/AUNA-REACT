import { useState } from 'react';

// Estilos de la página
import './help.css';

import ResourceCard from '../../components/resourcecard/ResourceCard';
import CommunityHelp from '../../components/communityhelp/CommunityHelp';
import { helpCategories, helpResources, helpQuestions } from './data';

// Página de AÚNA Help: lugares cercanos, pedir ayuda y preguntas frecuentes
function Help() {

    // Filtro elegido ("All" muestra todos los lugares)
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Mensaje de abajo; si está vacío no se ve
    const [toast, setToast] = useState("");


    // Si el modal de pedir ayuda está abierto o cerrado
    const [helpOpen, setHelpOpen] = useState(false);

    // Muestra el mensaje y lo borra después de 2,5 segundos
    function showToast(message: string) {
        setToast(message);
        setTimeout(() => setToast(""), 2500);
    }

    // El header, el menú y el footer los pone MainLayout
    return (
        <main className="help-page">

            {/* ===== Título de la página ===== */}
            <section className="help-intro">
                <h1>AÚNA Help</h1>
                <p>
                    Resources and nearby places for whatever you need today. And if you need more,
                    the community is just a message away.
                </p>

                {/* Filtros por categoría */}
                <div className="help-chips">
                    {helpCategories.map((category) => (
                        <button key={category} type="button" aria-pressed={selectedCategory === category}
                            className={selectedCategory === category ? "help-chip active" : "help-chip"}
                            onClick={() => setSelectedCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* ===== Lugares cercanos: solo los de la categoría elegida ===== */}
            <section className="resources-grid" aria-label="Nearby resources">
                {helpResources.map((resource) => (
                    (selectedCategory === "All" || selectedCategory === resource.category) ? (
                        <ResourceCard key={resource.name} resource={resource}
                            onContact={(name) => showToast("Your message was sent to " + name)} />
                    ) : null
                ))}
            </section>

            {/* ===== Caja oscura para pedir ayuda ===== */}
            <section className="ask-help">
                <div>
                    <h2>Can't find what you need?</h2>
                    <p>Tell the community what you need today. Your message only reaches verified users nearby.</p>
                </div>

                {/* Abre el modal de pedir ayuda (componente CommunityHelp) */}
                <button type="button" className="ask-help-button" onClick={() => setHelpOpen(true)}>
                    Ask the community for help
                </button>
            </section>

            {/* ===== Preguntas frecuentes ===== */}
            <section className="faq">
                <h2>Frequently asked questions</h2>
                <div className="faq-list">
                    {helpQuestions.map((item) => (
                        <article key={item.question} className="faq-item">
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Mensaje corto de abajo */}
            <div className={toast !== "" ? "toast visible" : "toast"} role="status">{toast}</div>

            {/* Modal de pedir ayuda: le paso si está abierto y cómo cerrarlo */}
            <CommunityHelp abierto={helpOpen} onCerrar={() => setHelpOpen(false)} />

        </main>
    );
}

export default Help;
