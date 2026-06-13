import { formatHours, getEstimatedLevel } from '../utils/format';

function isActiveSkill(skill) {
  const estado = (skill.estado ?? 'Activo').toLowerCase();
  return estado.includes('activ') || estado === '';
}

export default function AdvancedMetrics({ stats, skills }) {
  const totalMinutes = stats?.total_minutos ?? 0;
  const averageProgress = stats?.progreso_promedio ?? 0;

  const sortedByProgress = [...skills].sort(
    (a, b) => (b.progreso ?? 0) - (a.progreso ?? 0)
  );

  const mostAdvanced = sortedByProgress[0];
  const leastWorked = sortedByProgress[sortedByProgress.length - 1];
  const activeCount = skills.filter(isActiveSkill).length;

  const metrics = [
    {
      label: 'Horas totales',
      value: `${formatHours(totalMinutes)} h`,
      hint: `${totalMinutes} minutos registrados`,
    },
    {
      label: 'Nivel estimado',
      value: getEstimatedLevel(averageProgress),
      hint: `Basado en ${averageProgress}% de progreso promedio`,
    },
    {
      label: 'Skill más avanzada',
      value: mostAdvanced?.nombre ?? '—',
      hint: mostAdvanced ? `${mostAdvanced.progreso ?? 0}% de progreso` : 'Sin skills',
    },
    {
      label: 'Skill menos trabajada',
      value: leastWorked?.nombre ?? '—',
      hint: leastWorked ? `${leastWorked.progreso ?? 0}% de progreso` : 'Sin skills',
    },
    {
      label: 'Skills activas',
      value: activeCount,
      hint: `De ${skills.length} skills totales`,
    },
  ];

  return (
    <section className="advanced-metrics" aria-label="Métricas adicionales">
      {metrics.map((metric) => (
        <article key={metric.label} className="advanced-metric">
          <p className="advanced-metric__label">{metric.label}</p>
          <p className="advanced-metric__value">{metric.value}</p>
          <p className="advanced-metric__hint">{metric.hint}</p>
        </article>
      ))}
    </section>
  );
}
