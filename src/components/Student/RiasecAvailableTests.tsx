import React from 'react'
import { Compass, BookOpen, Brain, Award, ChevronRight } from 'lucide-react'
import { PsychometricTestItem } from '../Admin/PsychometricTestForm'

interface RiasecAvailableTestsProps {
  tests: PsychometricTestItem[]
  onStartTest: (test: PsychometricTestItem) => void
  completedCount?: number
}

export default function RiasecAvailableTests({
  tests,
  onStartTest,
  completedCount = 0,
}: RiasecAvailableTestsProps) {
  const getTestIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Compass size={28} />
          </div>
        )
      case 1:
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center shadow-md shadow-sky-200">
            <BookOpen size={28} />
          </div>
        )
      case 2:
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-md shadow-purple-200">
            <Brain size={28} />
          </div>
        )
      default:
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-amber-200">
            <Award size={28} />
          </div>
        )
    }
  }

  const defaultCards = [
    {
      id: 1,
      name: 'RIASEC',
      num: 'TES 01',
      description:
        'Kenali enam kecenderungan minat untuk memetakan jurusan dan lingkungan kerja yang sesuai.',
      estimated_minutes: 15,
      isAvailable: true,
    },
    {
      id: 2,
      name: 'Gaya Belajar',
      num: 'TES 02',
      description:
        'Temukan cara menyerap dan mengolah informasi yang paling efektif untukmu.',
      estimated_minutes: 10,
      isAvailable: false,
    },
    {
      id: 3,
      name: 'Kecerdasan Majemuk',
      num: 'TES 03',
      description:
        'Memetakan potensi kecerdasan dominan sebagai dasar eksplorasi bidang studi.',
      estimated_minutes: 15,
      isAvailable: false,
    },
    {
      id: 4,
      name: 'Tes Nilai Kerja',
      num: 'TES 04',
      description:
        'Membantu peserta memahami nilai dan lingkungan kerja yang paling sesuai.',
      estimated_minutes: 12,
      isAvailable: false,
    },
  ]

  const activeTest = tests.length > 0 ? tests[0] : null

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl bg-[#25246B] px-8 py-10 text-white shadow-xl">
        <div className="max-w-2xl relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-indigo-200 mb-4">
            LANGKAH PERTAMA
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Kenali Dirimu, Temukan Potensimu
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
            Selesaikan rangkaian tes psikometri berikut untuk mendapatkan
            rekomendasi jurusan kuliah dan jalur karier yang lebih personal.
          </p>
          <div className="text-xs sm:text-sm text-indigo-200 font-medium">
            {completedCount} dari 4 tes telah diselesaikan
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Daftar Tes Tersedia
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Menampilkan 4 alat tes psikometri
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {defaultCards.map((card, idx) => {
            const isFirst = idx === 0

            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    {getTestIcon(idx)}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {card.num}
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900">
                        {card.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 font-medium">
                    Estimasi {card.estimated_minutes} menit
                  </span>
                  {isFirst && activeTest ? (
                    <button
                      type="button"
                      onClick={() => onStartTest(activeTest)}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#4355F9] hover:bg-[#3243E5] shadow-sm transition-all"
                    >
                      Mulai Tes
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#554DF0] opacity-80 cursor-not-allowed"
                    >
                      Segera Hadir
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
