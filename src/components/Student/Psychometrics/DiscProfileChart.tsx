import React from 'react'

interface DiscProfileChartProps {
  dimensionScores: {
    graph1_most?: Record<string, number>
    graph2_least?: Record<string, number>
    graph3_diff?: Record<string, number>
    [key: string]: any
  }
}

export default function DiscProfileChart({ dimensionScores = {} }: DiscProfileChartProps) {
  const g1 = dimensionScores.graph1_most || { D: 0, I: 0, S: 0, C: 0 }
  const g2 = dimensionScores.graph2_least || { D: 0, I: 0, S: 0, C: 0 }
  const g3 = dimensionScores.graph3_diff || {
    D: (g1.D ?? 0) - (g2.D ?? 0),
    I: (g1.I ?? 0) - (g2.I ?? 0),
    S: (g1.S ?? 0) - (g2.S ?? 0),
    C: (g1.C ?? 0) - (g2.C ?? 0),
  }

  const dimensions = ['D', 'I', 'S', 'C']
  const allValues = [
    ...dimensions.map((d) => g1[d] ?? 0),
    ...dimensions.map((d) => g2[d] ?? 0),
    ...dimensions.map((d) => g3[d] ?? 0),
  ]
  const rawMin = Math.min(0, ...allValues)
  const rawMax = Math.max(12, ...allValues)
  const sharedMin = rawMin < 0 ? Math.min(-6, rawMin - 2) : -4
  const sharedMax = Math.max(14, rawMax + 2)

  const renderSingleGraph = (
    title: string,
    subtitle: string,
    data: Record<string, number>,
    lineColor: string,
    fillBg: string,
    minVal: number,
    maxVal: number
  ) => {
    const width = 180
    const height = 150
    const paddingX = 25
    const paddingTop = 22
    const paddingBottom = 28
    const innerH = height - paddingTop - paddingBottom
    const innerW = width - paddingX * 2

    const getY = (val: number) => {
      const clamped = Math.max(minVal, Math.min(val, maxVal))
      const ratio = (clamped - minVal) / (maxVal - minVal || 1)
      return height - paddingBottom - ratio * innerH
    }

    const points = dimensions.map((dim, idx) => {
      const x = paddingX + idx * (innerW / (dimensions.length - 1))
      const y = getY(data[dim] ?? 0)
      return { dim, x, y, val: data[dim] ?? 0 }
    })

    const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return (
      <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col items-center h-full">
        <h4 className="text-xs font-bold text-slate-800 tracking-tight text-center">{title}</h4>
        <span className="text-[10px] text-slate-400 mb-1 text-center min-h-[28px] flex items-center justify-center leading-tight">
          {subtitle}
        </span>

        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[180px] h-auto overflow-visible select-none mt-auto"
        >
          <line
            x1={paddingX}
            y1={getY(0)}
            x2={width - paddingX}
            y2={getY(0)}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" />

          {points.map((p) => (
            <g key={p.dim}>
              <circle cx={p.x} cy={p.y} r="4.5" fill={lineColor} stroke="#ffffff" strokeWidth="1.5" />
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-800"
              >
                {p.val > 0 ? `+${p.val}` : p.val}
              </text>
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                className="text-[11px] font-extrabold fill-slate-600"
              >
                {p.dim}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {renderSingleGraph(
        'Grafik 1 (Mask)',
        'Respon Lingkungan Kerja / Most (+)',
        g1,
        '#2563eb',
        '#dbeafe',
        sharedMin,
        sharedMax
      )}
      {renderSingleGraph(
        'Grafik 2 (Core)',
        'Diri Alami Bawah Tekanan / Least (-)',
        g2,
        '#dc2626',
        '#fee2e2',
        sharedMin,
        sharedMax
      )}
      {renderSingleGraph(
        'Grafik 3 (Mirror)',
        'Persepsi Diri / Selisih (M - L)',
        g3,
        '#059669',
        '#d1fae5',
        sharedMin,
        sharedMax
      )}
    </div>
  )
}

