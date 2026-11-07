import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import {
  Compass,
  BookOpen,
  Users,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  AlertCircle,
  Bookmark,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react'
import { studentMenuItems } from '../../config/navigation'
import PapiRadarChart from '@/components/Student/Psychometrics/PapiRadarChart'
import DiscProfileChart from '@/components/Student/Psychometrics/DiscProfileChart'
import MbtiDimensionsBar from '@/components/Student/Psychometrics/MbtiDimensionsBar'

interface TestBadgeItem {
  test_id: number
  test_type: string
  test_name: string
  code: string
  title: string
}

interface TestStatusData {
  statusText: string
  isCompleted: boolean
  completedCount: number
  totalTests: number
  hasStarted: boolean
  dominantCode?: string | null
  badges?: TestBadgeItem[]
}

interface ExplorationData {
  savedCount: number
  targetCount: number
  percentage: number
  totalMajors: number
}

interface MentoringData {
  mentorName: string
  timeString: string
  status: string
  topic?: string
}

interface TestPortfolioItem {
  id: number
  name: string
  label: string
  test_type: string
  category_label: string
  is_completed: boolean
  dominant_code: string
  type_name?: string | null
  summary?: string | null
  dimension_scores?: any
  interpretation?: any
  score_r?: number
  score_i?: number
  score_a?: number
  score_s?: number
  score_e?: number
  score_c?: number
}

interface StudentDashboardProps {
  testStatus?: TestStatusData
  exploration?: ExplorationData
  mentoring?: MentoringData | null
  radarScores?: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
  hasAssessmentScores?: boolean
  testPortfolios?: TestPortfolioItem[]
  consolidatedMajors?: string[]
}

export default function StudentDashboard({
  testStatus = {
    statusText: 'Belum Dikerjakan',
    isCompleted: false,
    completedCount: 0,
    totalTests: 5,
    hasStarted: false,
    dominantCode: null,
    badges: [],
  },
  exploration = {
    savedCount: 0,
    targetCount: 5,
    percentage: 0,
    totalMajors: 0,
  },
  mentoring = null,
  radarScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  hasAssessmentScores = false,
  testPortfolios = [],
  consolidatedMajors = [],
}: StudentDashboardProps) {
  const { auth } = usePage<any>().props
  const userName = auth?.user?.name || 'Siswa'

  const [activeTabTestId, setActiveTabTestId] = useState<number | null>(() => {
    const firstCompleted = testPortfolios.find((t) => t.is_completed)
    return firstCompleted ? firstCompleted.id : testPortfolios[0]?.id ?? null
  })

  const selectedItem =
    testPortfolios.find((t) => t.id === activeTabTestId) || testPortfolios[0] || null

  const calcRadarPoint = (score: number, angleDeg: number) => {
    const cx = 150
    const cy = 135
    const maxR = 90
    const ratio = hasAssessmentScores ? Math.min(1, Math.max(0.12, (score || 0) / 28)) : 0.15
    const r = ratio * maxR
    const angleRad = (angleDeg * Math.PI) / 180
    const x = cx + r * Math.cos(angleRad)
    const y = cy + r * Math.sin(angleRad)
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
  }

  const effectiveRiasecScores = {
    R: selectedItem?.test_type === 'riasec' ? (selectedItem.score_r ?? radarScores.R) : radarScores.R,
    I: selectedItem?.test_type === 'riasec' ? (selectedItem.score_i ?? radarScores.I) : radarScores.I,
    A: selectedItem?.test_type === 'riasec' ? (selectedItem.score_a ?? radarScores.A) : radarScores.A,
    S: selectedItem?.test_type === 'riasec' ? (selectedItem.score_s ?? radarScores.S) : radarScores.S,
    E: selectedItem?.test_type === 'riasec' ? (selectedItem.score_e ?? radarScores.E) : radarScores.E,
    C: selectedItem?.test_type === 'riasec' ? (selectedItem.score_c ?? radarScores.C) : radarScores.C,
  }

  const ptR = calcRadarPoint(effectiveRiasecScores.R, -90)
  const ptI = calcRadarPoint(effectiveRiasecScores.I, -30)
  const ptS = calcRadarPoint(effectiveRiasecScores.S, 30)
  const ptA = calcRadarPoint(effectiveRiasecScores.A, 90)
  const ptE = calcRadarPoint(effectiveRiasecScores.E, 150)
  const ptC = calcRadarPoint(effectiveRiasecScores.C, 210)

  const dynamicPolygonPoints = `${ptR.x},${ptR.y} ${ptI.x},${ptI.y} ${ptS.x},${ptS.y} ${ptA.x},${ptA.y} ${ptE.x},${ptE.y} ${ptC.x},${ptC.y}`

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="dashboard">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
              {testStatus.hasStarted
                ? `Kamu telah menyelesaikan ${testStatus.completedCount} dari ${testStatus.totalTests} instrumen psikometri minat bakat.`
                : "Selamat datang di Portal Siswa Gen-U. Mari mulai eksplorasi minat, bakat, dan arah studimu!"}
            </p>

            {testStatus.badges && testStatus.badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {testStatus.badges.map((b) => (
                  <div
                    key={b.test_id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-bold"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{b.test_name}:</span>
                    <span className="bg-white/25 px-1.5 py-0.5 rounded-md font-mono text-[11px]">
                      {b.code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
            <Compass size={240} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    testStatus.isCompleted
                      ? 'bg-emerald-100 text-emerald-600'
                      : testStatus.hasStarted
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {testStatus.isCompleted ? (
                    <Check size={20} strokeWidth={2.5} />
                  ) : testStatus.hasStarted ? (
                    <Compass size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Status Psikometri</span>
                  <span className="text-sm font-bold text-gray-800">{testStatus.statusText}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {testStatus.isCompleted ? (
                  "Seluruh instrumen psikometri telah selesai. Validasi profil minat bakat dan rekomendasi jurusanmu telah aktif."
                ) : testStatus.hasStarted ? (
                  `Kamu telah menyelesaikan ${testStatus.completedCount} dari ${testStatus.totalTests} alat tes. Selesaikan tes lainnya untuk rekomendasi lebih mendalam.`
                ) : (
                  "Kamu belum menyelesaikan tes minat bakat. Mulai tes sekarang untuk mendapatkan rekomendasi jurusan kuliah."
                )}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-4">
              <span className="text-xs font-bold text-gray-400">
                {testStatus.completedCount} / {testStatus.totalTests} Selesai
              </span>
              <Link
                href="/student/riasec"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                <span>{testStatus.isCompleted ? 'Lihat Rapor' : 'Buka Tes'}</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Eksplorasi Jurusan</span>
                  <span className="text-sm font-bold text-gray-800">
                    {exploration.savedCount} dari {exploration.targetCount} Target
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 my-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Progres Simpan</span>
                  <span className="text-indigo-600">{exploration.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${exploration.percentage}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mt-2">
                Simpan minimal 5 jurusan impian untuk membandingkan prospek karir dan kurikulumnya.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-4">
              <span className="text-xs font-bold text-gray-400">
                {exploration.totalMajors} Jurusan Tersedia
              </span>
              <Link
                href="/student/jurusan"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                <span>Cari Jurusan</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-medium block">Konseling & Mentoring</span>
                  <span className="text-sm font-bold text-gray-800">
                    {mentoring ? mentoring.mentorName : 'Belum Ada Jadwal'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {mentoring
                  ? `Sesi mentoring terjadwal: ${mentoring.topic || 'Konsultasi Perencanaan Studi & Karir'}`
                  : 'Diskusikan hasil tes minat bakatmu secara langsung dengan guru pembimbing atau mentor ahli.'}
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-4">
              {mentoring ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold">
                  <Clock size={12} /> {mentoring.timeString}
                </span>
              ) : (
                <span className="text-xs text-gray-400">Gratis untuk siswa</span>
              )}
              <Link
                href="/student/booking"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                <span>{mentoring ? 'Detail Sesi' : 'Booking Jadwal'}</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Analisis Karakter & Minat Dominan
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Visualisasi hasil psikometri interaktif per instrumen tes
                  </p>
                </div>
                {selectedItem?.is_completed && selectedItem.dominant_code && (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
                    Hasil: {selectedItem.dominant_code}
                  </span>
                )}
              </div>

              {testPortfolios.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4">
                  {testPortfolios.map((t) => {
                    const isActive = t.id === activeTabTestId
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTabTestId(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-white text-indigo-700 shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span>{t.name}</span>
                        {t.is_completed ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              )}

              {selectedItem?.is_completed ? (
                <div className="py-2">
                  {selectedItem.test_type === 'papi_kostick' ? (
                    <div className="flex flex-col items-center justify-center">
                      <PapiRadarChart scores={selectedItem.dimension_scores ?? {}} />
                      <span className="text-[11px] text-gray-400 mt-1">
                        Diagram Polar 20 Aspek Dinamika Kerja PAPI Kostick
                      </span>
                    </div>
                  ) : selectedItem.test_type === 'disc' ? (
                    <div className="flex flex-col items-center justify-center">
                      <DiscProfileChart dimensionScores={selectedItem.dimension_scores ?? {}} />
                      <span className="text-[11px] text-gray-400 mt-2">
                        Grafik Mask, Core, dan Mirror DiSC
                      </span>
                    </div>
                  ) : selectedItem.test_type === 'mbti' ? (
                    <div className="py-4">
                      <MbtiDimensionsBar
                        percentages={selectedItem.dimension_scores?.percentages ?? {}}
                      />
                      <span className="block text-center text-[11px] text-gray-400 mt-3">
                        Persentase 4 Poros Polaritas Tipologi MBTI
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 relative">
                      <svg className="w-full max-w-[340px] h-56" viewBox="0 0 300 240">
                        <polygon
                          points="150,45 228,90 228,180 150,225 72,180 72,90"
                          fill="none"
                          stroke="#F1F5F9"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points="150,75 202,105 202,165 150,195 98,165 98,105"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="1.2"
                        />
                        <polygon
                          points="150,105 176,120 176,150 150,165 124,150 124,120"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="1"
                        />
                        <line x1="150" y1="135" x2="150" y2="45" stroke="#E2E8F0" strokeWidth="1" />
                        <line x1="150" y1="135" x2="228" y2="90" stroke="#E2E8F0" strokeWidth="1" />
                        <line x1="150" y1="135" x2="228" y2="180" stroke="#E2E8F0" strokeWidth="1" />
                        <line x1="150" y1="135" x2="150" y2="225" stroke="#E2E8F0" strokeWidth="1" />
                        <line x1="150" y1="135" x2="72" y2="180" stroke="#E2E8F0" strokeWidth="1" />
                        <line x1="150" y1="135" x2="72" y2="90" stroke="#E2E8F0" strokeWidth="1" />

                        <polygon
                          points={dynamicPolygonPoints}
                          fill="#3B82F6"
                          fillOpacity={0.18}
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />

                        <circle cx={ptR.x} cy={ptR.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={ptI.x} cy={ptI.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={ptS.x} cy={ptS.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={ptA.x} cy={ptA.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={ptE.x} cy={ptE.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={ptC.x} cy={ptC.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />

                        <text x="150" y="32" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="500">
                          Teknik ({effectiveRiasecScores.R})
                        </text>
                        <text x="242" y="93" textAnchor="start" fill="#64748B" fontSize="11" fontWeight="500">
                          Sains ({effectiveRiasecScores.I})
                        </text>
                        <text x="242" y="185" textAnchor="start" fill="#64748B" fontSize="11" fontWeight="500">
                          Sosial ({effectiveRiasecScores.S})
                        </text>
                        <text x="150" y="240" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="500">
                          Seni ({effectiveRiasecScores.A})
                        </text>
                        <text x="58" y="185" textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                          Ekonomi ({effectiveRiasecScores.E})
                        </text>
                        <text x="58" y="93" textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                          Kesehatan ({effectiveRiasecScores.C})
                        </text>
                      </svg>
                      <span className="text-[11px] text-gray-400 mt-1">
                        Peta 6 Dimensi Holland RIASEC
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 my-4 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Alat Tes Ini Belum Dikerjakan
                  </span>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Selesaikan instrumen {selectedItem?.name || 'ini'} untuk membuka visualisasi dan profil kepribadianmu.
                  </p>
                  <Link
                    href="/student/riasec"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition mt-2 cursor-pointer"
                  >
                    <span>Mulai Pengerjaan Tes</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  Rekomendasi Jurusan Unggulan
                </span>
                <Link
                  href="/student/jurusan"
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Jelajahi Semua &gt;
                </Link>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {consolidatedMajors.slice(0, 4).map((major, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-[11px] font-semibold"
                  >
                    <BookOpen size={11} className="text-amber-600" />
                    <span>{major}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Portofolio Alat Tes Psikometri
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Daftar progres instrumen minat dan karakter
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {testStatus.completedCount} / {testStatus.totalTests} Selesai
                </span>
              </div>

              <div className="space-y-3">
                {testPortfolios.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-slate-50/60 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          item.is_completed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.is_completed ? <Check size={16} strokeWidth={2.5} /> : idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {item.category_label}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.is_completed
                            ? item.type_name || `Hasil: ${item.dominant_code}`
                            : 'Instrumen evaluasi psikometri'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.is_completed ? (
                        <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.dominant_code}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                          Belum
                        </span>
                      )}
                      <Link
                        href="/student/riasec"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white transition cursor-pointer"
                        title={item.is_completed ? 'Lihat Hasil' : 'Mulai Tes'}
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs mt-4">
              <span className="text-gray-400">Total {testPortfolios.length} instrumen pengukuran</span>
              <Link
                href="/student/riasec"
                className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>Buka Hasil Lengkap</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/student/riasec"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer block"
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Compass size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Tes Minat Bakat</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Akses seluruh instrumen psikometri untuk mengenali potensi dan gaya kerjamu.
              </p>
            </Link>

            <Link
              href="/student/jurusan"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer block"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Eksplorasi Jurusan</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Jelajahi prospek karier dan kurikulum ratusan program studi di Indonesia.
              </p>
            </Link>

            <Link
              href="/student/booking"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer block"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Konseling & Mentoring</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Konsultasikan hasil tes minat bakat dengan guru atau mentor profesional.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
