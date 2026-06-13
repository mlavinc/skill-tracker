import { Link, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="app-shell app-shell--with-sidebar">
      <Sidebar />
      <div className="app-content">
        <header className="app-header app-header--compact">
          <div className="app-header__inner">
            <Link to="/dashboard" className="app-brand">
              <span className="app-brand__logo">◆</span>
              <div>
                <strong>Skill Tracker</strong>
                <span>Gestiona tu aprendizaje</span>
              </div>
            </Link>
          </div>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
