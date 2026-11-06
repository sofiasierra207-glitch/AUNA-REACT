import { Routes, Route } from 'react-router-dom';

import useLocalStorage from './hooks/useLocalStorage';
import MainLayout from './components/mainlayout/MainLayout';
import Index from './pages/index/Index';
import Explore from './pages/explore/Explore';
import Favorites from './pages/favorites/Favorites';
import Community from './pages/community/Community';
import Login from './pages/login/Login';
import Help from './pages/help/Help';

// Rutas de AÚNA: cada path muestra una página
function App() {

    // Estado global: datos que comparten varias páginas
    // Viven aquí arriba y bajan a cada página por props
    // useLocalStorage los guarda para que no se borren al recargar

    // Correo de la usuaria con la sesión abierta ("" si no hay sesión)
    const [session, setSession] = useLocalStorage<string>("aunaSession", "");

    // Ids de los posts guardados (Home, Explore y Favorites usan esta misma lista)
    const [saved, setSaved] = useLocalStorage<number[]>("aunaGuardados", []);

    // Save: si el post ya estaba guardado lo quita; si no, lo agrega
    function toggleSave(id: number) {
        if (saved.includes(id)) {
            setSaved(saved.filter((item) => item !== id));
        } else {
            setSaved([...saved, id]);
        }
    }

    return (
        <Routes>
            {/* Páginas que llevan header, menú de celular y footer */}
            {/* MainLayout recibe la sesión para el perfil del Header; Log out la deja vacía */}
            <Route element={<MainLayout session={session} onLogout={() => setSession("")} />}>
                <Route path="/" element={<Index session={session} saved={saved} onSave={toggleSave} />} />
                <Route path="/explore" element={<Explore guardados={saved} onGuardar={toggleSave} />} />
                <Route path="/favorites" element={<Favorites idsGuardados={saved} />} />
                <Route path="/community" element={<Community />} />
                <Route path="/help" element={<Help />} />
            </Route>

            {/* Login va sin header ni footer, por eso está fuera de MainLayout */}
            <Route path="/login" element={<Login onLogin={setSession} />} />
        </Routes>
    );
}

export default App;
