import { Outlet } from 'react-router-dom';

import Header from '../header/Header';
import BottomNav from '../bottomnav/BottomNav';
import Footer from '../footer/Footer';

// Datos que recibe la plantilla desde App (se los pasa al Header)
interface MainLayoutProps {
    session: string;
    onLogout: () => void;
}

// Plantilla de las páginas: header y menú arriba, la página en el medio y footer abajo
// Outlet es el espacio donde aparece la página de la ruta actual
function MainLayout({ session, onLogout }: MainLayoutProps) {
    return (
        <>
            <Header session={session} onLogout={onLogout} />
            <BottomNav />
            <Outlet />
            <Footer />
        </>
    );
}

export default MainLayout;
