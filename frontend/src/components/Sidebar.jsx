import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Hoy', icon: 'home' },
  { to: '/skills', label: 'Habilidades', icon: 'skills', end: true },
  { to: '/ranking', label: 'Ranking', icon: 'ranking' },
];

function NavIcon({ name }) {
  const paths = {
    home: <path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9 20v-6h6v6" />,
    skills: <path d="M5 6.5h14M5 12h14M5 17.5h9M3 6.5h.01M3 12h.01M3 17.5h.01" />,
    ranking: <path d="M5 20v-7h4v7M10 20V5h4v15M15 20v-10h4v10" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sidebar__icon">
      {paths[name]}
    </svg>
  );
}

export default function Sidebar() {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();

  const handleChangeUser = () => {
    clearUser();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar__brand" aria-label="Skill Tracker">
        <span className="sidebar__brand-mark" aria-hidden="true">ST</span>
        <span><strong>Skill</strong> Tracker</span>
      </NavLink>

      <NavLink to="/skills/nueva" className="sidebar__create">
        <NavIcon name="plus" />
        Nueva habilidad
      </NavLink>

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
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__account">
        <div className="sidebar__user">
          <span
            className="sidebar__avatar"
            style={{ backgroundColor: user?.color || '#5eead4' }}
            aria-hidden="true"
          >
            {user?.nombre?.charAt(0)?.toUpperCase() || '?'}
          </span>
          <div>
            <strong>{user?.nombre}</strong>
            <span>Espacio personal</span>
          </div>
        </div>
        <button type="button" className="sidebar__change-user" onClick={handleChangeUser}>
          Cambiar perfil
        </button>
      </div>
    </aside>
  );
}
