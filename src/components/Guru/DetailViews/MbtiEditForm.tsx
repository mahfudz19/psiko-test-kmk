import React, { useState } from 'react'
import { SquarePen, RefreshCw, Save } from 'lucide-react'
import MajorsSection from './MajorsSection'

interface MbtiEditFormProps {
  initialPrimaryResult?: string
  initialPercentages?: Record<string, number>
  initialMajors?: string[]
  mentorName: string
  isSaving: boolean
  onCancel: () => void
  onSave: (primaryResult: string, percentages: Record<string, number>, majors: string[]) => void
}

const ALL_MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

export default function MbtiEditForm({
  initialPrimaryResult = 'ENFJ',
  initialPercentages = {},
  initialMajors = ['Ilmu Komunikasi', 'Manajemen Bisnis', 'Teknik Informatika'],
  mentorName,
  isSaving,
  onCancel,
  onSave,
}: MbtiEditFormProps) {
  const [ePct, setEPct] = useState(initialPercentages.E ?? (initialPrimaryResult.includes('E') ? 65 : 35))
  const [sPct, setSPct] = useState(initialPercentages.S ?? (initialPrimaryResult.includes('S') ? 60 : 40))
  const [tPct, setTPct] = useState(initialPercentages.T ?? (initialPrimaryResult.includes('T') ? 55 : 45))
  const [jPct, setJPct] = useState(initialPercentages.J ?? (initialPrimaryResult.includes('J') ? 70 : 30))

  const [majors, setMajors] = useState<string[]>(initialMajors)

  const derivedType = `${ePct >= 50 ? 'E' : 'I'}${sPct >= 50 ? 'S' : 'N'}${tPct >= 50 ? 'T' : 'F'}${jPct >= 50 ? 'J' : 'P'}`
  const [selectedType, setSelectedType] = useState(initialPrimaryResult || derivedType)

  const handleSelectType = (t: string) => {
    setSelectedType(t)
    setEPct(t.includes('E') ? 65 : 35)
    setSPct(t.includes('S') ? 65 : 35)
    setTPct(t.includes('T') ? 65 : 35)
    setJPct(t.includes('J') ? 65 : 35)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const percentages: Record<string, number> = {
      E: ePct,
      I: 100 - ePct,
      S: sPct,
      N: 100 - sPct,
      T: tPct,
      F: 100 - tPct,
      J: jPct,
      P: 100 - jPct,
    }
    const finalType = selectedType || derivedType
    onSave(finalType, percentages, majors)
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
            Penyesuaian Skor Manual Skala MBTI
          </h3>
          <p className="text-xs text-indigo-700 mt-0.5">
            Pilih tipe kepribadian, geser persentase dimensi, dan sesuaikan rekomendasi program studi.
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

      <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-3">
        <label className="text-xs font-black text-gray-800 uppercase tracking-wide block">
          Pilih Tipe MBTI Cepat:
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_MBTI_TYPES.map((t) => {
            const isSelected = selectedType === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleSelectType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-800">
            <span>Extraversion (E): {ePct}%</span>
            <span>Introversion (I): {100 - ePct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={ePct}
            onChange={(e) => {
              const val = Number(e.target.value)
              setEPct(val)
              setSelectedType('')
            }}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-800">
            <span>Sensing (S): {sPct}%</span>
            <span>Intuition (N): {100 - sPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sPct}
            onChange={(e) => {
              const val = Number(e.target.value)
              setSPct(val)
              setSelectedType('')
            }}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-800">
            <span>Thinking (T): {tPct}%</span>
            <span>Feeling (F): {100 - tPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={tPct}
            onChange={(e) => {
              const val = Number(e.target.value)
              setTPct(val)
              setSelectedType('')
            }}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-800">
            <span>Judging (J): {jPct}%</span>
            <span>Perceiving (P): {100 - jPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={jPct}
            onChange={(e) => {
              const val = Number(e.target.value)
              setJPct(val)
              setSelectedType('')
            }}
            className="w-full accent-indigo-600"
          />
        </div>
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
          <span className="text-gray-500 block text-[11px]">Tipe Terpilih:</span>
          <span className="text-2xl font-black text-indigo-600 tracking-wider">
            {selectedType || derivedType}
          </span>
        </div>
      </div>
    </form>
  )
}
