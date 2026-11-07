import React from 'react'
import DiscProfileChart from '@/components/Student/Psychometrics/DiscProfileChart'
import { Award, User, School } from 'lucide-react'
import MajorsSection from './MajorsSection'

interface DiscDetailViewProps {
  assessment: any
  student: {
    id: number
    name: string
    npsn?: string
    school?: string
  }
  mentorName: string
  canEdit?: boolean
  onSaveMajors?: (majors: string[]) => void
  isSavingMajors?: boolean
}

const DISC_DIMENSIONS = [
  {
    code: 'D',
    name: 'Dominance',
    color: 'bg-rose-500',
    desc: 'Berorientasi pada hasil, berani mengambil risiko, kompetitif, dan cepat mengatasi tantangan.',
  },
  {
    code: 'I',
    name: 'Influence',
    color: 'bg-amber-500',
    desc: 'Antusias, persuasif, optimis, dan mahir membangun jejaring serta kolaborasi tim.',
  },
  {
    code: 'S',
    name: 'Steadiness',
    color: 'bg-emerald-500',
    desc: 'Sabar, konsisten, setia kawan, pendengar yang baik, dan menyukai stabilitas.',
  },
  {
    code: 'C',
    name: 'Compliance',
    color: 'bg-blue-500',
    desc: 'Teliti, analitis, sistematis, mematuhi standar kualitas dan prosedur baku.',
  },
]

export default function DiscDetailView({
  assessment,
  student,
  mentorName,
  canEdit = true,
  onSaveMajors,
  isSavingMajors = false,
}: DiscDetailViewProps) {
  const dimScores = assessment?.dimension_scores ?? {}
  const interpretation = assessment?.interpretation ?? {}
  const primaryResult =
    assessment?.primary_result ||
    assessment?.dominant_code ||
    interpretation?.profile_code ||
    'D'

  const most = dimScores.graph1_most || { D: 0, I: 0, S: 0, C: 0 }
  const least = dimScores.graph2_least || { D: 0, I: 0, S: 0, C: 0 }
  const diff = dimScores.graph3_diff || {
    D: (most.D ?? 0) - (least.D ?? 0),
    I: (most.I ?? 0) - (least.I ?? 0),
    S: (most.S ?? 0) - (least.S ?? 0),
    C: (most.C ?? 0) - (least.C ?? 0),
  }

  const suggestedMajors: string[] = interpretation?.majors || [
    'Manajemen Bisnis',
    'Ilmu Komunikasi',
    'Teknik Industri',
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <Award size={14} />
              PROFIL ASESMEN DiSC
            </span>
            <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-wider my-4">
              Tipe {primaryResult}
            </div>
            <h4 className="text-sm font-bold text-gray-800 mb-1">
              {interpretation?.type_name || interpretation?.title || `Pola Perilaku ${primaryResult}`}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {interpretation?.summary ||
                "Profil kecenderungan respon perilaku dalam menghadapi masalah, orang lain, tempo, dan prosedur."}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <School size={13} className="text-gray-400 shrink-0" />
              <span>
                {student.name} &middot; NPSN {student.npsn || '-'} &middot; {student.school || '-'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={13} className="text-gray-400 shrink-0" />
              <span>Guru/Mentor Pembimbing: {mentorName}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center">
          <div className="w-full text-left mb-2">
            <h3 className="text-base font-bold text-gray-900">
              Tiga Profil Grafik (Mask, Core, Mirror)
            </h3>
            <p className="text-xs text-gray-500">
              Grafik 1 (Publik/Most), Grafik 2 (Inti/Least), dan Grafik 3 (Cermin/Selisih)
            </p>
          </div>
          <DiscProfileChart dimensionScores={dimScores} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="pb-4 mb-6 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Rincian Skor Dimensi DiSC</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Komparasi skor Most (Paling Sesuai), Least (Paling Tidak Sesuai), dan Selisih
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DISC_DIMENSIONS.map((dim) => {
            const mVal = most[dim.code] ?? 0
            const lVal = least[dim.code] ?? 0
            const dVal = diff[dim.code] ?? 0
            return (
              <div
                key={dim.code}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-7 h-7 rounded-lg ${dim.color} text-white font-black text-xs flex items-center justify-center`}
                    >
                      {dim.code}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">{dim.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug mb-4">{dim.desc}</p>
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Most (Sesuai):</span>
                    <span className="font-bold text-gray-900">{mVal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Least (Tidak):</span>
                    <span className="font-bold text-gray-900">{lVal}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100 font-extrabold">
                    <span className="text-indigo-600">Selisih (Mirror):</span>
                    <span className={dVal >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {dVal > 0 ? `+${dVal}` : dVal}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <MajorsSection
        majors={suggestedMajors}
        canEdit={canEdit}
        isSaving={isSavingMajors}
        onSave={onSaveMajors}
        title="Rekomendasi Program Studi Berdasarkan Gaya DiSC"
        subtitle="Bidang perkuliahan dan karier yang sesuai dengan dinamika komunikasi serta orientasi kerja:"
      />
    </div>
  )
}
