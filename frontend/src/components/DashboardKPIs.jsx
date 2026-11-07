import { formatHours } from '../utils/format';

function activityValue(value, formatter = (item) => item) {
  if (value === undefined || value === null) return '—';
  return formatter(value);
}

export default function DashboardKPIs({ stats, loading }) {
  const items = [
    { label: 'Habilidades', value: stats?.total_skills ?? 0 },
    { label: 'Progreso medio', value: `${stats?.progreso_promedio ?? 0}%` },
    { label: 'Prácticas', value: activityValue(stats?.total_sesiones) },
    {
      label: 'Tiempo invertido',
      value: activityValue(stats?.total_minutos, (minutes) => `${formatHours(minutes)} h`),
    },
  ];

  return (
    <section className="kpi-grid" aria-label="Resumen de actividad">
      {items.map((item, index) => (
        <article key={item.label} className="kpi-card">
          <span className="kpi-card__index" aria-hidden="true">0{index + 1}</span>
          <p className="kpi-card__value">{loading ? '—' : item.value}</p>
          <p className="kpi-card__label">{item.label}</p>
        </article>
      ))}
    </section>
  );
}
