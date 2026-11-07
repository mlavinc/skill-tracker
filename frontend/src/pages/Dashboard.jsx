import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardKPIs from '../components/DashboardKPIs';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import SessionModal from '../components/SessionModal';
import SkillsProgressChart from '../components/SkillsProgressChart';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';
import { useUserStats } from '../hooks/useUsers';
import { api } from '../services/api';
import { formatDate } from '../utils/format';

function practiceTimestamp(skill) {
  const raw = skill?.ultima_practica;
  if (!raw || String(raw).startsWith('0001-01-01')) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function pickFocusSkill(skills) {
  const activeSkills = skills.filter(
    (skill) => !String(skill.estado ?? '').toLowerCase().includes('complet')
  );
  const candidates = activeSkills.length > 0 ? activeSkills : skills;

  return [...candidates].sort((a, b) => {
    const byPractice = practiceTimestamp(a) - practiceTimestamp(b);
    if (byPractice !== 0) return byPractice;
    return (a.progreso ?? 0) - (b.progreso ?? 0);
  })[0];
}

export default function Dashboard() {
  const { user } = useUser();
  const { skills, loading, error, fetchSkills } = useSkills(user?.id);
  const {
    stats: userStats,
    loading: statsLoading,
    error: statsError,
    fetchStats,
  } = useUserStats(user?.id);

  const [sessionSkill, setSessionSkill] = useState(null);
  const [submittingSession, setSubmittingSession] = useState(false);
  const focusSkill = useMemo(() => pickFocusSkill(skills), [skills]);
  const firstName = user?.nombre?.trim().split(/\s+/)[0] || 'de nuevo';

  const handleAddSession = async (payload) => {
    if (!sessionSkill) return;
    setSubmittingSession(true);
    try {
      await api.createSession(sessionSkill.id, payload);
      await Promise.all([fetchSkills(), fetchStats()]);
      setSessionSkill(null);
    } finally {
      setSubmittingSession(false);
    }
  };

  return (
    <div className="page dashboard">
      <section className="page-header page-header--split">
        <div>
          <span className="eyebrow">Resumen</span>
          <h1>Hola, {firstName}</h1>
          <p>Un vistazo claro a tu avance y a tu siguiente práctica.</p>
        </div>
        <Link to="/skills/nueva" className="btn btn--primary">
          Nueva habilidad
        </Link>
      </section>

      {statsError && <ErrorMessage message={statsError} onRetry={fetchStats} />}
      <DashboardKPIs stats={userStats} loading={statsLoading} />

      {loading && <LoadingSpinner label="Cargando tu progreso..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchSkills} />}

      {!loading && !error && skills.length === 0 && (
        <EmptyState
          title="Crea tu primera habilidad"
          description="Define qué quieres aprender y registra cada práctica en un solo lugar."
          action={
            <Link to="/skills/nueva" className="btn btn--primary">
              Crear habilidad
            </Link>
          }
        />
      )}

      {!loading && !error && focusSkill && (
        <section className="dashboard-focus-grid" aria-label="Enfoque y progreso">
          <article className="focus-card">
            <div>
              <span className="eyebrow">Siguiente enfoque</span>
              <h2>{focusSkill.nombre}</h2>
              <p>
                {focusSkill.categoria} · Última práctica: {formatDate(focusSkill.ultima_practica)}
              </p>
            </div>
            <ProgressBar value={focusSkill.progreso} />
            <div className="focus-card__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setSessionSkill(focusSkill)}
              >
                Registrar práctica
              </button>
              <Link to={`/skills/${focusSkill.id}`} className="btn btn--ghost">
                Ver detalle
              </Link>
            </div>
          </article>

          <article className="chart-panel detail-panel progress-overview">
            <div className="section-header">
              <div>
                <span className="eyebrow">Comparación</span>
                <h2>Progreso por habilidad</h2>
              </div>
              <Link to="/skills" className="section-header__link">
                Ver todas
              </Link>
            </div>
            <SkillsProgressChart skills={skills} />
          </article>
        </section>
      )}

      <SessionModal
        skill={sessionSkill}
        open={Boolean(sessionSkill)}
        onClose={() => setSessionSkill(null)}
        onSubmit={handleAddSession}
        submitting={submittingSession}
      />
    </div>
  );
}
