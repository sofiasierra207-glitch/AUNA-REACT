import { useEffect } from 'react';
import './language.css';

import useLocalStorage from '../../hooks/useLocalStorage';
import checkIcon from '../../assets/icons/check.svg';

// Idiomas que aparecen en el menú
const languages = ["English", "Español", "Français", "Português"];

// Datos que recibe el menú desde el Header
interface LanguageProps {
    open: boolean;
    onClose: () => void;
}

// Menú de idiomas: se despliega debajo del botón de idioma del header
function Language({ open, onClose }: LanguageProps) {

    // Idioma elegido; se guarda para que no se borre al recargar
    const [selectedLanguage, setSelectedLanguage] = useLocalStorage<string>("aunaLanguage", "English");

    // Clic en cualquier otra parte de la página: cierra el menú
    // Solo escucha los clics mientras el menú está abierto
    useEffect(() => {
        if (!open) {
            return;
        }

        function handleClick(event: MouseEvent) {
            // closest busca si el clic fue dentro del menú o en el botón de idioma
            const target = event.target as HTMLElement;
            if (target.closest(".language-menu") === null && target.closest("#language-button") === null) {
                onClose();
            }
        }

        document.addEventListener("click", handleClick);

        // Limpieza: deja de escuchar los clics cuando se cierra
        return () => document.removeEventListener("click", handleClick);
    }, [open, onClose]);

    // Clic en un idioma: lo marca con el check y cierra el menú
    function handleSelect(language: string) {
        setSelectedLanguage(language);
        onClose();
    }

    // Si está cerrado no se muestra nada
    if (!open) {
        return null;
    }

    return (
        <div className="language-menu">
            <p className="language-title">Language</p>

            {/* Un botón por cada idioma; el elegido lleva la clase active */}
            {languages.map((language) => (
                <button key={language} type="button"
                    className={selectedLanguage === language ? "language-option active" : "language-option"}
                    onClick={() => handleSelect(language)}>
                    {language} <img src={checkIcon} alt="" />
                </button>
            ))}
        </div>
    );
}

export default Language;
