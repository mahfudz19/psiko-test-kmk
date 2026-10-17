import React from 'react'
import { ClipboardList, ArrowRight } from 'lucide-react'
import { dimensions, StudentIdentity } from './types'

interface RiasecIntroProps {
  identity: StudentIdentity
  setIdentity: React.Dispatch<React.SetStateAction<StudentIdentity>>
  mentors: { id: number; name: string; school: string }[]
  onStart: () => void
}

export default function RiasecIntro({
  identity,
  setIdentity,
  mentors,
  onStart,
}: RiasecIntroProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-7 flex items-start gap-3">
          <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
            <ClipboardList size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Sebelum memulai</h2>
            <p className="mt-1 text-sm text-slate-500">
              Lengkapi identitas untuk lembar hasil asesmenmu.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Nama siswa
            <input
              required
              value={identity.name}
              onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Kelas
            <input
              required
              placeholder="Contoh: XI IPA 2"
              value={identity.className}
              onChange={(e) => setIdentity({ ...identity, className: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Sekolah
            <input
              required
              value={identity.school}
              onChange={(e) => setIdentity({ ...identity, school: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            No. absen
            <input
              required
              type="number"
              min="1"
              placeholder="Contoh: 12"
              value={identity.attendance}
              onChange={(e) => setIdentity({ ...identity, attendance: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Guru/Mentor pendamping
            <select
              value={identity.mentor}
              onChange={(e) => setIdentity({ ...identity, mentor: e.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">Pilih guru atau mentor</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.school})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-violet-700"
          >
            Mulai asesmen <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Enam Dimensi Holland</h3>
          <p className="mt-1 text-xs text-slate-500">
            Karakteristik yang diukur dalam tes ini:
          </p>
          <div className="mt-4 space-y-2.5">
            {dimensions.map((d) => (
              <div
                key={d.code}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white ${d.color}`}
                  >
                    {d.code}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{d.name}</p>
                    <p className="text-[11px] text-slate-500">{d.subtitle}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">7 butir</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
