import { formatDateTime } from '../utils/format';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function SessionList({ sessions, loading, error, onRetry }) {
  if (loading) {
    return <LoadingSpinner label="Cargando sesiones..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!sessions.length) {
    return (
      <EmptyState
        icon="📋"
        title="Sin sesiones registradas"
        description="Registra tu primera práctica para comenzar a medir tu progreso."
      />
    );
  }

  return (
    <ul className="session-list">
      {sessions.map((session) => (
        <li key={session.id} className="session-item">
          <div className="session-item__header">
            <time dateTime={session.fecha}>{formatDateTime(session.fecha)}</time>
            <span className="session-item__duration">
              {session.duracion_minutos} min
            </span>
          </div>
          <div className="session-item__progress">
            Progreso percibido: <strong>+{session.progreso_percibido}%</strong>
          </div>
          {session.notas && (
            <p className="session-item__notes">{session.notas}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
