import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import useLocalStorage from './hooks/useLocalStorage';
import useSaved from './hooks/useSaved';
import useLikes from './hooks/useLikes';
import { supabase } from './supabaseClient';
import MainLayout from './components/mainlayout/MainLayout';
import Index from './pages/index/Index';
import Explore from './pages/explore/Explore';
import Favorites from './pages/favorites/Favorites';
import Community from './pages/community/Community';
import Login from './pages/login/Login';
import Help from './pages/help/Help';
import NotFound from './pages/notfound/NotFound';

// Rutas de AÚNA: cada path muestra una página
function App() {

    // Estado global: datos que comparten varias páginas
    // Viven aquí arriba y bajan a cada página por props
    // useLocalStorage los guarda para que no se borren al recargar

    // Correo de la usuaria con la sesión abierta ("" si no hay sesión)
    const [session, setSession] = useLocalStorage<string>("aunaSession", "");

    // Ids de los posts guardados (Home, Explore y Favorites usan esta misma lista)
    // Vienen de la tabla saved_posts de Supabase (custom hook useSaved)
    const { saved, toggleSave } = useSaved(session);

    // Likes: a cuáles les di like y cuántos tiene cada post (tabla likes, custom hook useLikes)
    const { liked, counts, toggleLike } = useLikes(session);

    // Para mandar al Login si alguien sin sesión intenta guardar o dar like
    const navigate = useNavigate();

    // Al abrir la app: si Supabase no tiene sesión, se borra la que quedó guardada
    // (por ejemplo una sesión vieja de antes de usar Supabase)
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                setSession("");
            }
        });
    }, [setSession]);

    // Log out: cierra la sesión en Supabase y deja vacía la de la app
    async function handleLogout() {
        await supabase.auth.signOut();
        setSession("");
    }

    // Save: guarda o quita el post en Supabase; sin sesión va al Login
    async function handleSave(id: string) {
        const done = await toggleSave(id);
        if (!done) navigate("/login");
    }

    // Like: pone o quita el like en Supabase; sin sesión va al Login
    async function handleLike(id: string) {
        const done = await toggleLike(id);
        if (!done) navigate("/login");
    }

    return (
        <Routes>
            {/* Páginas que llevan header, menú de celular y footer */}
            {/* MainLayout recibe la sesión para el perfil del Header; Log out la cierra */}
            <Route element={<MainLayout session={session} onLogout={handleLogout} />}>
                <Route path="/" element={<Index session={session} saved={saved} onSave={handleSave}
                    liked={liked} likeCounts={counts} onLike={handleLike} />} />
                <Route path="/explore" element={<Explore saved={saved} onSave={handleSave}
                    liked={liked} likeCounts={counts} onLike={handleLike} />} />
                <Route path="/favorites" element={<Favorites savedIds={saved} />} />
                <Route path="/community" element={<Community />} />
                <Route path="/help" element={<Help />} />

                {/* "*" atrapa cualquier dirección que no existe (página 404) */}
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Login va sin header ni footer, por eso está fuera de MainLayout */}
            <Route path="/login" element={<Login onLogin={setSession} />} />
        </Routes>
    );
}

export default App;
