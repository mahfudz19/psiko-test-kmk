import React, { useState } from 'react'
import { Clock, Award, BookOpen, Compass } from 'lucide-react'
import { getDimensionDefaultContent, getScoreLevel } from '@/features/riasec/dimensionProfiles'
import PapiRadarChart from './Psychometrics/PapiRadarChart'
import DiscProfileChart from './Psychometrics/DiscProfileChart'
import MbtiDimensionsBar from './Psychometrics/MbtiDimensionsBar'

export interface RiasecAssessmentData {
  id?: number
  user_id?: number
  psychometric_test_id?: number
  test_type?: string
  score_r?: number
  score_i?: number
  score_a?: number
  score_s?: number
  score_e?: number
  score_c?: number
  dominant_code?: string
  primary_result?: string
  dimension_scores?: Record<string, any> | null
  raw_answers?: Record<string, any> | null
  interpretation?: Record<string, any> | null
  status?: string
  mentor_name?: string
  answers?: {
    dimensions?: Record<string, { desc?: string; majors?: string }>
    [key: string]: any
  } | null
  user?: {
    name?: string
    npsn?: string
    school?: string
  }
  psychometric_test?: {
    id: number
    name: string
    test_type?: string
  }
}

interface TestOption {
  id: number
  name: string
  test_type?: string
  has_score?: boolean
  is_completed?: boolean
  [key: string]: any
}

interface RiasecResultViewProps {
  assessment: RiasecAssessmentData | null
  assessments?: RiasecAssessmentData[]
  tests?: TestOption[]
  user?: any
  onBack?: () => void
  backButtonLabel?: string
}

export default function RiasecResultView({
  assessment,
  assessments = [],
  tests = [],
  user,
  onBack,
  backButtonLabel,
}: RiasecResultViewProps) {
  const availableTests: TestOption[] =
    tests && tests.length > 0
      ? tests.filter(
          (t) =>
            t.is_completed ||
            assessments.some((a) => a.psychometric_test_id === t.id) ||
            assessment?.psychometric_test_id === t.id,
        )
      : assessments && assessments.length > 0
      ? assessments.map((a, idx) => ({
          id: a.psychometric_test_id || a.id || idx + 1,
          name: a.psychometric_test?.name || `Alat Tes ${idx + 1}`,
          test_type: a.test_type || a.psychometric_test?.test_type || 'riasec',
          has_score: Boolean(
            a.primary_result || a.dominant_code || (a.score_r !== undefined && a.score_r !== null)
          ),
        }))
      : []

  const [activeTestId, setActiveTestId] = useState<number | null>(() => {
    if (availableTests.length > 0) {
      return availableTests[0].id
    }
    if (assessment?.psychometric_test_id) {
      return assessment.psychometric_test_id
    }
    if (assessments && assessments.length > 0 && assessments[0].psychometric_test_id) {
      return assessments[0].psychometric_test_id
    }
    return null
  })

  const currentAssessment =
    (assessments && activeTestId
      ? assessments.find((a) => a.psychometric_test_id === activeTestId)
      : null) ||
    (assessment?.psychometric_test_id === activeTestId ? assessment : null) ||
    (availableTests.length <= 1 ? assessment : null)

  const activeTest = availableTests.find((t) => t.id === activeTestId)
  const activeTestName = activeTest?.name || currentAssessment?.psychometric_test?.name || 'Alat Tes'
  const activeTestType = activeTest?.test_type || currentAssessment?.test_type || currentAssessment?.psychometric_test?.test_type || 'riasec'

  const isSynced = Boolean(
    currentAssessment &&
      (currentAssessment.primary_result ||
        currentAssessment.dominant_code ||
        (currentAssessment.score_r !== undefined && currentAssessment.score_r !== null))
  )

  const studentName = currentAssessment?.user?.name || user?.name || 'Andi Pratama'
  const studentNpsn = currentAssessment?.user?.npsn || user?.npsn || '20101111'
  const studentSchool = currentAssessment?.user?.school || user?.school || 'SMAN 1 Jakarta'
  const mentor = currentAssessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi'

  const renderPapiResult = () => {
    const dimScores = (currentAssessment?.dimension_scores || {}) as Record<string, number>
    const interp = currentAssessment?.interpretation || {}
    const topAspects = interp.top_aspects || []
    const majors = interp.majors || []

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5 mb-2">
                <Award size={16} /> HASIL PAPI KOSTICK
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                Profil Peran &amp; Gaya Kerja
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
                {interp.summary || 'Memetakan 20 aspek kepribadian kerja dan kebutuhan psikologis dalam lingkungan perkuliahan.'}
              </p>

              {topAspects.length > 0 && (
                <div className="mt-5 space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Aspek Paling Menonjol:
                  </h4>
                  {topAspects.map((asp: any, idx: number) => (
                    <div key={idx} className="bg-blue-50/80 rounded-2xl p-3 border border-blue-100/80">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-blue-900 font-extrabold">
                          #{idx + 1} {asp.name} ({asp.code})
                        </span>
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px]">
                          Skor: {asp.score}/9
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">{asp.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
              <div>{studentName} &middot; NPSN {studentNpsn} &middot; {studentSchool}</div>
              <div className="mt-0.5">Guru/Mentor : {mentor}</div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-gray-900 mb-1">Diagram Polar 20 Aspek</h4>
            <span className="text-[11px] text-gray-400 mb-3">Skor per aspek bernilai 0 - 9 (Total = 90)</span>
            <PapiRadarChart scores={dimScores} />
          </div>
        </div>

        {majors.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Compass size={18} className="text-blue-600" />
              Rekomendasi Rumpun Bidang Studi yang Selaras
            </h4>
            <div className="flex flex-wrap gap-2">
              {majors.map((m: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 text-xs font-bold shadow-2xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderDiscResult = () => {
    const dimScores = (currentAssessment?.dimension_scores || {}) as Record<string, any>
    const interp = currentAssessment?.interpretation || {}
    const majors = interp.majors || []
    const primaryCode = currentAssessment?.primary_result || 'D'

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 mb-1">
                <Award size={16} /> HASIL DiSC PSIKOTEST
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {interp.type_name || `Profil DiSC: ${primaryCode}`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1 max-w-2xl">
                {interp.summary || 'Menggambarkan pola perilaku, gaya komunikasi, serta cara beradaptasi dalam tim perkuliahan.'}
              </p>
            </div>
            <div className="text-center px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 shrink-0">
              <span className="text-[11px] font-bold text-emerald-700 block uppercase">Profil Utama</span>
              <span className="text-3xl font-black text-emerald-900 tracking-wider">{primaryCode}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-bold text-gray-900 mb-4">
              Tiga Profil Grafik (Mask, Core, Mirror)
            </h4>
            <DiscProfileChart dimensionScores={dimScores} />
          </div>
        </div>

        {majors.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" />
              Rekomendasi Program Studi Berdasarkan Gaya Perilaku DiSC
            </h4>
            <div className="flex flex-wrap gap-2">
              {majors.map((m: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold shadow-2xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderMbtiResult = () => {
    const dimScores = (currentAssessment?.dimension_scores || {}) as Record<string, any>
    const interp = currentAssessment?.interpretation || {}
    const percentages = dimScores.percentages || {}
    const majors = interp.majors || []
    const mbtiCode = currentAssessment?.primary_result || 'ENFP'

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5 mb-2">
                <Award size={16} /> HASIL SKALA MBTI
              </span>
              <div className="text-5xl sm:text-6xl font-black text-amber-400 tracking-widest my-3">
                {mbtiCode}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {interp.type_name || `Tipe MBTI: ${mbtiCode}`}
              </h3>
              <p className="text-xs sm:text-[13px] text-blue-100/90 leading-relaxed mt-2.5">
                {interp.summary || 'Kombinasi preferensi alami yang mempengaruhi cara memproses informasi dan mengambil keputusan.'}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-blue-200/80 font-medium space-y-1">
              <div>{studentName} &middot; NPSN {studentNpsn} &middot; {studentSchool}</div>
              <div>Guru/Mentor : {mentor}</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                Kecenderungan 4 Dimensi Kepribadian
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                Persentase preferensi antara dua kutub polaritas psikologis
              </p>
              <MbtiDimensionsBar percentages={percentages} />
            </div>
          </div>
        </div>

        {majors.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Compass size={18} className="text-indigo-600" />
              Rekomendasi Jurusan Perkuliahan yang Cocok untuk Tipe {mbtiCode}
            </h4>
            <div className="flex flex-wrap gap-2">
              {majors.map((m: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold shadow-2xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderRiasecResult = () => {
    const scoreR = currentAssessment?.score_r ?? 22
    const scoreS = currentAssessment?.score_s ?? 22
    const scoreI = currentAssessment?.score_i ?? 21
    const scoreE = currentAssessment?.score_e ?? 21
    const scoreA = currentAssessment?.score_a ?? 20
    const scoreC = currentAssessment?.score_c ?? 20

    const dimensions = [
      {
        code: 'R',
        name: 'Realistis',
        score: scoreR,
        color: 'bg-[#10B981]',
        badgeBg: 'bg-[#10B981]',
        desc: currentAssessment?.answers?.dimensions?.R?.desc || getDimensionDefaultContent('R', scoreR).desc,
        majors: currentAssessment?.answers?.dimensions?.R?.majors || getDimensionDefaultContent('R', scoreR).majors,
      },
      {
        code: 'S',
        name: 'Sosial',
        score: scoreS,
        color: 'bg-[#EF4444]',
        badgeBg: 'bg-[#EF4444]',
        desc: currentAssessment?.answers?.dimensions?.S?.desc || getDimensionDefaultContent('S', scoreS).desc,
        majors: currentAssessment?.answers?.dimensions?.S?.majors || getDimensionDefaultContent('S', scoreS).majors,
      },
      {
        code: 'I',
        name: 'Penyelidikan',
        score: scoreI,
        color: 'bg-[#3B82F6]',
        badgeBg: 'bg-[#3B82F6]',
        desc: currentAssessment?.answers?.dimensions?.I?.desc || getDimensionDefaultContent('I', scoreI).desc,
        majors: currentAssessment?.answers?.dimensions?.I?.majors || getDimensionDefaultContent('I', scoreI).majors,
      },
      {
        code: 'E',
        name: 'Giat',
        score: scoreE,
        color: 'bg-[#F59E0B]',
        badgeBg: 'bg-[#F59E0B]',
        desc: currentAssessment?.answers?.dimensions?.E?.desc || getDimensionDefaultContent('E', scoreE).desc,
        majors: currentAssessment?.answers?.dimensions?.E?.majors || getDimensionDefaultContent('E', scoreE).majors,
      },
      {
        code: 'A',
        name: 'Artistik',
        score: scoreA,
        color: 'bg-[#8B5CF6]',
        badgeBg: 'bg-[#8B5CF6]',
        desc: currentAssessment?.answers?.dimensions?.A?.desc || getDimensionDefaultContent('A', scoreA).desc,
        majors: currentAssessment?.answers?.dimensions?.A?.majors || getDimensionDefaultContent('A', scoreA).majors,
      },
      {
        code: 'C',
        name: 'Konvensional',
        score: scoreC,
        color: 'bg-[#475569]',
        badgeBg: 'bg-[#475569]',
        desc: currentAssessment?.answers?.dimensions?.C?.desc || getDimensionDefaultContent('C', scoreC).desc,
        majors: currentAssessment?.answers?.dimensions?.C?.majors || getDimensionDefaultContent('C', scoreC).majors,
      },
    ]

    const initialDominant = (currentAssessment?.dominant_code || currentAssessment?.primary_result || '').replace(/[^A-Za-z]/g, '').toUpperCase()
    const activeDominantCode = (
      initialDominant ||
      [...dimensions].sort((a, b) => b.score - a.score).slice(0, 3).map((d) => d.code).join('')
    )
    const dominantOrder = activeDominantCode.split('')

    const sortedDimensions = [...dimensions].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const idxA = dominantOrder.indexOf(a.code)
      const idxB = dominantOrder.indexOf(b.code)
      if (idxA !== -1 && idxB !== -1) return idxA - idxB
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1
      return 0
    })

    const topDimension = sortedDimensions[0]?.name || 'Realistis'
    const dominantCode = activeDominantCode.split('').join(' ')

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">PROFIL MINATMU</span>
              <div className="text-5xl sm:text-6xl font-black text-gray-900 tracking-widest my-4">{dominantCode}</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                Dimensi teratasmu adalah <strong className="text-gray-900 font-bold">{topDimension}</strong>. Hasil ini dapat menjadi titik awal studi eksplorasi.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-xs text-gray-500 font-medium">
              <div>{studentName} &middot; NPSN {studentNpsn} &middot; {studentSchool}</div>
              <div>Guru/Mentor : {mentor}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Peta enam dimensi</h3>
            <div className="space-y-4">
              {dimensions.map((d) => {
                const max = 28
                const percentage = Math.min(Math.round((d.score / max) * 100), 100)
                return (
                  <div key={d.name} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg ${d.badgeBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0`}>
                      {d.code}
                    </div>
                    <span className="w-28 text-xs font-bold text-gray-800 shrink-0">{d.name}</span>
                    <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-10 text-right shrink-0">{d.score}/{max}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDimensions.map((dim, idx) => (
            <div key={dim.code} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg ${dim.badgeBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
                      {dim.code}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">#{idx + 1} &middot; {dim.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      getScoreLevel(dim.score) === 'high'
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : getScoreLevel(dim.score) === 'medium'
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : 'text-slate-600 bg-slate-100 border border-slate-200'
                    }`}>
                      {getScoreLevel(dim.score) === 'high' ? 'Tinggi' : getScoreLevel(dim.score) === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">{dim.score}/28</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{dim.desc}</p>
              </div>
              <div className="pt-3 border-t border-gray-50">
                <span className="block text-[11px] font-bold text-gray-800 mb-1">Contoh bidang studi</span>
                <p className="text-xs text-gray-500">{dim.majors}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {availableTests.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {availableTests.map((t) => {
            const isActive = activeTestId === t.id
            const testAssessment = assessments?.find((a) => a.psychometric_test_id === t.id)
            const isImported = Boolean(
              (testAssessment &&
                (testAssessment.primary_result ||
                  testAssessment.dominant_code ||
                  (testAssessment.score_r !== undefined && testAssessment.score_r !== null))) ||
                (assessment?.psychometric_test_id === t.id &&
                  (assessment.primary_result ||
                    assessment.dominant_code ||
                    (assessment.score_r !== undefined && assessment.score_r !== null))) ||
                t.has_score,
            )

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTestId(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t.name}</span>
                {isImported ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sudah disinkronkan" />
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                    Belum sinkron
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!isSynced ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Clock size={32} className="animate-pulse" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-amber-800 bg-amber-50 uppercase tracking-wider border border-amber-200">
            Menunggu Sinkronisasi Spreadsheet
          </span>

          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Hasil {activeTestName} Sedang Diproses
          </h3>

          <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
            Kamu telah menyelesaikan pengisian formulir tes ini. Nilai dan analisis minat bakat akan otomatis muncul di sini segera setelah sinkronisasi data spreadsheet dijalankan oleh Guru atau Admin.
          </p>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 max-w-sm mx-auto text-left text-xs space-y-2 mt-4">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-gray-500 font-medium">Alat Tes:</span>
              <span className="font-bold text-gray-800">{activeTestName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-gray-500 font-medium">Nama Siswa:</span>
              <span className="font-bold text-gray-800">{studentName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-gray-500 font-medium">Guru/Mentor:</span>
              <span className="font-bold text-gray-800">{mentor}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500 font-medium">Status:</span>
              <span className="font-semibold text-amber-700">Selesai &middot; Menunggu Tarik Nilai</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {activeTestType === 'papi_kostick' && renderPapiResult()}
          {activeTestType === 'disc' && renderDiscResult()}
          {activeTestType === 'mbti' && renderMbtiResult()}
          {activeTestType === 'riasec' && renderRiasecResult()}
        </>
      )}

      {onBack && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-2xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold text-sm bg-white shadow-sm transition-all cursor-pointer"
          >
            {backButtonLabel || 'Kembali'}
          </button>
        </div>
      )}
    </div>
  )
}
