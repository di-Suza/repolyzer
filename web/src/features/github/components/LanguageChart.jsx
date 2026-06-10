import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#238636', '#58a6ff', '#d29922', '#bc8cff', '#f85149', '#39c5cf'];

const tooltipStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  color: 'var(--color-text-primary)',
};

const LanguageChart = ({ repos }) => {
  // Count each loaded repository by its primary GitHub language for a lightweight profile-level chart.
  const langCount = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const data = Object.entries(langCount).map(([name, value]) => ({ name, value }));

  if (!data.length) return null;

  return (
    <div className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-panel)">
      <h3 className="text-lg font-semibold text-(--color-text-primary)">Language Breakdown</h3>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={2}
              stroke="var(--color-surface)"
              strokeWidth={3}
            >
              {data.map((item, i) => (
                <Cell key={item.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: 'var(--color-text-primary)' }} />
            <Legend
              iconSize={9}
              wrapperStyle={{
                color: 'var(--color-text-muted)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LanguageChart;
