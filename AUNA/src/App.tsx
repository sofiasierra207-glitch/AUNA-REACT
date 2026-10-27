import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/mainlayout/MainLayout';
import Index from './pages/index/Index';

// Rutas de AÚNA: cada path muestra una página
function App() {
    return (
        <Routes>
            {/* Páginas que llevan header, menú de celular y footer */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                {/* Aquí van las demás páginas, por ejemplo: */}
                {/* <Route path="/explore" element={<Explore />} /> */}
            </Route>
        </Routes>
    );
}

export default App;
