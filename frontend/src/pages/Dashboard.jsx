import { useState } from 'react';
import AdvancedMetrics from '../components/AdvancedMetrics';
import CategoryPieChart from '../components/CategoryPieChart';
import ConfirmDialog from '../components/ConfirmDialog';
import DashboardKPIs from '../components/DashboardKPIs';
import EditSkillModal from '../components/EditSkillModal';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LeaderboardWidget from '../components/LeaderboardWidget';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';
import SkillForm from '../components/SkillForm';
import SkillsProgressChart from '../components/SkillsProgressChart';
import StatsBar from '../components/StatsBar';
import { useUser } from '../context/UserContext';
import { useDashboardStats, useSkills } from '../hooks/useSkills';
import { useRanking, useUserStats } from '../hooks/useUsers';

export default function Dashboard() {
  const { user } = useUser();
  const {
    skills,
    loading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  } = useSkills(user?.id);

  const legacyStats = useDashboardStats(skills);
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

  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await createSkill(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      await updateSkill(payload.id, payload);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSkill) return;
    setDeleting(true);
    try {
      await deleteSkill(deletingSkill.id);
      setDeletingSkill(null);
    } catch {
      // Error handled by parent if needed; keep dialog open
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page dashboard">
      <section className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Hola, <strong style={{ color: user?.color }}>{user?.nombre}</strong>.
            Visualiza y gestiona todas tus habilidades en un solo lugar.
          </p>
        </div>
      </section>

      <section className="dashboard-analytics">
        <h2 className="dashboard-analytics__title">Resumen avanzado</h2>
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

      <StatsBar {...legacyStats} />

      <div className="dashboard__layout">
        <section className="dashboard__form">
          <SkillForm onSubmit={handleCreate} submitting={submitting} />
        </section>

        <section className="dashboard__list">
          <div className="section-header">
            <h2>Mis skills</h2>
            <span className="section-header__count">{skills.length}</span>
          </div>

          {loading && <LoadingSpinner label="Cargando skills..." />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={fetchSkills} />
          )}

          {!loading && !error && skills.length === 0 && (
            <EmptyState
              icon="🚀"
              title="Aún no tienes skills"
              description="Crea tu primera skill con el formulario de la izquierda para empezar a trackear tu progreso."
            />
          )}

          {!loading && !error && skills.length > 0 && (
            <div className="skill-grid">
              {skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={setEditingSkill}
                  onDelete={setDeletingSkill}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <EditSkillModal
        skill={editingSkill}
        open={Boolean(editingSkill)}
        onClose={() => setEditingSkill(null)}
        onSave={handleSave}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(deletingSkill)}
        title="Eliminar skill"
        message={`¿Seguro que quieres eliminar "${deletingSkill?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeletingSkill(null)}
        loading={deleting}
      />
    </div>
  );
}
