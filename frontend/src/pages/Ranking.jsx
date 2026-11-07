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
      <header className="page-header">
        <span className="eyebrow">Progreso compartido</span>
        <h1>Ranking</h1>
        <p>Una referencia ligera del avance acumulado por cada perfil.</p>
      </header>

      {loading && <LoadingSpinner label="Cargando ranking..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchRanking} />}
      {!loading && !error && ranking.length === 0 && (
        <EmptyState title="Todavía no hay posiciones" description="El ranking aparecerá cuando existan habilidades con progreso." />
      )}

      {!loading && !error && ranking.length > 0 && (
        <ol className="ranking-list">
          {ranking.map((entry) => {
            const isActive = entry.user_id === user?.id;
            return (
              <li key={entry.user_id} className={`ranking-card${isActive ? ' ranking-card--active' : ''}`}>
                <span className="ranking-card__position">{String(entry.posicion).padStart(2, '0')}</span>
                <span className="ranking-card__avatar" style={{ backgroundColor: entry.color }} aria-hidden="true">
                  {entry.nombre.charAt(0).toUpperCase()}
                </span>
                <span className="ranking-card__name">{entry.nombre}{isActive && <small>Tú</small>}</span>
                <span className="ranking-card__points">{entry.puntos}<small>puntos</small></span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
