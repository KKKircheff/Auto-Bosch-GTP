import { Outlet } from 'react-router-dom';
import Navbar from '../../navigation/Navbar';
import Footer from '../Footer';
import LayoutContainer from './LayoutContainer.component';

const PublicLayout = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </LayoutContainer>
  );
};

export default PublicLayout;
