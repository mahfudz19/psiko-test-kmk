import React, { useMemo } from 'react'
import {
  Compass,
  BookOpen,
  Brain,
  Award,
  ChevronRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Target,
  Puzzle,
  Palette,
  Lightbulb,
  UserCheck,
  Flame,
  Sparkles,
  Lock,
  LucideIcon,
} from 'lucide-react'
import { PsychometricTestItem } from '../Admin/PsychometricTestForm'

export interface ExtendedPsychometricTestItem extends PsychometricTestItem {
  is_completed?: boolean
  is_in_progress?: boolean
  is_locked?: boolean
}

interface RiasecAvailableTestsProps {
  tests: ExtendedPsychometricTestItem[]
  onStartTest: (test: ExtendedPsychometricTestItem) => void
  completedCount?: number
}

interface IconPreset {
  key: string
  icon: LucideIcon
  bg: string
  shadow: string
  keywords: string[]
}

const ICON_PRESETS: IconPreset[] = [
  {
    key: 'compass',
    icon: Compass,
    bg: 'bg-indigo-600',
    shadow: 'shadow-indigo-200',
    keywords: ['holland', 'riasec', 'minat', 'karir', 'career', 'kejuruan', 'arah'],
  },
  {
    key: 'brain',
    icon: Brain,
    bg: 'bg-purple-600',
    shadow: 'shadow-purple-200',
    keywords: ['kecerdasan', 'intelligence', 'majemuk', 'otak', 'kognitif', 'iq'],
  },
  {
    key: 'book',
    icon: BookOpen,
    bg: 'bg-[#0EA5E9]',
    shadow: 'shadow-sky-200',
    keywords: ['gaya belajar', 'belajar', 'learning', 'akademik', 'studi', 'baca'],
  },
  {
    key: 'briefcase',
    icon: Briefcase,
    bg: 'bg-emerald-600',
    shadow: 'shadow-emerald-200',
    keywords: ['nilai kerja', 'work value', 'profesi', 'pekerjaan', 'lingkungan kerja', 'kantor'],
  },
  {
    key: 'user-check',
    icon: UserCheck,
    bg: 'bg-rose-500',
    shadow: 'shadow-rose-200',
    keywords: ['kepribadian', 'personality', 'mbti', 'karakter', 'sikap', 'psikologis'],
  },
  {
    key: 'puzzle',
    icon: Puzzle,
    bg: 'bg-teal-600',
    shadow: 'shadow-teal-200',
    keywords: ['logika', 'penalaran', 'analisis', 'pola', 'numerik', 'matematika', 'problem'],
  },
  {
    key: 'palette',
    icon: Palette,
    bg: 'bg-[#F59E0B]',
    shadow: 'shadow-amber-200',
    keywords: ['kreatif', 'kreativitas', 'seni', 'art', 'desain', 'estetika', 'bakat'],
  },
  {
    key: 'target',
    icon: Target,
    bg: 'bg-violet-600',
    shadow: 'shadow-violet-200',
    keywords: ['target', 'tujuan', 'fokus', 'strategi', 'konsentrasi', 'ketelitian'],
  },
  {
    key: 'lightbulb',
    icon: Lightbulb,
    bg: 'bg-blue-600',
    shadow: 'shadow-blue-200',
    keywords: ['ide', 'inovasi', 'solutif', 'kritis', 'gagasan', 'wawasan'],
  },
  {
    key: 'flame',
    icon: Flame,
    bg: 'bg-orange-500',
    shadow: 'shadow-orange-200',
    keywords: ['motivasi', 'ambisi', 'semangat', 'antusias', 'energi', 'kepemimpinan', 'leader'],
  },
  {
    key: 'sparkles',
    icon: Sparkles,
    bg: 'bg-fuchsia-600',
    shadow: 'shadow-fuchsia-200',
    keywords: ['potensi', 'eksplorasi', 'bakat khusus', 'talenta', 'masa depan'],
  },
  {
    key: 'award',
    icon: Award,
    bg: 'bg-cyan-600',
    shadow: 'shadow-cyan-200',
    keywords: ['prestasi', 'kompetensi', 'pencapaian', 'keunggulan', 'sertifikasi'],
  },
]

export default function RiasecAvailableTests({
  tests = [],
  onStartTest,
  completedCount = 0,
}: RiasecAvailableTestsProps) {
  const testIcons = useMemo(() => {
    const usedKeys = new Set<string>()
    return tests.map((test, index) => {
      const text = `${test.name} ${test.description || ''}`.toLowerCase()

      let matched = ICON_PRESETS.find(
        (preset) => !usedKeys.has(preset.key) && preset.keywords.some((kw) => text.includes(kw))
      )

      if (!matched) {
        matched = ICON_PRESETS.find((preset) => !usedKeys.has(preset.key))
      }

      if (!matched) {
        matched = ICON_PRESETS[index % ICON_PRESETS.length]
      }

      usedKeys.add(matched.key)
      return matched
    })
  }, [tests])

  const totalTests = tests.length

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
            {completedCount} dari {totalTests} tes telah diselesaikan
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Daftar Tes Tersedia
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Menampilkan {totalTests} alat tes psikometri
          </span>
        </div>

        {totalTests === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Belum Ada Alat Tes Terdaftar
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Saat ini administrator belum mengaktifkan atau mendaftarkan instrumen tes psikometri. Silakan hubungi admin atau periksa kembali nanti.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test, idx) => {
              const testNum = `TES ${String(idx + 1).padStart(2, '0')}`
              const isCompleted = Boolean(test.is_completed)
              const isInProgress = Boolean(test.is_in_progress && !isCompleted)
              const isLocked = Boolean(test.is_locked ?? (idx > 0 && tests.slice(0, idx).some((t) => !t.is_completed)))
              const prevTest = idx > 0 ? tests[idx - 1] : null

              return (
                <div
                  key={test.id}
                  className={`rounded-3xl border p-7 shadow-sm flex flex-col justify-between transition-all ${
                    isLocked
                      ? 'bg-slate-50/70 border-slate-200/80'
                      : 'bg-white border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {(() => {
                        const iconConfig = testIcons[idx] || ICON_PRESETS[idx % ICON_PRESETS.length]
                        const IconComponent = iconConfig.icon
                        return (
                          <div
                            className={`w-14 h-14 rounded-2xl ${
                              isLocked
                                ? 'bg-slate-200 text-slate-500'
                                : `${iconConfig.bg} text-white shadow-md ${iconConfig.shadow}`
                            } flex items-center justify-center shrink-0 relative`}
                          >
                            <IconComponent size={28} className={isLocked ? 'opacity-50' : ''} />
                            {isLocked && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-600 text-white flex items-center justify-center shadow-sm">
                                <Lock size={11} />
                              </div>
                            )}
                          </div>
                        )
                      })()}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {testNum}
                          </span>
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-600">
                              <Lock size={10} /> Terkunci
                            </span>
                          )}
                        </div>
                        <h3 className={`text-xl font-extrabold leading-snug ${isLocked ? 'text-gray-700' : 'text-gray-900'}`}>
                          {test.name}
                        </h3>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed mb-4 ${isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
                      {test.description}
                    </p>
                    {isLocked && prevTest && (
                      <div className="mb-4 text-xs font-medium text-slate-600 bg-slate-100/90 rounded-xl px-3.5 py-2.5 border border-slate-200/70 flex items-center gap-2">
                        <Lock size={14} className="text-slate-400 shrink-0" />
                        <span>Selesaikan <strong>{prevTest.name}</strong> terlebih dahulu</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">
                      Estimasi {test.estimated_minutes || 15} menit
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 size={16} />
                        Selesai
                      </span>
                    ) : isInProgress ? (
                      <button
                        type="button"
                        onClick={() => onStartTest(test)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-amber-500 hover:bg-amber-600 shadow-sm transition-all cursor-pointer"
                      >
                        Lanjutkan
                        <ChevronRight size={16} />
                      </button>
                    ) : isLocked ? (
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed select-none"
                      >
                        <Lock size={15} />
                        Terkunci
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onStartTest(test)}
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#4355F9] hover:bg-[#3243E5] shadow-sm transition-all cursor-pointer"
                      >
                        Mulai Tes
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
