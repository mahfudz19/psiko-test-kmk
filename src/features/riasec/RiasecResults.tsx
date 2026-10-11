import React from 'react'
import { Sparkles, RotateCcw, Compass, BookOpen } from 'lucide-react'
import { category, dimensions, StudentIdentity } from './types'

interface RiasecResultsProps {
  answers: Record<string, number>
  identity: StudentIdentity
  onReset: () => void
}

export default function RiasecResults({
  answers,
  identity,
  onReset,
}: RiasecResultsProps) {
  const ranked = dimensions
    .map((dimension) => {
      const score = dimension.items.reduce(
        (sum, [number]) => sum + (answers[`${dimension.code}-${number}`] ?? 0),
        0
      )
      return {
        ...dimension,
        score,
        categoryText: category(score),
      }
    })
    .sort((a, b) => b.score - a.score)

  const top3 = ranked.slice(0, 3)
  const code = top3.map((d) => d.code).join('')

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
              <Sparkles size={14} /> HASIL PROFIL HOLLAND
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Tipe Dominan: <span className="text-violet-600">{code}</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {identity.name} • {identity.school}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RotateCcw size={16} /> Ulangi Tes
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {top3.map((d, index) => (
            <div
              key={d.code}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white ${d.color}`}
                >
                  {d.code}
                </span>
                <span className="text-xs font-bold text-slate-400">Peringkat {index + 1}</span>
              </div>
              <h3 className="mt-3 font-bold text-slate-800">{d.name}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{d.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs">
                <span className="text-slate-500">Skor: {d.score} / 28</span>
                <span className="font-semibold text-violet-700">{d.categoryText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Grafik 6 Dimensi</h3>
          <div className="space-y-4">
            {ranked.map((d) => (
              <div key={d.code} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">
                    {d.name} ({d.code})
                  </span>
                  <span className="text-slate-500">
                    {d.score} / 28 — {d.categoryText}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-500 ${d.color}`}
                    style={{ width: `${(d.score / 28) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-blue-700 font-bold mb-3">
              <BookOpen size={20} />
              <h4>Mata Pelajaran yang Mendukung</h4>
            </div>
            <div className="space-y-2">
              {top3.map((d) => (
                <div key={d.code} className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">{d.name}:</span> {d.subjects}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold mb-3">
              <Compass size={20} />
              <h4>Rekomendasi Program Studi</h4>
            </div>
            <div className="space-y-2">
              {top3.map((d) => (
                <div key={d.code} className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">{d.name}:</span> {d.programs}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
