import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Fuentes de AÚNA (Inter y Playfair Display)
import './assets/fonts/fonts.css';

import App from './App.tsx';

// Pone la app dentro del div "root"
// BrowserRouter envuelve todo para poder cambiar de página sin recargar
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
