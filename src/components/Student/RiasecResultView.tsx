import React from 'react'
import { router } from '@inertiajs/react'

export interface RiasecAssessmentData {
  id?: number
  user_id?: number
  score_r?: number
  score_i?: number
  score_a?: number
  score_s?: number
  score_e?: number
  score_c?: number
  dominant_code?: string
  mentor_name?: string
  class_name?: string
  attendance_number?: string
  user?: {
    name?: string
    npsn?: string
    school?: string
  }
}

interface RiasecResultViewProps {
  assessment: RiasecAssessmentData | null
  user?: any
  isReadOnly?: boolean
}

export default function RiasecResultView({
  assessment,
  user,
  isReadOnly = false,
}: RiasecResultViewProps) {
  const studentName = assessment?.user?.name || user?.name || 'Andi Pratama'
  const studentNpsn = assessment?.user?.npsn || user?.npsn || '20101111'
  const studentSchool = assessment?.user?.school || user?.school || 'SMAN 1 Jakarta'
  const mentor = assessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi'

  const scoreR = assessment?.score_r ?? 22
  const scoreS = assessment?.score_s ?? 22
  const scoreI = assessment?.score_i ?? 21
  const scoreE = assessment?.score_e ?? 21
  const scoreA = assessment?.score_a ?? 20
  const scoreC = assessment?.score_c ?? 20

  const dominantCode = (assessment?.dominant_code || 'RSI')
    .toUpperCase()
    .split('')
    .join(' ')

  const dimensions = [
    {
      code: 'R',
      name: 'Realistis',
      score: scoreR,
      color: 'bg-[#10B981]',
      badgeBg: 'bg-[#10B981]',
    },
    {
      code: 'S',
      name: 'Sosial',
      score: scoreS,
      color: 'bg-[#EF4444]',
      badgeBg: 'bg-[#EF4444]',
    },
    {
      code: 'SAYA',
      name: 'Penyelidikan',
      score: scoreI,
      color: 'bg-[#3B82F6]',
      badgeBg: 'bg-[#3B82F6]',
    },
    {
      code: 'E',
      name: 'Giat',
      score: scoreE,
      color: 'bg-[#F59E0B]',
      badgeBg: 'bg-[#F59E0B]',
    },
    {
      code: 'A',
      name: 'Artistik',
      score: scoreA,
      color: 'bg-[#8B5CF6]',
      badgeBg: 'bg-[#8B5CF6]',
    },
    {
      code: 'C',
      name: 'Konvensional',
      score: scoreC,
      color: 'bg-[#475569]',
      badgeBg: 'bg-[#475569]',
    },
  ]

  const topDimensions = [
    {
      num: '# 1',
      name: 'Realistis',
      desc: 'Senang bekerja dengan alat, benda nyata, dan kegiatan di luar ruangan.',
      majors: 'Teknik, Pertanian, Konstruksi, Pariwisata',
    },
    {
      num: '# 2',
      name: 'Sosial',
      desc: 'Senang berinteraksi, membantu, dan mengajar orang lain.',
      majors: 'Konseling, Keperawatan, Pendidikan, Humas',
    },
    {
      num: '# 3',
      name: 'Investigasi',
      desc: 'Senang mengamati, meneliti, dan memecahkan persoalan.',
      majors: 'Kedokteran, Biologi, Kimia, Psikologi',
    },
  ]

  const handleReset = () => {
    if (confirm('Ulangi asesmen minat bakat? Hasil saat ini akan direset.')) {
      router.post('/student/riasec/reset', {}, { preserveScroll: true })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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
              <strong className="text-gray-900 font-bold">Realistis</strong> . Hasil ini dapat menjadi titik awal studi eksplorasi.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-xs text-gray-500 font-medium">
            <div>
              {studentName} &middot; NPSN {studentNpsn} &middot; {studentSchool}
            </div>
            <div>
              Guru BK / pembimbing : {mentor}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topDimensions.map((dim) => (
          <div
            key={dim.name}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-indigo-600 mb-2">
                {dim.num} &middot; {dim.name}
              </h4>
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

      {!isReadOnly && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold text-sm bg-white shadow-sm transition-all"
          >
            Pengulangan asesmen
          </button>
        </div>
      )}
    </div>
  )
}
