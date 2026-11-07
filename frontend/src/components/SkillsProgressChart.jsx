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
  const data = [...skills]
    .sort((a, b) => (b.progreso ?? 0) - (a.progreso ?? 0))
    .slice(0, 6)
    .map((skill) => ({
      name: skill.nombre.length > 18 ? `${skill.nombre.slice(0, 18)}…` : skill.nombre,
      fullName: skill.nombre,
      progreso: skill.progreso ?? 0,
    }));

  if (!data.length) {
    return (
      <EmptyState
        title="Aún no hay progreso"
        description="Agrega una habilidad para comenzar."
      />
    );
  }

  const height = Math.max(180, data.length * 44);

  return (
    <div className="chart-container" aria-label="Progreso por habilidad">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 18, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(31,36,48,0.08)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#6c7385', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={118}
            tick={{ fill: '#333746', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e3e5eb',
              borderRadius: '10px',
              color: '#191b22',
            }}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            formatter={(value) => [`${value}%`, 'Progreso']}
          />
          <Bar dataKey="progreso" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
