import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fuentes de AÚNA (Inter y Playfair Display)
import './assets/fonts/fonts.css';

import App from './App.tsx';

// Pone la app dentro del div "root"
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
