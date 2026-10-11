import React from 'react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'
import { CheckSquare, ChevronRight } from 'lucide-react'

export default function StudentSimulasiPmb() {
  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="simulasi_pmb">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 max-w-3xl">
        <div className="w-14 h-14 bg-orange-100/70 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
          <CheckSquare size={28} className="text-orange-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Simulasi Penerimaan Mahasiswa Baru (PMB)
        </h2>

        <div className="text-gray-600 text-[15px] leading-relaxed space-y-4 mb-8">
          <p>
            <strong>Apa itu PMB?</strong> PMB atau Penerimaan Mahasiswa Baru adalah proses seleksi resmi yang dilakukan oleh Perguruan Tinggi (Negeri maupun Swasta) untuk menyaring calon mahasiswa yang memenuhi kualifikasi akademik.
          </p>

          <p>
            Di Indonesia, jalur seleksi Perguruan Tinggi Negeri (PTN) secara umum terbagi menjadi tiga:
          </p>

          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>SNBP (Seleksi Nasional Berdasarkan Prestasi):</strong> Jalur undangan yang menggunakan nilai rapor dan portofolio prestasi (tanpa tes).
            </li>
            <li>
              <strong>SNBT (Seleksi Nasional Berdasarkan Tes):</strong> Jalur tes tertulis berbasis komputer (UTBK) yang menguji Tes Potensi Skolastik (TPS), Literasi Bahasa (Indonesia &amp; Inggris), dan Penalaran Matematika.
            </li>
            <li>
              <strong>Seleksi Mandiri:</strong> Jalur ujian yang diselenggarakan dan dikelola secara mandiri oleh masing-masing kampus.
            </li>
          </ul>

          <p>
            Setelah mengikuti seleksi calon mahasiswa baru, selanjutnya calon mahasiswa baru akan registrasi portal penerimaan mahasiswa baru di Perguruan Tinggi.
          </p>
        </div>

        <a
          href="https://generasi.univeral.ac.id/pmb"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-colors shadow-md shadow-orange-200"
        >
          <span>Mulai Coba Sekarang</span>
          <ChevronRight size={18} />
        </a>
      </div>
    </PortalLayout>
  )
}
