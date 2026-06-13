export default function DashboardKPIs({ stats, loading }) {
  const items = [
    { label: 'Total Skills', value: stats?.total_skills ?? 0, icon: '🎯' },
    { label: 'Total Sesiones', value: stats?.total_sesiones ?? 0, icon: '⏱️' },
    { label: 'Total Minutos', value: stats?.total_minutos ?? 0, icon: '🕐' },
    {
      label: 'Progreso Promedio',
      value: `${stats?.progreso_promedio ?? 0}%`,
      icon: '📈',
    },
  ];

  return (
    <section className="kpi-grid" aria-label="KPIs del usuario">
      {items.map((item) => (
        <article key={item.label} className="kpi-card">
          <span className="kpi-card__icon" aria-hidden="true">
            {item.icon}
          </span>
          <div>
            <p className="kpi-card__value">{loading ? '...' : item.value}</p>
            <p className="kpi-card__label">{item.label}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
