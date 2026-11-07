import React from 'react'
import MbtiDimensionsBar from '@/components/Student/Psychometrics/MbtiDimensionsBar'
import { Award, User, School } from 'lucide-react'
import MajorsSection from './MajorsSection'

interface MbtiDetailViewProps {
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

const MBTI_DIMENSION_DETAILS = [
  {
    left: 'Extraversion (E)',
    right: 'Introversion (I)',
    pairKey: 'EI',
    desc: 'Fokus energi dan interaksi: Ekstrover memperoleh energi dari lingkungan luar dan interaksi sosial, sedangkan Introver memperoleh energi dari refleksi internal dan ketenangan.',
  },
  {
    left: 'Sensing (S)',
    right: 'Intuition (N)',
    pairKey: 'SN',
    desc: 'Cara menyerap informasi: Sensing fokus pada data faktual, nyata, dan praktis, sedangkan Intuisi fokus pada pola makna, kemungkinan masa depan, dan konsep abstrak.',
  },
  {
    left: 'Thinking (T)',
    right: 'Feeling (F)',
    pairKey: 'TF',
    desc: 'Dasar pengambilan keputusan: Thinking mendasarkan keputusan pada logika obyektif dan konsistensi nalar, sedangkan Feeling mendasarkan keputusan pada empati, nilai kemanusiaan, dan harmoni.',
  },
  {
    left: 'Judging (J)',
    right: 'Perceiving (P)',
    pairKey: 'JP',
    desc: 'Pola orientasi hidup: Judging menyukai perencanaan matang, ketertiban terstruktur, dan kepastian, sedangkan Perceiving menyukai fleksibilitas, spontanitas, dan adaptabilitas.',
  },
]

export default function MbtiDetailView({
  assessment,
  student,
  mentorName,
  canEdit = true,
  onSaveMajors,
  isSavingMajors = false,
}: MbtiDetailViewProps) {
  const dimScores = assessment?.dimension_scores ?? {}
  const interpretation = assessment?.interpretation ?? {}
  const primaryResult =
    assessment?.primary_result ||
    assessment?.dominant_code ||
    dimScores?.type ||
    'ENFJ'

  const percentages = dimScores.percentages ?? {
    E: primaryResult.includes('E') ? 65 : 35,
    I: primaryResult.includes('I') ? 65 : 35,
    S: primaryResult.includes('S') ? 65 : 35,
    N: primaryResult.includes('N') ? 65 : 35,
    T: primaryResult.includes('T') ? 65 : 35,
    F: primaryResult.includes('F') ? 65 : 35,
    J: primaryResult.includes('J') ? 65 : 35,
    P: primaryResult.includes('P') ? 65 : 35,
  }

  const suggestedMajors: string[] = interpretation?.majors || [
    'Ilmu Komunikasi',
    'Manajemen Bisnis',
    'Teknik Informatika',
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <Award size={14} />
              PROFIL KEPRIBADIAN MBTI
            </span>
            <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-wider my-4">
              {primaryResult}
            </div>
            <h4 className="text-sm font-bold text-gray-800 mb-1">
              {interpretation?.type_name || `Tipe MBTI ${primaryResult}`}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {interpretation?.summary ||
                "Kombinasi preferensi kepribadian unik dalam menyerap informasi dan mengambil keputusan."}
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

        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-center">
          <div className="w-full text-left mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Kecenderungan 4 Dimensi Kepribadian
            </h3>
            <p className="text-xs text-gray-500">
              Persentase preferensi antara dua kutub polaritas psikologis
            </p>
          </div>
          <MbtiDimensionsBar percentages={percentages} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="pb-4 mb-6 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            Penjelasan 4 Poros Dimensi Psikologis
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Dinamika interaksi fungsi psikologis berdasarkan teori tipologi kepribadian Carl Jung
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MBTI_DIMENSION_DETAILS.map((d) => (
            <div
              key={d.pairKey}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                    {d.left} vs {d.right}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MajorsSection
        majors={suggestedMajors}
        canEdit={canEdit}
        isSaving={isSavingMajors}
        onSave={onSaveMajors}
        title="Rekomendasi Program Studi Berdasarkan Tipe MBTI"
        subtitle={`Program studi yang paling sesuai dengan gaya belajar dan preferensi kognitif ${primaryResult}:`}
      />
    </div>
  )
}
