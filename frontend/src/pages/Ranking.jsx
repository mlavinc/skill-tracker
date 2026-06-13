import { getMedal } from '../utils/format';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUser } from '../context/UserContext';
import { useRanking } from '../hooks/useUsers';

export default function Ranking() {
  const { user } = useUser();
  const { ranking, loading, error, fetchRanking } = useRanking();

  return (
    <div className="page ranking-page">
      <section className="page-header">
        <div>
          <h1>Ranking</h1>
          <p>Compite amistosamente con otros usuarios por puntos de aprendizaje.</p>
        </div>
      </section>

      {loading && <LoadingSpinner label="Cargando ranking..." />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchRanking} />
      )}

      {!loading && !error && ranking.length === 0 && (
        <EmptyState
          icon="🏆"
          title="Ranking vacío"
          description="Cuando los usuarios acumulen puntos, aparecerán aquí."
        />
      )}

      {!loading && !error && ranking.length > 0 && (
        <div className="ranking-table">
          <div className="ranking-table__header">
            <span>Posición</span>
            <span>Usuario</span>
            <span>Puntos</span>
          </div>
          <ul className="ranking-table__list">
            {ranking.map((entry) => {
              const medal = getMedal(entry.posicion);
              const isActive = entry.user_id === user?.id;

              return (
                <li
                  key={entry.user_id}
                  className={`ranking-row${isActive ? ' ranking-row--active' : ''}`}
                >
                  <span className="ranking-row__position">
                    {medal ? (
                      <span className="ranking-row__medal">{medal}</span>
                    ) : (
                      `#${entry.posicion}`
                    )}
                  </span>
                  <span className="ranking-row__user">
                    <span
                      className="ranking-row__color"
                      style={{ backgroundColor: entry.color }}
                      aria-hidden="true"
                    />
                    <span>
                      {entry.nombre}
                      {isActive && <em className="ranking-row__you"> (Tú)</em>}
                    </span>
                  </span>
                  <span className="ranking-row__points">{entry.puntos} pts</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
