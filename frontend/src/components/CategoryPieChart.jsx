import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import EmptyState from './EmptyState';

const COLORS = ['#6c8cff', '#4ade80', '#f472b6', '#fbbf24', '#38bdf8', '#a78bfa', '#fb7185'];

export default function CategoryPieChart({ skills }) {
  const categoryMap = skills.reduce((acc, skill) => {
    const key = skill.categoria || 'Sin categoría';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return (
      <EmptyState
        icon="🥧"
        title="Sin categorías"
        description="Tus skills aparecerán aquí agrupadas por categoría."
      />
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1c2130',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
            }}
          />
          <Legend wrapperStyle={{ color: '#9aa3b8', fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
