import React, { useState } from 'react'
import { Compass, Sparkles, ChevronRight } from 'lucide-react'

interface MentorItem {
  id: number
  name: string
  school: string
}

interface RiasecIntroViewProps {
  user: any
  mentors: MentorItem[]
  onStartAssessment: (selectedMentor: string) => void
  onViewDemo: () => void
}

export default function RiasecIntroView({
  user,
  mentors = [],
  onStartAssessment,
  onViewDemo,
}: RiasecIntroViewProps) {
  const [selectedMentor, setSelectedMentor] = useState(
    mentors.length > 0 ? mentors[0].name : 'Bpk. Budi Santoso, M.Psi'
  )

  const studentName = user?.name || 'Andi Pratama'
  const studentNpsn = user?.npsn || '20101111'
  const studentSchool = user?.school || 'SMAN 1 Jakarta'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl bg-[#26246B] px-8 py-10 text-white shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white/10 text-indigo-100 mb-5 border border-white/10">
            <Compass size={14} />
            <span>PORTAL SISWA / ASESMEN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Kenali arah potensimu.
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
            Instrumen RIASEC membantu Anda memahami kecenderungan diri dan mengeksplorasi pilihan studi yang sesuai.
          </p>
          <div className="flex flex-wrap gap-2.5 text-xs font-medium">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-100">
              42 pernyataan
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-100">
              6 dimensi minat
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-100">
              Tidak ada jawaban salah
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-7 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              Sebelum memulai
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Lengkapi identitas untuk lembar hasil asesmenmu.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama siswa
                </label>
                <input
                  type="text"
                  readOnly
                  value={studentName}
                  className="w-full border border-gray-200 bg-gray-50/70 rounded-xl p-3 text-xs sm:text-sm font-medium text-gray-800 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  NPSN
                </label>
                <input
                  type="text"
                  readOnly
                  value={studentNpsn}
                  className="w-full border border-gray-200 bg-gray-50/70 rounded-xl p-3 text-xs sm:text-sm font-medium text-gray-800 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Sekolah
                </label>
                <input
                  type="text"
                  readOnly
                  value={studentSchool}
                  className="w-full border border-gray-200 bg-gray-50/70 rounded-xl p-3 text-xs sm:text-sm font-medium text-gray-800 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Guru/Mentor
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 text-xs sm:text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  {mentors.length > 0 ? (
                    mentors.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} &mdash; {m.school}
                      </option>
                    ))
                  ) : (
                    <option value="Bpk. Budi Santoso, M.Psi">
                      Bpk. Budi Santoso, M.Psi &mdash; SMAN 1 Jakarta
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => onStartAssessment(selectedMentor)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-bold text-sm text-white bg-[#5B47FB] hover:bg-[#4d39ee] shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <span>Mulai asesmen</span>
              <ChevronRight size={18} />
            </button>

            <button
              type="button"
              onClick={onViewDemo}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-[#5B47FB] bg-[#F4F1FE] hover:bg-[#ece7fd] transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Lihat Hasil Demo</span>
            </button>
          </div>
        </div>

        <div className="bg-[#FAF9FF] rounded-3xl border border-indigo-100/70 p-7 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white text-[#5B47FB] flex items-center justify-center shadow-sm mb-4">
              <Sparkles size={20} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Cara mengerjakan
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="font-bold text-gray-900">1.</span>
                <p>Jawab sesuai dirimu, bukan jawaban yang dianggap ideal.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-gray-900">2.</span>
                <p>Pilih salah satu dari empat tingkat kesukaan.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-gray-900">3.</span>
                <p>Selesaikan semua 42 pernyataan untuk melihat hasil.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-indigo-100/50 mt-6">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Tes ini dirancang untuk memetakan minat dan kecocokan studi tanpa ada nilai benar atau salah.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
