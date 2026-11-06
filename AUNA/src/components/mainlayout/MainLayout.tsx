import { Outlet } from 'react-router-dom';

import Header from '../header/Header';
import BottomNav from '../bottomnav/BottomNav';
import Footer from '../footer/Footer';

// Plantilla de las páginas: header y menú arriba, la página en el medio y footer abajo
// Outlet es el espacio donde aparece la página de la ruta actual
function MainLayout() {
    return (
        <>
            <Header />
            <BottomNav />
            <Outlet />
            <Footer />
        </>
    );
}

export default MainLayout;
