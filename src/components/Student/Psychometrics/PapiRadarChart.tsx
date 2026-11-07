import React from 'react'

interface PapiRadarChartProps {
  scores: Record<string, number>
}

const ASPECT_LABELS: { key: string; name: string; angle: number }[] = [
  { key: 'G', name: 'G (Hard Worker)', angle: 0 },
  { key: 'L', name: 'L (Leadership)', angle: 18 },
  { key: 'I', name: 'I (Decision)', angle: 36 },
  { key: 'T', name: 'T (Pace)', angle: 54 },
  { key: 'V', name: 'V (Vigorous)', angle: 72 },
  { key: 'S', name: 'S (Social)', angle: 90 },
  { key: 'R', name: 'R (Theoretical)', angle: 108 },
  { key: 'D', name: 'D (Details)', angle: 126 },
  { key: 'C', name: 'C (Organized)', angle: 144 },
  { key: 'E', name: 'E (Emotional)', angle: 162 },
  { key: 'N', name: 'N (Finish Task)', angle: 180 },
  { key: 'A', name: 'A (Achieve)', angle: 198 },
  { key: 'P', name: 'P (Control)', angle: 216 },
  { key: 'X', name: 'X (Be Noticed)', angle: 234 },
  { key: 'B', name: 'B (Belong)', angle: 252 },
  { key: 'O', name: 'O (Closeness)', angle: 270 },
  { key: 'Z', name: 'Z (Change)', angle: 288 },
  { key: 'K', name: 'K (Forceful)', angle: 306 },
  { key: 'F', name: 'F (Authority)', angle: 324 },
  { key: 'W', name: 'W (Rules)', angle: 342 },
]

export default function PapiRadarChart({ scores = {} }: PapiRadarChartProps) {
  const size = 380
  const center = size / 2
  const maxRadius = center - 50
  const maxScore = 9

  const getCoordinates = (angleDeg: number, score: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180
    const r = (Math.max(0, Math.min(score, maxScore)) / maxScore) * maxRadius
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad),
    }
  }

  const polygonPoints = ASPECT_LABELS.map((item) => {
    const score = scores[item.key] ?? 0
    const coords = getCoordinates(item.angle, score)
    return `${coords.x},${coords.y}`
  }).join(' ')

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible select-none">
        {[2, 4, 6, 8, 9].map((gridVal) => {
          const r = (gridVal / maxScore) * maxRadius
          return (
            <circle
              key={gridVal}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="#e2e8f0"
              strokeDasharray={gridVal === 9 ? 'none' : '3 3'}
              strokeWidth="1"
            />
          )
        })}

        {ASPECT_LABELS.map((item) => {
          const outer = getCoordinates(item.angle, maxScore)
          return (
            <line
              key={item.key}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
          )
        })}

        <polygon
          points={polygonPoints}
          fill="rgba(59, 130, 246, 0.28)"
          stroke="#2563eb"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {ASPECT_LABELS.map((item) => {
          const score = scores[item.key] ?? 0
          const point = getCoordinates(item.angle, score)
          const labelCoords = getCoordinates(item.angle, maxScore + 1.25)

          return (
            <g key={item.key}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4.5"
                fill="#1d4ed8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[9px] font-bold fill-slate-700"
              >
                {item.key}:{score}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

