import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import EmptyState from './EmptyState';

export default function SkillsProgressChart({ skills }) {
  const data = skills.map((skill) => ({
    name: skill.nombre.length > 12 ? `${skill.nombre.slice(0, 12)}…` : skill.nombre,
    fullName: skill.nombre,
    progreso: skill.progreso ?? 0,
  }));

  if (!data.length) {
    return (
      <EmptyState
        icon="📊"
        title="Sin datos para el gráfico"
        description="Crea skills para ver el progreso en el gráfico de barras."
      />
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,36,48,0.08)" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#5a6378', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(31,36,48,0.12)' }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#5a6378', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(31,36,48,0.12)' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(91,110,232,0.08)' }}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e2e6f0',
              borderRadius: '10px',
              color: '#1f2433',
            }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            formatter={(value) => [`${value}%`, 'Progreso']}
          />
          <Bar dataKey="progreso" fill="#5b6ee8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
