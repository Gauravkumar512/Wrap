import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface Props {
  data: { country: string | null; count: number }[]
}

export function CountryChart({ data }: Props) {
  const chartData = data
    .slice(0, 8)
    .map(item => ({ name: item.country || 'Unknown', value: item.count }))
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={72}
          tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
          cursor={{ fill: 'var(--border-light)' }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {chartData.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? 'var(--accent)' : 'var(--border)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
