import React from 'react'
import { GraduationCap, ChevronRight } from 'lucide-react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'

export default function StudentSimulasiKuliah() {
  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="simulasi_kuliah">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Simulasi Kehidupan Kampus</h2>
        <p className="text-sm text-gray-500 mb-8">Pahami alur kegiatan siswa dari awal masuk hingga lulus.</p>

        <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 pb-4">
          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-blue-600 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white font-bold text-xs">
              1
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">PKKMB &amp; Orientasi</h3>
              <p className="text-gray-600 text-sm mt-1.5">
                Pengenalan lingkungan kampus, fakultas, dan organisasi kemahasiswaan.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-blue-600 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white font-bold text-xs">
              2
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Pengisian KRS</h3>
              <p className="text-gray-600 text-sm mt-1.5">
                Memilih mata kuliah berdasarkan rencana studi dan kapasitas semester.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-blue-600 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white font-bold text-xs">
              3
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">UTS &amp; UAS</h3>
              <p className="text-gray-600 text-sm mt-1.5">
                Evaluasi utama untuk menentukan nilai setiap mata kuliah.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-slate-300 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white font-bold text-xs">
              4
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
              <h3 className="text-base font-bold text-gray-900">KKN / Magang</h3>
              <p className="text-gray-600 text-sm mt-1.5">
                Mengaplikasikan ilmu langsung di masyarakat atau industri.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-slate-300 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white font-bold text-xs">
              5
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
              <h3 className="text-base font-bold text-gray-900">Skripsi / Tugas Akhir</h3>
              <p className="text-gray-600 text-sm mt-1.5">
                Karya ilmiah akhir sebagai syarat kelulusan.
              </p>
            </div>
          </div>

          <div className="pl-8 pt-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-base font-bold text-blue-900">Coba simulasi kuliah online</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                Kenali pengalaman belajar daring seperti mengakses materi, mengerjakan tugas, dan mengikuti aktivitas perkuliahan.
              </p>
              <div className="mt-4">
                <a
                  href="https://lms.mahasiswa.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <GraduationCap size={18} />
                  <span>Coba Simulasi Kuliah Online</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
