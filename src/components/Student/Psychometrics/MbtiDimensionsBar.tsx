import React from 'react'

interface MbtiDimensionsBarProps {
  percentages?: {
    E?: number
    I?: number
    S?: number
    N?: number
    T?: number
    F?: number
    J?: number
    P?: number
  }
}

export default function MbtiDimensionsBar({ percentages = {} }: MbtiDimensionsBarProps) {
  const pairs = [
    {
      leftCode: 'E',
      leftName: 'Extraversion',
      leftPct: percentages.E ?? 50,
      rightCode: 'I',
      rightName: 'Introversion',
      rightPct: percentages.I ?? 50,
      color: 'bg-emerald-500',
    },
    {
      leftCode: 'S',
      leftName: 'Sensing',
      leftPct: percentages.S ?? 50,
      rightCode: 'N',
      rightName: 'Intuition',
      rightPct: percentages.N ?? 50,
      color: 'bg-amber-500',
    },
    {
      leftCode: 'T',
      leftName: 'Thinking',
      leftPct: percentages.T ?? 50,
      rightCode: 'F',
      rightName: 'Feeling',
      rightPct: percentages.F ?? 50,
      color: 'bg-blue-500',
    },
    {
      leftCode: 'J',
      leftName: 'Judging',
      leftPct: percentages.J ?? 50,
      rightCode: 'P',
      rightName: 'Perceiving',
      rightPct: percentages.P ?? 50,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-3.5 w-full">
      {pairs.map((pair) => {
        const isLeftDominant = pair.leftPct >= pair.rightPct

        return (
          <div key={pair.leftCode} className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/70">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className={isLeftDominant ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
                {pair.leftCode} ({pair.leftName}): {pair.leftPct}%
              </span>
              <span className={!isLeftDominant ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
                {pair.rightPct}% : ({pair.rightName}) {pair.rightCode}
              </span>
            </div>

            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${pair.leftPct}%` }}
                className={`h-full transition-all duration-500 ${isLeftDominant ? pair.color : 'bg-slate-300'}`}
              />
              <div
                style={{ width: `${pair.rightPct}%` }}
                className={`h-full transition-all duration-500 ${!isLeftDominant ? pair.color : 'bg-slate-300'}`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

