import React from 'react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'

export default function StudentSimulasiKuliah() {
  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="simulasi_kuliah">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Simulasi Kehidupan Kampus</h2>
        <p className="text-gray-500 mb-8">Pahami alur kegiatan mahasiswa dari awal masuk hingga lulus.</p>

        <div className="relative border-l-2 border-blue-200 ml-4 space-y-12 pb-8">
          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-blue-600 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm text-white">
              1
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">PKKMB & Orientasi</h3>
              <p className="text-gray-600 text-sm mt-2">
                Pengenalan Kehidupan Kampus bagi Mahasiswa Baru. Momen pengenalan lingkungan kampus, fakultas, dan organisasi kemahasiswaan.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-white border-2 border-blue-400 w-7 h-7 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
              2
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Pengisian KRS (Kartu Rencana Studi)</h3>
              <p className="text-gray-600 text-sm mt-2">
                Setiap awal semester, mahasiswa memilih mata kuliah yang akan diambil berdasarkan Indeks Prestasi (IP) semester sebelumnya.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-white border-2 border-blue-400 w-7 h-7 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
              3
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">UTS & UAS</h3>
              <p className="text-gray-600 text-sm mt-2">
                Ujian Tengah Semester dan Ujian Akhir Semester adalah evaluasi utama untuk menentukan nilai huruf (A, B, C, D, E) pada mata kuliah.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-white border-2 border-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
              4
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
              <h3 className="text-lg font-bold text-gray-900">KKN / Magang (PKL)</h3>
              <p className="text-gray-600 text-sm mt-2">
                Kuliah Kerja Nyata atau Praktik Kerja Lapangan. Mengaplikasikan ilmu langsung di masyarakat atau industri.
              </p>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-3.5 top-1 bg-white border-2 border-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
              5
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
              <h3 className="text-lg font-bold text-gray-900">Skripsi / Tugas Akhir</h3>
              <p className="text-gray-600 text-sm mt-2">
                Karya ilmiah akhir sebagai syarat kelulusan untuk mendapatkan gelar sarjana.
              </p>
            </div>
          </div>

          <div className="pl-8">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-lg font-bold text-blue-900">Coba simulasi kuliah online</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Fitur simulasi kuliah online dapat diakses melalui aplikasi Learning Management System (LMS). Di sana kamu dapat mengenal pengalaman belajar daring seperti mengakses materi, mengerjakan tugas, dan mengikuti aktivitas perkuliahan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
