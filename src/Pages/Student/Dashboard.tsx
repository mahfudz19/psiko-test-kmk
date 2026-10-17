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
  BarChart3,
  Bookmark,
} from 'lucide-react'
import { studentMenuItems } from '../../config/navigation'

interface TestStatusData {
  statusText: string
  isCompleted: boolean
  completedCount: number
  totalTests: number
  hasStarted: boolean
  dominantCode?: string | null
  topDimension: string
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

interface TestComparisonItem {
  id: number
  name: string
  label: string
  is_completed: boolean
  dominant_code: string
  totalScore: number
  avgScore: number
  height: string
  scores: {
    R: number
    I: number
    A: number
    S: number
    E: number
    C: number
  }
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
  testComparisons?: TestComparisonItem[]
}

export default function StudentDashboard({
  testStatus = {
    statusText: 'Belum Dikerjakan',
    isCompleted: false,
    completedCount: 0,
    totalTests: 2,
    hasStarted: false,
    dominantCode: null,
    topDimension: 'Sains & Teknologi',
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
  testComparisons = [],
}: StudentDashboardProps) {
  const { auth } = usePage<any>().props
  const userName = auth?.user?.name || 'Siswa'
  const [activeScoreType, setActiveScoreType] = useState<'total' | 'avg'>('total')

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

  const ptR = calcRadarPoint(radarScores.R, -90)
  const ptI = calcRadarPoint(radarScores.I, -30)
  const ptS = calcRadarPoint(radarScores.S, 30)
  const ptA = calcRadarPoint(radarScores.A, 90)
  const ptE = calcRadarPoint(radarScores.E, 150)
  const ptC = calcRadarPoint(radarScores.C, 210)

  const dynamicPolygonPoints = `${ptR.x},${ptR.y} ${ptI.x},${ptI.y} ${ptS.x},${ptS.y} ${ptA.x},${ptA.y} ${ptE.x},${ptE.y} ${ptC.x},${ptC.y}`

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="dashboard">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
          <p className="text-blue-100 text-lg">
            Selamat datang kembali di Portal Siswa Gen-U. Mari lanjutkan penjelajahan karirmu!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${testStatus.isCompleted
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
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    TES STATUS
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {testStatus.statusText}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                {testStatus.isCompleted ? (
                  <>
                    Hasil menunjukkan minat yang kuat pada bidang{' '}
                    <strong className="text-gray-800 font-bold">{testStatus.topDimension}</strong>
                    {testStatus.dominantCode ? ` (Kode: ${testStatus.dominantCode})` : ''}.
                  </>
                ) : testStatus.hasStarted ? (
                  <>
                    Kamu telah menyelesaikan {testStatus.completedCount} dari {testStatus.totalTests} alat
                    tes. Selesaikan sisa alat tes untuk memvalidasi rekomendasi jurusanmu.
                  </>
                ) : (
                  <>
                    Kamu belum menyelesaikan tes minat bakat RIASEC. Ambil tes sekarang untuk membuka
                    rekomendasi jurusan dan karier.
                  </>
                )}
              </p>
            </div>

            <div className="pt-4 mt-2">
              <Link
                href="/student/riasec"
                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                {testStatus.isCompleted
                  ? 'Lihat Detail Hasil >'
                  : testStatus.hasStarted
                    ? 'Lanjutkan Tes >'
                    : 'Mulai Tes Sekarang >'}
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-full bg-amber-100 text-[#C0812A] flex items-center justify-center shrink-0">
                  <Bookmark size={20} className="fill-[#C0812A]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    EKSPLORASI JURUSAN
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {exploration.savedCount} Jurusan Disimpan
                  </h3>
                </div>
              </div>

              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${exploration.percentage >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                  style={{ width: `${exploration.percentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-2">
              <Link
                href="/student/jurusan"
                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Eksplorasi Jurusan &gt;
              </Link>
              <p className="text-xs text-gray-400 font-medium">
                Target: {exploration.targetCount} Jurusan
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    MENTORING MENDATANG
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {mentoring ? mentoring.mentorName : 'Belum Ada Jadwal'}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                {mentoring
                  ? mentoring.topic
                    ? `Topik: ${mentoring.topic}`
                    : 'Konsultasi bimbingan karier dan rencana studi lanjut.'
                  : 'Jadwalkan konsultasi 1-on-1 dengan mentor atau guru bimbingan konseling.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {mentoring ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
                  <Clock size={13} className="text-gray-400" /> {mentoring.timeString}
                </span>
              ) : (
                <Link
                  href="/student/booking"
                  className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Booking Sekarang &gt;
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900">Kecocokan Bidang Studi</h3>
              {hasAssessmentScores && testStatus.dominantCode && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Kode: {testStatus.dominantCode}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center py-2 relative">
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
                  fill={hasAssessmentScores ? '#3B82F6' : '#94A3B8'}
                  fillOpacity={hasAssessmentScores ? 0.18 : 0.08}
                  stroke={hasAssessmentScores ? '#3B82F6' : '#94A3B8'}
                  strokeWidth="2"
                  strokeDasharray={hasAssessmentScores ? 'none' : '4 3'}
                />

                <circle cx={ptR.x} cy={ptR.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={ptI.x} cy={ptI.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={ptS.x} cy={ptS.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={ptA.x} cy={ptA.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={ptE.x} cy={ptE.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={ptC.x} cy={ptC.y} r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />

                <text x="150" y="32" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="500">
                  Teknik ({radarScores.R})
                </text>
                <text x="242" y="93" textAnchor="start" fill="#64748B" fontSize="11" fontWeight="500">
                  Sains ({radarScores.I})
                </text>
                <text x="242" y="185" textAnchor="start" fill="#64748B" fontSize="11" fontWeight="500">
                  Sosial ({radarScores.S})
                </text>
                <text x="150" y="240" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="500">
                  Seni ({radarScores.A})
                </text>
                <text x="58" y="185" textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                  Ekonomi ({radarScores.E})
                </text>
                <text x="58" y="93" textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                  Kesehatan ({radarScores.C})
                </text>
              </svg>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">
              {hasAssessmentScores
                ? 'Berdasarkan akumulasi hasil tes minat dan bakat RIASEC Anda.'
                : 'Belum ada data tes. Selesaikan tes minat bakat untuk memetakan bidang studimu.'}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Perbandingan Alat Tes Psikometri</h3>
                <p className="text-[11px] text-gray-400">Korelasi perkembangan skor lintas alat tes</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                <button
                  type="button"
                  onClick={() => setActiveScoreType('total')}
                  className={`px-2 py-0.5 rounded transition ${activeScoreType === 'total' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500'
                    }`}
                >
                  Total
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScoreType('avg')}
                  className={`px-2 py-0.5 rounded transition ${activeScoreType === 'avg' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500'
                    }`}
                >
                  Rata-rata
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end pt-4 pb-2">
              <div className="border-l border-b border-gray-100 flex items-end justify-around h-44 px-3 pb-1">
                {testComparisons.length > 0 ? (
                  testComparisons.map((item) => {
                    const displayVal = activeScoreType === 'total' ? item.totalScore : item.avgScore
                    return (
                      <div key={item.id} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-xs font-bold text-indigo-900 group-hover:scale-110 transition-transform">
                          {item.is_completed ? displayVal : '-'}
                        </span>
                        <div className="w-12 sm:w-16 bg-slate-50/70 rounded-t-xl overflow-hidden flex items-end h-32 border border-dashed border-gray-100">
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 ${item.is_completed
                                ? 'bg-gradient-to-t from-indigo-300 via-indigo-500 to-indigo-600'
                                : 'bg-gray-200'
                              }`}
                            style={{ height: item.height }}
                          />
                        </div>
                        <div className="flex flex-col items-center mt-1">
                          <span className="text-[11px] text-gray-700 font-bold whitespace-nowrap">
                            {item.label}
                          </span>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono ${item.is_completed
                                ? 'text-emerald-700 bg-emerald-50'
                                : 'text-gray-400 bg-gray-50'
                              }`}
                          >
                            {item.is_completed ? item.dominant_code : 'Belum'}
                          </span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                    Belum ada data alat tes aktif.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
              <span className="text-gray-400">Tersedia {testComparisons.length} instrumen psikometri</span>
              <Link
                href="/student/riasec"
                className="font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                Lihat tes <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/student/riasec"
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Compass size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Tes Minat Bakat</h3>
              <p className="text-gray-500 text-sm mt-1">
                Selesaikan tes untuk mengetahui potensi dan kecenderungan karirmu.
              </p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                Mulai Tes <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>

            <Link
              href="/student/jurusan"
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Jelajahi Jurusan</h3>
              <p className="text-gray-500 text-sm mt-1">
                Temukan informasi lengkap 50+ program studi di berbagai universitas.
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Eksplorasi <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>

            <Link
              href="/student/booking"
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Sesi Mentoring</h3>
              <p className="text-gray-500 text-sm mt-1">
                Jadwalkan konsultasi 1-on-1 dengan Guru/Mentor pilihanmu.
              </p>
              <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                Booking <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
