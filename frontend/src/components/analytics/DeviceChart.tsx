import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#0A0A0A', '#3A3A3A', '#6B6B6B', '#9A9A9A', '#D1D1D1']

interface Props {
  data: { device: string | null; count: number }[]
}

function label(device: string | null) {
  if (!device) return 'Unknown'
  const d = device.toLowerCase()
  if (d.includes('mobile') || d.includes('android') || d.includes('iphone')) return 'Mobile'
  if (d.includes('tablet') || d.includes('ipad')) return 'Tablet'
  if (d.includes('windows') || d.includes('mac') || d.includes('linux')) return 'Desktop'
  return device.slice(0, 20)
}

export function DeviceChart({ data }: Props) {
  const normalized = data.reduce<Record<string, number>>((acc, item) => {
    const key = label(item.device)
    acc[key] = (acc[key] || 0) + item.count
    return acc
  }, {})

  const chartData = Object.entries(normalized).map(([name, value]) => ({ name, value }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
