import React from 'react'
import { Clock, CheckCircle2, FileSpreadsheet } from 'lucide-react'

interface RiasecEmptyResultProps {
  user?: any
  assessment?: any
}

export default function RiasecEmptyResult({
  user,
  assessment,
}: RiasecEmptyResultProps) {
  const studentName = assessment?.user?.name || user?.name || 'Andi Pratama'
  const studentNpsn = assessment?.user?.npsn || user?.npsn || '20101111'
  const studentSchool = assessment?.user?.school || user?.school || 'SMAN 1 Jakarta'
  const mentor = assessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl bg-[#25246B] px-8 py-10 text-white shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/20 text-emerald-200 mb-4 border border-emerald-500/30">
            <CheckCircle2 size={14} />
            <span>SELURUH TES TELAH DISELESAIKAN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Terima Kasih, Asesmen Telah Lengkap!
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Semua instrumen tes minat bakat telah berhasil kamu tandai sebagai selesai. Hasil analisismu saat ini sedang dalam antrean pengolahan nilai.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto">
        <div className="w-20 h-20 bg-indigo-50 text-[#4355F9] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Clock size={40} className="animate-pulse" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 mb-3 uppercase tracking-wider">
          Menunggu Rekap Nilai Admin
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          Hasil Asesmen Sedang Diproses
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
          Jawaban Google Form kamu sedang diproses dan direkapitulasi oleh Guru/Mentor & Admin. Lembar hasil analisis RIASEC dan rekomendasi jurusan akan otomatis ditampilkan begitu data spreadsheet telah diimpor.
        </p>

        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 max-w-md mx-auto text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-gray-500 font-medium">Nama Siswa:</span>
            <span className="font-bold text-gray-800">{studentName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-gray-500 font-medium">NPSN:</span>
            <span className="font-bold text-gray-800">{studentNpsn}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-gray-500 font-medium">Sekolah:</span>
            <span className="font-bold text-gray-800">{studentSchool}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 font-medium">Guru/Mentor:</span>
            <span className="font-bold text-gray-800">{mentor}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-slate-400">
          <FileSpreadsheet size={16} />
          <span>Status: Menunggu sinkronisasi berkas oleh administrator</span>
        </div>
      </div>
    </div>
  )
}
