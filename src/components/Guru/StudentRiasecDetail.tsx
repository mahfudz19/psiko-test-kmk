import React from 'react'
import { ArrowLeft } from 'lucide-react'

export interface StudentRiasecDetailData {
  id: number
  name: string
  npsn: string
  school: string
  testStatus: string
  dominantCode?: string
  assessment?: {
    score_r?: number
    score_i?: number
    score_a?: number
    score_s?: number
    score_e?: number
    score_c?: number
    dominant_code?: string
    mentor_name?: string
  } | null
}

interface StudentRiasecDetailProps {
  student: StudentRiasecDetailData
  onBack: () => void
}

interface DimensionInfo {
  code: string
  name: string
  score: number
  color: string
  badgeBg: string
  desc: string
  majors: string
}

export default function StudentRiasecDetail({
  student,
  onBack,
}: StudentRiasecDetailProps) {
  const assessment = student.assessment

  const scoreS = assessment?.score_s ?? 26
  const scoreA = assessment?.score_a ?? 24
  const scoreI = assessment?.score_i ?? 22
  const scoreE = assessment?.score_e ?? 20
  const scoreC = assessment?.score_c ?? 17
  const scoreR = assessment?.score_r ?? 15

  const rawDimensions: DimensionInfo[] = [
    {
      code: 'S',
      name: 'Social',
      score: scoreS,
      color: 'bg-[#EF4444]',
      badgeBg: 'bg-[#EF4444]',
      desc: 'Senang membantu, mengajar, dan bekerja bersama orang lain.',
      majors: 'Pendidikan, Konseling, Keperawatan, Hubungan Masyarakat',
    },
    {
      code: 'A',
      name: 'Artistic',
      score: scoreA,
      color: 'bg-[#8B5CF6]',
      badgeBg: 'bg-[#8B5CF6]',
      desc: 'Kreatif, ekspresif, dan nyaman mengembangkan gagasan baru.',
      majors: 'Desain, Arsitektur, Sastra, Seni dan Media',
    },
    {
      code: 'I',
      name: 'Investigative',
      score: scoreI,
      color: 'bg-[#3B82F6]',
      badgeBg: 'bg-[#3B82F6]',
      desc: 'Analitis, ingin tahu, dan menikmati pemecahan masalah.',
      majors: 'Psikologi, Kedokteran, Sains, Teknologi',
    },
    {
      code: 'E',
      name: 'Enterprising',
      score: scoreE,
      color: 'bg-[#F59E0B]',
      badgeBg: 'bg-[#F59E0B]',
      desc: 'Menyukai peran kepemimpinan, berani mengambil risiko, dan persuasif.',
      majors: 'Manajemen, Bisnis, Hukum, Pemasaran',
    },
    {
      code: 'C',
      name: 'Conventional',
      score: scoreC,
      color: 'bg-[#475569]',
      badgeBg: 'bg-[#475569]',
      desc: 'Teratur, menyukai ketelitian data, sistematis, dan terorganisir.',
      majors: 'Akuntansi, Administrasi, Keuangan, Perpajakan',
    },
    {
      code: 'R',
      name: 'Realistic',
      score: scoreR,
      color: 'bg-[#10B981]',
      badgeBg: 'bg-[#10B981]',
      desc: 'Senang bekerja dengan alat, benda nyata, dan kegiatan di luar ruangan.',
      majors: 'Teknik, Pertanian, Konstruksi, Pariwisata',
    },
  ]

  const sortedDimensions = [...rawDimensions].sort((a, b) => b.score - a.score)
  const topDimensions = sortedDimensions.slice(0, 3)

  const dominantCode =
    assessment?.dominant_code || topDimensions.map((d) => d.code).join('')

  const topDimension = topDimensions[0]?.name || 'Social'
  const mentor = assessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke daftar siswa
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              PROFIL MINAT SISWA
            </span>
            <div className="text-5xl sm:text-6xl font-black text-gray-900 tracking-wider my-4">
              {dominantCode}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Dimensi teratas siswa adalah{' '}
              <strong className="text-gray-900 font-bold">{topDimension}</strong> . Hasil ini dapat menjadi titik awal eksplorasi studi.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-xs text-gray-500 font-medium">
            <div>
              {student.name} &middot; NPSN {student.npsn} &middot; {student.school}
            </div>
            <div>
              Guru BK / mentor: {mentor}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Peta enam dimensi
          </h3>

          <div className="space-y-4">
            {sortedDimensions.map((d) => {
              const max = 28
              const percentage = Math.min(Math.round((d.score / max) * 100), 100)

              return (
                <div key={d.code} className="flex items-center gap-3">
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
        {topDimensions.map((dim, idx) => (
          <div
            key={dim.code}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-indigo-600 mb-2">
                #{idx + 1} &middot; {dim.name}
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
    </div>
  )
}
