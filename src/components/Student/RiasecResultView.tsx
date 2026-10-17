import React, { useState } from 'react'
import { getDimensionDefaultContent, getScoreLevel } from '@/features/riasec/dimensionProfiles'

export interface RiasecAssessmentData {
  id?: number
  user_id?: number
  psychometric_test_id?: number
  score_r?: number
  score_i?: number
  score_a?: number
  score_s?: number
  score_e?: number
  score_c?: number
  dominant_code?: string
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
}

interface TestOption {
  id: number
  name: string
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
  const availableTests =
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
          name: `Alat Tes ${idx + 1}`,
        }))
      : []

  const [activeTestId, setActiveTestId] = useState<number | null>(() => {
    if (assessment?.psychometric_test_id) {
      return assessment.psychometric_test_id
    }
    if (assessments && assessments.length > 0 && assessments[0].psychometric_test_id) {
      return assessments[0].psychometric_test_id
    }
    if (availableTests.length > 0) {
      return availableTests[0].id
    }
    return null
  })

  const currentAssessment =
    (assessments && activeTestId
      ? assessments.find((a) => a.psychometric_test_id === activeTestId)
      : null) ||
    assessment

  const studentName = currentAssessment?.user?.name || user?.name || 'Andi Pratama'
  const studentNpsn = currentAssessment?.user?.npsn || user?.npsn || '20101111'
  const studentSchool = currentAssessment?.user?.school || user?.school || 'SMAN 1 Jakarta'
  const mentor = currentAssessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi'

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

  const initialDominant = (
    currentAssessment?.dominant_code ||
    ''
  ).replace(/[^A-Za-z]/g, '').toUpperCase()

  const activeDominantCode = (
    initialDominant ||
    [...dimensions].sort((a, b) => b.score - a.score).slice(0, 3).map((d) => d.code).join('')
  )

  const dominantOrder = activeDominantCode.split('')

  const sortedDimensions = [...dimensions].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {availableTests.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {availableTests.map((t) => {
            const isActive = activeTestId === t.id
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
              </button>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              PROFIL MINATMU
            </span>
            <div className="text-5xl sm:text-6xl font-black text-gray-900 tracking-widest my-4">
              {dominantCode}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Dimensi teratasmu adalah{' '}
              <strong className="text-gray-900 font-bold">{topDimension}</strong> . Hasil ini dapat menjadi titik awal studi eksplorasi.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-xs text-gray-500 font-medium">
            <div>
              {studentName} &middot; NPSN {studentNpsn} &middot; {studentSchool}
            </div>
            <div>
              Guru/Mentor : {mentor}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Peta enam dimensi
          </h3>

          <div className="space-y-4">
            {dimensions.map((d) => {
              const max = 28
              const percentage = Math.min(Math.round((d.score / max) * 100), 100)

              return (
                <div key={d.name} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg ${d.badgeBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0`}
                  >
                    {d.code}
                  </div>
                  <span className="w-28 text-xs font-bold text-gray-800 shrink-0">
                    {d.name}
                  </span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${d.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-10 text-right shrink-0">
                    {d.score}/{max}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDimensions.map((dim, idx) => (
          <div
            key={dim.code}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg ${dim.badgeBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}
                  >
                    {dim.code}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">
                    #{idx + 1} &middot; {dim.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      getScoreLevel(dim.score) === 'high'
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : getScoreLevel(dim.score) === 'medium'
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : 'text-slate-600 bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {getScoreLevel(dim.score) === 'high'
                      ? 'Tinggi'
                      : getScoreLevel(dim.score) === 'medium'
                      ? 'Sedang'
                      : 'Rendah'}
                  </span>
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {dim.score}/28
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {dim.desc}
              </p>
            </div>
            <div className="pt-3 border-t border-gray-50">
              <span className="block text-[11px] font-bold text-gray-800 mb-1">
                Contoh bidang studi
              </span>
              <p className="text-xs text-gray-500">
                {dim.majors}
              </p>
            </div>
          </div>
        ))}
      </div>

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
