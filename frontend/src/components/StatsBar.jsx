export default function StatsBar({
  totalSkills,
  completedSkills,
  averageProgress,
  totalSessions,
  loadingSessions,
}) {
  const stats = [
    { label: 'Total skills', value: totalSkills, icon: '🎯' },
    { label: 'Completadas', value: completedSkills, icon: '✅' },
    { label: 'Progreso promedio', value: `${averageProgress}%`, icon: '📈' },
    {
      label: 'Sesiones totales',
      value: loadingSessions ? '...' : totalSessions,
      icon: '⏱️',
    },
  ];

  return (
    <section className="stats-bar" aria-label="Indicadores del dashboard">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <span className="stat-card__icon" aria-hidden="true">
            {stat.icon}
          </span>
          <div>
            <p className="stat-card__value">{stat.value}</p>
            <p className="stat-card__label">{stat.label}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
