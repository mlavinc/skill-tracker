import { formatHours } from '../utils/format';

export default function DashboardKPIs({ stats, loading }) {
  const items = [
    { label: 'Habilidades', value: stats?.total_skills ?? 0 },
    { label: 'Prácticas', value: stats?.total_sesiones ?? 0 },
    { label: 'Horas invertidas', value: formatHours(stats?.total_minutos ?? 0) },
  ];

  return (
    <section className="kpi-grid" aria-label="Resumen de actividad">
      {items.map((item) => (
        <article key={item.label} className="kpi-card">
          <p className="kpi-card__value">{loading ? '—' : item.value}</p>
          <p className="kpi-card__label">{item.label}</p>
        </article>
      ))}
    </section>
  );
}
