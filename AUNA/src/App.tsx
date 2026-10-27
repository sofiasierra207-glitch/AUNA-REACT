import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/mainlayout/MainLayout';
import Index from './pages/index/Index';
import Explore from './pages/explore/Explore';
import Community from './pages/community/Community';

// Rutas de AÚNA: cada path muestra una página
function App() {
    return (
        <Routes>
            {/* Páginas que llevan header, menú de celular y footer */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/community" element={<Community />} />
            </Route>
        </Routes>
    );
}

export default App;