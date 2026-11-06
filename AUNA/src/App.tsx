import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/mainlayout/MainLayout';
import Index from './pages/index/Index';
import Explore from './pages/explore/Explore';
import Favorites from './pages/favorites/Favorites';
import Community from './pages/community/Community';
import Login from './pages/login/Login';
import Help from './pages/help/Help';

// Rutas de AÚNA: cada path muestra una página
function App() {
    return (
        <Routes>
            {/* Páginas que llevan header, menú de celular y footer */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/community" element={<Community />} />
                <Route path="/help" element={<Help />} />
            </Route>

            {/* Login va sin header ni footer, por eso está fuera de MainLayout */}
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
