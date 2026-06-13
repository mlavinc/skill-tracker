import { Link } from 'react-router-dom';
import { getMedal } from '../utils/format';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function LeaderboardWidget({ ranking, loading, error, onRetry, activeUserId }) {
  const topThree = ranking.slice(0, 3);

  if (loading) {
    return <LoadingSpinner label="Cargando ranking..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!topThree.length) {
    return (
      <EmptyState
        icon="🏆"
        title="Ranking vacío"
        description="Aún no hay usuarios en el ranking."
      />
    );
  }

  return (
    <div className="leaderboard-widget">
      <ul className="leaderboard-widget__list">
        {topThree.map((entry) => {
          const medal = getMedal(entry.posicion);
          const isActive = entry.user_id === activeUserId;

          return (
            <li
              key={entry.user_id}
              className={`leaderboard-widget__item${isActive ? ' leaderboard-widget__item--active' : ''}`}
            >
              <span className="leaderboard-widget__position">
                {medal || `#${entry.posicion}`}
              </span>
              <span
                className="leaderboard-widget__color"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="leaderboard-widget__name">{entry.nombre}</span>
              <span className="leaderboard-widget__points">{entry.puntos} pts</span>
            </li>
          );
        })}
      </ul>
      <Link to="/ranking" className="leaderboard-widget__link">
        Ver ranking completo →
      </Link>
    </div>
  );
}
