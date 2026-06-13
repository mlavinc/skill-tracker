import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/skills', label: 'Mis Skills', icon: '🎯', end: true },
  { to: '/skills/nueva', label: 'Nueva Skill', icon: '➕' },
  { to: '/ranking', label: 'Ranking', icon: '🏆' },
  { to: '/configuracion', label: 'Configuración', icon: '⚙️' },
];

export default function Sidebar() {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  const handleChangeUser = () => {
    clearUser();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__user">
        <span
          className="sidebar__avatar"
          style={{ backgroundColor: user?.color || '#6c8cff' }}
          aria-hidden="true"
        >
          {user?.nombre?.charAt(0)?.toUpperCase() || '?'}
        </span>
        <div>
          <strong>{user?.nombre}</strong>
          <span>Usuario activo</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end ?? item.to === '/dashboard'}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar__change-user" onClick={handleChangeUser}>
        Cambiar usuario
      </button>
    </aside>
  );
}
