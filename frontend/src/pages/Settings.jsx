import AdvancedMetrics from '../components/AdvancedMetrics';
import DashboardKPIs from '../components/DashboardKPIs';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';
import { useUserStats } from '../hooks/useUsers';
import { formatDate, getEstimatedLevel } from '../utils/format';

export default function Settings() {
  const { user } = useUser();
  const { skills, loading: skillsLoading } = useSkills(user?.id);
  const { stats, loading: statsLoading, error, fetchStats } = useUserStats(user?.id);

  const loading = skillsLoading || statsLoading;

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Configuración</h1>
          <p>Información de tu perfil y resumen de actividad.</p>
        </div>
      </section>

      {loading && <LoadingSpinner label="Cargando configuración..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchStats} />}

      {!loading && !error && (
        <>
          <section className="settings-profile detail-panel">
            <div className="settings-profile__header">
              <span
                className="settings-profile__avatar"
                style={{ backgroundColor: user?.color }}
              >
                {user?.nombre?.charAt(0)?.toUpperCase()}
              </span>
              <div>
                <h2>{user?.nombre}</h2>
                <p>Miembro desde {formatDate(user?.creado_en)}</p>
              </div>
            </div>
            <dl className="detail-list">
              <div>
                <dt>Color de perfil</dt>
                <dd>
                  <span
                    className="settings-profile__color-swatch"
                    style={{ backgroundColor: user?.color }}
                  />
                  {user?.color}
                </dd>
              </div>
              <div>
                <dt>Nivel estimado</dt>
                <dd>{getEstimatedLevel(stats?.progreso_promedio)}</dd>
              </div>
              <div>
                <dt>ID de usuario</dt>
                <dd>#{user?.id}</dd>
              </div>
            </dl>
          </section>

          <section className="settings-section">
            <h2>Resumen de actividad</h2>
            <DashboardKPIs stats={stats} loading={false} />
            <AdvancedMetrics stats={stats} skills={skills} />
          </section>
        </>
      )}
    </div>
  );
}
