import React from 'react'
import PapiRadarChart from '@/components/Student/Psychometrics/PapiRadarChart'
import { Award, User, School } from 'lucide-react'
import MajorsSection from './MajorsSection'

interface PapiKostickDetailViewProps {
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

const PAPI_AREAS = [
  {
    name: 'Arah Kerja (Work Direction)',
    aspects: [
      { code: 'N', name: 'Need to Finish Task', desc: 'Dorongan menyelesaikan tugas secara mandiri hingga tuntas.' },
      { code: 'G', name: 'Hard Worker', desc: 'Bekerja keras, ulet, dan memiliki stamina kerja yang tinggi.' },
      { code: 'A', name: 'Need to Achieve', desc: 'Ambisi mencapai target dan prestasi terbaik.' },
    ],
  },
  {
    name: 'Kepemimpinan (Leadership)',
    aspects: [
      { code: 'L', name: 'Leadership Role', desc: 'Kecenderungan mengambil kendali dan memimpin kelompok.' },
      { code: 'P', name: 'Need to Control Others', desc: 'Dorongan mengatur, mendisiplinkan, dan mengarahkan orang lain.' },
      { code: 'I', name: 'Ease in Decision Making', desc: 'Kecepatan dan keberanian dalam mengambil keputusan penting.' },
    ],
  },
  {
    name: 'Aktivitas (Activity)',
    aspects: [
      { code: 'T', name: 'Pace', desc: 'Tempo kerja aktif, dinamis, dan bergerak lincah.' },
      { code: 'V', name: 'Vigorous Type', desc: 'Vitalitas fisik dan energi tinggi dalam bekerja secara langsung.' },
    ],
  },
  {
    name: 'Sifat Sosial (Social Nature)',
    aspects: [
      { code: 'X', name: 'Need to Be Noticed', desc: 'Dorongan untuk tampil di depan umum dan diperhatikan.' },
      { code: 'S', name: 'Social Extension', desc: 'Kemudahan membangun hubungan hangat dan jaringan sosial.' },
      { code: 'B', name: 'Need for Belonging', desc: 'Kebutuhan diterima sebagai bagian dari kelompok yang solid.' },
      { code: 'O', name: 'Need for Closeness', desc: 'Kebutuhan kedekatan emosional dan hubungan pribadi mendalam.' },
    ],
  },
  {
    name: 'Gaya Kerja (Work Style)',
    aspects: [
      { code: 'R', name: 'Theoretical Type', desc: 'Kecenderungan berpikir konseptual, analitis, dan teoritis.' },
      { code: 'D', name: 'Interest in Details', desc: 'Ketelitian tinggi terhadap detail data, angka, dan akurasi.' },
      { code: 'C', name: 'Organized Type', desc: 'Sistematika, keteraturan, dan perencanaan rapi dalam bekerja.' },
    ],
  },
  {
    name: 'Temperamen (Temperament)',
    aspects: [
      { code: 'Z', name: 'Need for Change', desc: 'Antusiasme terhadap variasi, perubahan, dan hal baru.' },
      { code: 'E', name: 'Emotional Resistant', desc: 'Kemampuan mengontrol emosi, tenang saat tertekan.' },
      { code: 'K', name: 'Need to Be Forceful', desc: 'Ketegasan dan sikap pantang menyerah saat menghadapi rintangan.' },
    ],
  },
  {
    name: 'Ketaatan (Subordination)',
    aspects: [
      { code: 'F', name: 'Need for Authority', desc: 'Loyalitas dan rasa hormat terhadap arahan pimpinan.' },
      { code: 'W', name: 'Need for Rules', desc: 'Kepatuhan terhadap SOP, regulasi, dan prosedur terstruktur.' },
    ],
  },
]

export default function PapiKostickDetailView({
  assessment,
  student,
  mentorName,
  canEdit = true,
  onSaveMajors,
  isSavingMajors = false,
}: PapiKostickDetailViewProps) {
  const scores: Record<string, number> = assessment?.dimension_scores ?? {}
  const interpretation = assessment?.interpretation ?? {}
  const dominantCode =
    assessment?.dominant_code ||
    assessment?.primary_result ||
    interpretation?.top_aspects?.map((a: any) => a.code).join('') ||
    '-'

  const topAspects: any[] = interpretation?.top_aspects || []
  const suggestedMajors: string[] = interpretation?.majors || [
    'Manajemen Bisnis',
    'Ilmu Komunikasi',
    'Teknik Informatika',
  ]

  const getScoreBadge = (score: number) => {
    if (score >= 6) {
      return { label: 'Tinggi', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    }
    if (score >= 4) {
      return { label: 'Sedang', cls: 'text-amber-700 bg-amber-50 border-amber-200' }
    }
    return { label: 'Rendah', cls: 'text-slate-600 bg-slate-100 border-slate-200' }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <Award size={14} />
              PROFIL ASESMEN PAPI KOSTICK
            </span>
            <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-wider my-4">
              {dominantCode}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              {interpretation?.summary ||
                "Profil kecenderungan dinamika kerja berdasarkan 20 aspek kepribadian PAPI Kostick."}
            </p>

            {topAspects.length > 0 && (
              <div className="mt-5 space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  3 Aspek Paling Dominan:
                </span>
                <div className="flex flex-wrap gap-2">
                  {topAspects.map((item: any) => (
                    <span
                      key={item.code}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold"
                    >
                      <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                        {item.code}
                      </span>
                      <span>
                        {item.name} ({scores[item.code] ?? item.score ?? 0}/9)
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
            <h3 className="text-base font-bold text-gray-900">Diagram Polar 20 Aspek</h3>
            <p className="text-xs text-gray-500">Skor per aspek bernilai 0 - 9 (Total akumulasi 90)</p>
          </div>
          <PapiRadarChart scores={scores} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Rincian 20 Aspek Kepribadian Kerja</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Dikelompokkan ke dalam 7 area peran kerja profesional
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAPI_AREAS.map((area) => (
            <div
              key={area.name}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
                  {area.name}
                </h4>
                <div className="space-y-2.5">
                  {area.aspects.map((asp) => {
                    const score = scores[asp.code] ?? 0
                    const badge = getScoreBadge(score)
                    return (
                      <div
                        key={asp.code}
                        className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center">
                              {asp.code}
                            </span>
                            <span className="text-xs font-bold text-gray-800">{asp.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              {score}/9
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug">{asp.desc}</p>
                      </div>
                    )
                  })}
                </div>
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
        title="Rekomendasi Program Studi Berdasarkan Profil PAPI"
        subtitle="Bidang perkuliahan yang selaras dengan kecenderungan dinamika kerja dan daya tahan:"
      />
    </div>
  )
}
