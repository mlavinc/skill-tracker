import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdvancedMetrics from '../components/AdvancedMetrics';
import CategoryPieChart from '../components/CategoryPieChart';
import DashboardKPIs from '../components/DashboardKPIs';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LeaderboardWidget from '../components/LeaderboardWidget';
import LoadingSpinner from '../components/LoadingSpinner';
import SessionModal from '../components/SessionModal';
import SkillCard from '../components/SkillCard';
import SkillsProgressChart from '../components/SkillsProgressChart';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';
import { useRanking, useUserStats } from '../hooks/useUsers';
import { api } from '../services/api';

const FEATURED_LIMIT = 3;

function practiceTimestamp(skill) {
  const raw = skill?.ultima_practica;
  if (!raw || String(raw).startsWith('0001-01-01')) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getFeaturedSkills(skills, limit = FEATURED_LIMIT) {
  return [...skills]
    .sort((a, b) => {
      const byPractice = practiceTimestamp(b) - practiceTimestamp(a);
      if (byPractice !== 0) return byPractice;
      return (b.progreso ?? 0) - (a.progreso ?? 0);
    })
    .slice(0, limit);
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
  const {
    ranking,
    loading: rankingLoading,
    error: rankingError,
    fetchRanking,
  } = useRanking();

  const [sessionSkill, setSessionSkill] = useState(null);
  const [submittingSession, setSubmittingSession] = useState(false);

  const featuredSkills = useMemo(
    () => getFeaturedSkills(skills, FEATURED_LIMIT),
    [skills]
  );

  const handleAddSession = async (payload) => {
    if (!sessionSkill) return;
    setSubmittingSession(true);
    try {
      await api.createSession(sessionSkill.id, payload);
      await fetchSkills();
      await fetchStats();
      setSessionSkill(null);
    } finally {
      setSubmittingSession(false);
    }
  };

  return (
    <div className="page dashboard">
      <section className="page-header page-header--split">
        <div>
          <h1>Hola, {user?.nombre}</h1>
          <p>
            Resumen de tu progreso y actividad reciente.
            Gestiona el detalle en{' '}
            <Link to="/skills">Mis Skills</Link>.
          </p>
        </div>
        <div className="page-header__actions">
          <Link to="/skills/nueva" className="btn btn--primary btn--sm">
            Nueva skill
          </Link>
          <Link to="/skills" className="btn btn--ghost btn--sm">
            Ver todas
          </Link>
        </div>
      </section>

      <section className="dashboard-analytics" aria-label="Resumen de progreso">
        <h2 className="dashboard-analytics__title">Tu progreso</h2>
        {statsError && <ErrorMessage message={statsError} onRetry={fetchStats} />}
        <DashboardKPIs stats={userStats} loading={statsLoading} />
        <AdvancedMetrics stats={userStats} skills={skills} />

        <div className="dashboard-charts">
          <article className="chart-panel detail-panel">
            <h3>Progreso por skill</h3>
            <SkillsProgressChart skills={skills} />
          </article>
          <article className="chart-panel detail-panel">
            <h3>Distribución por categoría</h3>
            <CategoryPieChart skills={skills} />
          </article>
          <article className="chart-panel detail-panel">
            <h3>Top 3 — Leaderboard</h3>
            <LeaderboardWidget
              ranking={ranking}
              loading={rankingLoading}
              error={rankingError}
              onRetry={fetchRanking}
              activeUserId={user?.id}
            />
          </article>
        </div>
      </section>

      <section className="dashboard-featured" aria-label="Actividad reciente">
        <div className="section-header">
          <h2>Actividad reciente</h2>
          {skills.length > 0 && (
            <Link to="/skills" className="section-header__link">
              Ver todas ({skills.length})
            </Link>
          )}
        </div>

        {loading && <LoadingSpinner label="Cargando skills..." />}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={fetchSkills} />
        )}

        {!loading && !error && skills.length === 0 && (
          <EmptyState
            icon="🚀"
            title="Aún no tienes skills"
            description="Crea tu primera skill para empezar a trackear tu progreso."
            action={
              <Link to="/skills/nueva" className="btn btn--primary btn--sm">
                Crear skill
              </Link>
            }
          />
        )}

        {!loading && !error && featuredSkills.length > 0 && (
          <div className="skill-grid">
            {featuredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onAddSession={setSessionSkill}
              />
            ))}
          </div>
        )}
      </section>

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
