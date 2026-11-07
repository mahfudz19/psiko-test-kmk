import React, { useState } from 'react'
import { SquarePen, RefreshCw, Save } from 'lucide-react'
import MajorsSection from './MajorsSection'

interface DiscEditFormProps {
  initialDimensionScores: any
  initialMajors?: string[]
  mentorName: string
  isSaving: boolean
  onCancel: () => void
  onSave: (dimensionScores: any, primaryResult: string, majors: string[]) => void
}

const DIMS = ['D', 'I', 'S', 'C']

export default function DiscEditForm({
  initialDimensionScores = {},
  initialMajors = ['Manajemen Bisnis', 'Ilmu Komunikasi', 'Teknik Industri'],
  mentorName,
  isSaving,
  onCancel,
  onSave,
}: DiscEditFormProps) {
  const initMost = initialDimensionScores.graph1_most || { D: 8, I: 6, S: 4, C: 6 }
  const initLeast = initialDimensionScores.graph2_least || { D: 3, I: 4, S: 7, C: 10 }

  const [most, setMost] = useState<Record<string, number>>({
    D: initMost.D ?? 0,
    I: initMost.I ?? 0,
    S: initMost.S ?? 0,
    C: initMost.C ?? 0,
  })

  const [least, setLeast] = useState<Record<string, number>>({
    D: initLeast.D ?? 0,
    I: initLeast.I ?? 0,
    S: initLeast.S ?? 0,
    C: initLeast.C ?? 0,
  })

  const [majors, setMajors] = useState<string[]>(initialMajors)

  const diff: Record<string, number> = {
    D: (most.D ?? 0) - (least.D ?? 0),
    I: (most.I ?? 0) - (least.I ?? 0),
    S: (most.S ?? 0) - (least.S ?? 0),
    C: (most.C ?? 0) - (least.C ?? 0),
  }

  const sortedDiff = Object.entries(diff).sort(([, a], [, b]) => b - a)
  const autoTop = sortedDiff[0]?.[0] || 'D'
  const autoSecond = sortedDiff[1]?.[0] || ''
  const autoProfile = (diff[autoSecond] ?? 0) > 0 ? `${autoTop}${autoSecond}` : autoTop

  const handleMostChange = (dim: string, val: number) => {
    setMost((prev) => ({ ...prev, [dim]: Math.max(0, Math.min(24, val || 0)) }))
  }

  const handleLeastChange = (dim: string, val: number) => {
    setLeast((prev) => ({ ...prev, [dim]: Math.max(0, Math.min(24, val || 0)) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payloadDimScores = {
      graph1_most: most,
      graph2_least: least,
      graph3_diff: diff,
      d: diff.D,
      i: diff.I,
      s: diff.S,
      c: diff.C,
    }
    onSave(payloadDimScores, autoProfile, majors)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-200/60">
        <div>
          <h3 className="text-base font-extrabold text-indigo-950 flex items-center gap-2">
            <SquarePen size={18} className="text-indigo-600" />
            Penyesuaian Skor Manual DiSC
          </h3>
          <p className="text-xs text-indigo-700 mt-0.5">
            Ubah skor Most (Maks. 24) dan Least (Maks. 24), serta sesuaikan rekomendasi program studi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIMS.map((dim) => {
          const names: Record<string, string> = {
            D: 'Dominance',
            I: 'Influence',
            S: 'Steadiness',
            C: 'Compliance',
          }
          const dVal = diff[dim] ?? 0

          return (
            <div key={dim} className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-indigo-950 text-sm">
                  {dim} &middot; {names[dim]}
                </span>
                <span
                  className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                    dVal >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  Selisih: {dVal > 0 ? `+${dVal}` : dVal}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-0.5">
                    Grafik 1 - Most (Sesuai)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={most[dim] ?? 0}
                    onChange={(e) => handleMostChange(dim, Number(e.target.value))}
                    className="w-full text-center text-sm font-bold text-gray-900 border border-gray-200 rounded-xl py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-0.5">
                    Grafik 2 - Least (Tidak Sesuai)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={least[dim] ?? 0}
                    onChange={(e) => handleLeastChange(dim, Number(e.target.value))}
                    className="w-full text-center text-sm font-bold text-gray-900 border border-gray-200 rounded-xl py-1.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <MajorsSection
        majors={majors}
        isFormMode={true}
        onChange={setMajors}
      />

      <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="block text-[11px] font-bold text-gray-500 mb-0.5">
            Guru/Mentor Pembimbing:
          </span>
          <span className="font-semibold text-gray-900 text-sm">
            {mentorName}
          </span>
        </div>

        <div className="text-right self-end sm:self-center">
          <span className="text-gray-500 block text-[11px]">Profil Dominan Baru:</span>
          <span className="text-2xl font-black text-indigo-600 tracking-wider">
            {autoProfile}
          </span>
        </div>
      </div>
    </form>
  )
}
