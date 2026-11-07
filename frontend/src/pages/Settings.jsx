import DashboardKPIs from '../components/DashboardKPIs';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUser } from '../context/UserContext';
import { useSkills } from '../hooks/useSkills';
import { useUserStats } from '../hooks/useUsers';
import { formatDate, getEstimatedLevel } from '../utils/format';

export default function Settings() {
  const { user } = useUser();
  const { skills, loading: skillsLoading } = useSkills(user?.id);
  const { stats, loading: statsLoading } = useUserStats(user?.id);
  const average = skills.length
    ? Math.round(skills.reduce((sum, skill) => sum + (skill.progreso ?? 0), 0) / skills.length)
    : 0;
  const displayStats = stats ?? {
    total_skills: skills.length,
    progreso_promedio: average,
  };

  if (skillsLoading && statsLoading) return <LoadingSpinner label="Cargando perfil..." />;

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Tu espacio</span>
        <h1>Perfil</h1>
        <p>Identidad local y resumen de tu actividad.</p>
      </header>

      <section className="settings-profile panel">
        <span className="settings-profile__avatar" style={{ backgroundColor: user?.color }}>
          {user?.nombre?.charAt(0)?.toUpperCase()}
        </span>
        <div className="settings-profile__identity">
          <h2>{user?.nombre}</h2>
          <p>Perfil #{user?.id} · Desde {formatDate(user?.creado_en)}</p>
        </div>
        <div className="settings-profile__level">
          <span>Nivel estimado</span>
          <strong>{getEstimatedLevel(displayStats.progreso_promedio)}</strong>
        </div>
      </section>

      <DashboardKPIs stats={displayStats} loading={false} />
    </div>
  );
}
