import React, { useState } from 'react'
import { SquarePen, RefreshCw, Save } from 'lucide-react'

interface RiasecEditFormProps {
  initialScores: {
    r: number
    i: number
    a: number
    s: number
    e: number
    c: number
  }
  mentorName: string
  isSaving: boolean
  onCancel: () => void
  onSave: (scores: { r: number; i: number; a: number; s: number; e: number; c: number }, dominantCode: string) => void
}

export default function RiasecEditForm({
  initialScores,
  mentorName,
  isSaving,
  onCancel,
  onSave,
}: RiasecEditFormProps) {
  const [scoreR, setScoreR] = useState(initialScores.r)
  const [scoreI, setScoreI] = useState(initialScores.i)
  const [scoreA, setScoreA] = useState(initialScores.a)
  const [scoreS, setScoreS] = useState(initialScores.s)
  const [scoreE, setScoreE] = useState(initialScores.e)
  const [scoreC, setScoreC] = useState(initialScores.c)

  const dims = [
    { code: 'R', score: scoreR },
    { code: 'I', score: scoreI },
    { code: 'A', score: scoreA },
    { code: 'S', score: scoreS },
    { code: 'E', score: scoreE },
    { code: 'C', score: scoreC },
  ]

  const dominantCode = [...dims]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((d) => d.code)
    .join('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(
      { r: scoreR, i: scoreI, a: scoreA, s: scoreS, e: scoreE, c: scoreC },
      dominantCode
    )
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
            Penyesuaian Skor Manual Asesmen RIASEC
          </h3>
          <p className="text-xs text-indigo-700 mt-0.5">
            Ubah nilai per dimensi (0 - 28 poin). Grafik visual dan kode Holland dominan akan otomatis terbarui.
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#10B981] text-white font-bold text-xs flex items-center justify-center">
              R
            </span>
            <span className="text-xs font-bold text-gray-800">Realistis</span>
          </div>
          <input
            type="number"
            min="0"
            max="28"
            value={scoreR}
            onChange={(e) => setScoreR(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
            className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
          <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#EF4444] text-white font-bold text-xs flex items-center justify-center">
              S
            </span>
            <span className="text-xs font-bold text-gray-800">Sosial</span>
          </div>
          <input
            type="number"
            min="0"
            max="28"
            value={scoreS}
            onChange={(e) => setScoreS(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
            className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
          <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#3B82F6] text-white font-bold text-xs flex items-center justify-center">
              I
            </span>
            <span className="text-xs font-bold text-gray-800">Penyelidikan</span>
          </div>
          <input
            type="number"
            min="0"
            max="28"
            value={scoreI}
            onChange={(e) => setScoreI(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
            className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
          <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-white font-bold text-xs flex items-center justify-center">
              E
            </span>
            <span className="text-xs font-bold text-gray-800">Giat</span>
          </div>
          <input
            type="number"
            min="0"
            max="28"
            value={scoreE}
            onChange={(e) => setScoreE(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
            className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
          <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center">
              A
            </span>
            <span className="text-xs font-bold text-gray-800">Artistik</span>
          </div>
          <input
            type="number"
            min="0"
            max="28"
            value={scoreA}
            onChange={(e) => setScoreA(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
            className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
          <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-[#475569] text-white font-bold text-xs flex items-center justify-center">
              C
            </span>
            <span className="text-xs font-bold text-gray-800">Konvensional</span>
          </div>
          <input
            type="number"
            min="0"
            max="28"
            value={scoreC}
            onChange={(e) => setScoreC(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
            className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
          <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
        </div>
      </div>

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
          <span className="text-gray-500 block text-[11px]">Kode Dominan Baru:</span>
          <span className="text-xl font-black text-indigo-600 tracking-wider">
            {dominantCode}
          </span>
        </div>
      </div>
    </form>
  )
}
