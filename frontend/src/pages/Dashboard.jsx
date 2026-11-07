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
  const active = skills.filter(
    (skill) => !String(skill.estado ?? '').toLowerCase().includes('complet')
  );
  const candidates = active.length ? active : skills;

  return [...candidates].sort((a, b) => {
    const byPractice = practiceTimestamp(a) - practiceTimestamp(b);
    if (byPractice !== 0) return byPractice;
    return (a.progreso ?? 0) - (b.progreso ?? 0);
  })[0];
}

function deriveStats(skills, remoteStats) {
  const average = skills.length
    ? Math.round(skills.reduce((sum, skill) => sum + (skill.progreso ?? 0), 0) / skills.length)
    : 0;

  return {
    total_skills: remoteStats?.total_skills ?? skills.length,
    progreso_promedio: remoteStats?.progreso_promedio ?? average,
    total_sesiones: remoteStats?.total_sesiones,
    total_minutos: remoteStats?.total_minutos,
  };
}

export default function Dashboard() {
  const { user } = useUser();
  const { skills, loading, error, fetchSkills } = useSkills(user?.id);
  const {
    stats: remoteStats,
    loading: statsLoading,
    error: statsError,
    fetchStats,
  } = useUserStats(user?.id);
  const [sessionSkill, setSessionSkill] = useState(null);
  const [submittingSession, setSubmittingSession] = useState(false);

  const focusSkill = useMemo(() => pickFocusSkill(skills), [skills]);
  const stats = useMemo(() => deriveStats(skills, remoteStats), [skills, remoteStats]);
  const firstName = user?.nombre?.trim().split(/\s+/)[0] || 'de nuevo';

  const handleAddSession = async (payload) => {
    if (!sessionSkill) return;
    setSubmittingSession(true);
    try {
      await api.createSession(sessionSkill.id, payload);
      await Promise.allSettled([fetchSkills(), fetchStats()]);
      setSessionSkill(null);
    } finally {
      setSubmittingSession(false);
    }
  };

  return (
    <div className="page dashboard">
      <header className="page-header page-header--split">
        <div>
          <span className="eyebrow">Tu espacio de práctica</span>
          <h1>Hola, {firstName}</h1>
          <p>Decide qué practicar, registra el esfuerzo y sigue avanzando.</p>
        </div>
        <Link to="/skills/nueva" className="btn btn--primary">
          <span aria-hidden="true">＋</span> Nueva habilidad
        </Link>
      </header>

      <DashboardKPIs stats={stats} loading={statsLoading && !remoteStats} />

      {statsError && (
        <div className="sync-note" role="status">
          <span>Mostrando el progreso disponible mientras se sincroniza la actividad total.</span>
          <button type="button" onClick={fetchStats}>Reintentar</button>
        </div>
      )}

      {loading && <LoadingSpinner label="Preparando tu espacio..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchSkills} />}

      {!loading && !error && skills.length === 0 && (
        <EmptyState
          title="Tu próxima habilidad empieza aquí"
          description="Crea una habilidad, define su prioridad y registra la primera práctica."
          action={<Link to="/skills/nueva" className="btn btn--primary">Crear habilidad</Link>}
        />
      )}

      {!loading && !error && focusSkill && (
        <section className="dashboard-workspace" aria-label="Enfoque y progreso">
          <article className="focus-card">
            <div className="focus-card__topline">
              <span className="eyebrow eyebrow--on-accent">Próximo paso</span>
              <span className="focus-card__progress">{focusSkill.progreso ?? 0}%</span>
            </div>
            <div className="focus-card__body">
              <p className="focus-card__category">{focusSkill.categoria}</p>
              <h2>{focusSkill.nombre}</h2>
              <p>Última práctica: {formatDate(focusSkill.ultima_practica)}</p>
            </div>
            <ProgressBar value={focusSkill.progreso} showLabel={false} tone="accent" />
            <div className="focus-card__actions">
              <button
                type="button"
                className="btn btn--ink"
                onClick={() => setSessionSkill(focusSkill)}
              >
                Registrar práctica
              </button>
              <Link to={`/skills/${focusSkill.id}`} className="btn btn--accent-ghost">
                Abrir habilidad
              </Link>
            </div>
          </article>

          <article className="progress-overview panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">Mapa de avance</span>
                <h2>Progreso por habilidad</h2>
              </div>
              <Link to="/skills" className="section-header__link">Ver todas</Link>
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
