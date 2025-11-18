import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Layout wrapper component that provides consistent structure
 * for all pages in the application
 */
function Layout() {
  return (
    <div className="min-vh-100 bg-light">
      <Outlet />
    </div>
  );
}

export default Layout;

