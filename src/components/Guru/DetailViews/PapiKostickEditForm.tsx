import React, { useState } from 'react'
import { SquarePen, RefreshCw, Save } from 'lucide-react'
import MajorsSection from './MajorsSection'

interface PapiKostickEditFormProps {
  initialScores: Record<string, number>
  initialMajors?: string[]
  mentorName: string
  isSaving: boolean
  onCancel: () => void
  onSave: (scores: Record<string, number>, majors: string[]) => void
}

const PAPI_ASPECT_GROUPS = [
  {
    group: 'Arah Kerja',
    items: [
      { key: 'N', label: 'N - Selesai Tugas' },
      { key: 'G', label: 'G - Pekerja Keras' },
      { key: 'A', label: 'A - Berprestasi' },
    ],
  },
  {
    group: 'Kepemimpinan',
    items: [
      { key: 'L', label: 'L - Memimpin' },
      { key: 'P', label: 'P - Mengatur' },
      { key: 'I', label: 'I - Keputusan' },
    ],
  },
  {
    group: 'Aktivitas',
    items: [
      { key: 'T', label: 'T - Tempo Cepat' },
      { key: 'V', label: 'V - Energik/Fisik' },
    ],
  },
  {
    group: 'Sifat Sosial',
    items: [
      { key: 'X', label: 'X - Diperhatikan' },
      { key: 'S', label: 'S - Ramah Sosial' },
      { key: 'B', label: 'B - Kelompok' },
      { key: 'O', label: 'O - Kedekatan' },
    ],
  },
  {
    group: 'Gaya Kerja',
    items: [
      { key: 'R', label: 'R - Teoritis' },
      { key: 'D', label: 'D - Detail Data' },
      { key: 'C', label: 'C - Teratur/Rapi' },
    ],
  },
  {
    group: 'Temperamen',
    items: [
      { key: 'Z', label: 'Z - Fleksibel' },
      { key: 'E', label: 'E - Tahan Emosi' },
      { key: 'K', label: 'K - Agresif/Ulet' },
    ],
  },
  {
    group: 'Ketaatan',
    items: [
      { key: 'F', label: 'F - Loyal Pimpinan' },
      { key: 'W', label: 'W - Taat Aturan' },
    ],
  },
]

export default function PapiKostickEditForm({
  initialScores = {},
  initialMajors = [
    'Teknik Informatika & Ilmu Komputer',
    'Manajemen Bisnis & Kewirausahaan',
    'Ilmu Komunikasi',
  ],
  mentorName,
  isSaving,
  onCancel,
  onSave,
}: PapiKostickEditFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {}
    PAPI_ASPECT_GROUPS.forEach((g) => {
      g.items.forEach((item) => {
        s[item.key] = initialScores[item.key] ?? 5
      })
    })
    return s
  })

  const [majors, setMajors] = useState<string[]>(initialMajors)

  const handleScoreChange = (key: string, val: number) => {
    const clamped = Math.max(0, Math.min(9, val || 0))
    setScores((prev) => ({ ...prev, [key]: clamped }))
  }

  const sortedAspects = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k)
    .join('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(scores, majors)
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
            Penyesuaian Skor Manual PAPI Kostick
          </h3>
          <p className="text-xs text-indigo-700 mt-0.5">
            Ubah nilai per aspek (skala 0 - 9) dan sesuaikan rekomendasi program studi.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PAPI_ASPECT_GROUPS.map((g) => (
          <div key={g.group} className="bg-white p-3.5 rounded-2xl border border-indigo-100 shadow-xs space-y-2">
            <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wide block border-b border-slate-100 pb-1">
              {g.group}
            </span>
            <div className="space-y-1.5">
              {g.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-700 truncate" title={item.label}>
                    {item.label}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={scores[item.key] ?? 0}
                    onChange={(e) => handleScoreChange(item.key, Number(e.target.value))}
                    className="w-12 text-center text-sm font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-200 rounded-lg py-1 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
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
          <span className="text-gray-500 block text-[11px]">Aspek Teratas Baru:</span>
          <span className="text-xl font-black text-indigo-600 tracking-wider">
            {sortedAspects || '-'}
          </span>
        </div>
      </div>
    </form>
  )
}
