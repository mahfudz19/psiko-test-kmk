import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import {
  Compass,
  BookOpen,
  Users,
  ChevronRight,
  ChevronDown,
  Check,
  Calendar,
  Clock,
} from 'lucide-react'
import { studentMenuItems } from '../../config/navigation'

export default function StudentDashboard() {
  const { auth } = usePage<any>().props
  const userName = auth?.user?.name || 'Andi Pratama'

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="dashboard">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Halo, {userName}!</h1>
          <p className="text-blue-100 text-lg">
            Selamat datang kembali di Portal Siswa Gen-U. Mari lanjutkan penjelajahan karirmu!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    TES STATUS
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">Selesai</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hasil menunjukkan minat yang kuat pada bidang{' '}
                <strong className="text-gray-800 font-bold">Sains & Teknologi</strong> .
              </p>
            </div>
            <div className="pt-4 mt-2">
              <Link
                href="/student/riasec"
                className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                Lihat Detail Hasil &gt;
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    EKSPLORASI JURUSAN
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    3 Jurusan Disimpan
                  </h3>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[60%] rounded-full" />
              </div>
            </div>
            <p className="text-xs text-gray-400 font-medium text-right pt-2">
              Target: 5 Jurusan
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                    MENTORING MENDATANG
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    Bpk. Budi Santoso
                  </h3>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
                <Clock size={13} className="text-gray-400" /> Besok, 14:00 WITA
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-gray-900 mb-2">Kecocokan Bidang Studi</h3>

            <div className="flex items-center justify-center py-2">
              <svg className="w-full max-w-[340px] h-56" viewBox="0 0 300 240">
                <polygon
                  points="150,45 228,90 228,180 150,225 72,180 72,90"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="1.5"
                />
                <polygon
                  points="150,75 202,105 202,165 150,195 98,165 98,105"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1.2"
                />
                <polygon
                  points="150,105 176,120 176,150 150,165 124,150 124,120"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />

                <line x1="150" y1="135" x2="150" y2="45" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="150" y1="135" x2="228" y2="90" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="150" y1="135" x2="228" y2="180" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="150" y1="135" x2="150" y2="225" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="150" y1="135" x2="72" y2="180" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="150" y1="135" x2="72" y2="90" stroke="#E2E8F0" strokeWidth="1" />

                <polygon
                  points="150,62 218,97 190,158 150,178 116,161 95,102"
                  fill="#3B82F6"
                  fillOpacity="0.16"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />

                <circle cx="150" cy="62" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="218" cy="97" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="190" cy="158" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="150" cy="178" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="116" cy="161" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="95" cy="102" r="3.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />

                <text x="150" y="32" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="500">
                  Teknik
                </text>
                <text x="242" y="93" textAnchor="start" fill="#64748B" fontSize="11" fontWeight="500">
                  Sains
                </text>
                <text x="242" y="185" textAnchor="start" fill="#64748B" fontSize="11" fontWeight="500">
                  Sosial
                </text>
                <text x="150" y="240" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="500">
                  Seni
                </text>
                <text x="58" y="185" textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                  Ekonomi
                </text>
                <text x="58" y="93" textAnchor="end" fill="#64748B" fontSize="11" fontWeight="500">
                  Kesehatan
                </text>
              </svg>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">
              Berdasarkan hasil tes minat dan bakat terakhir Anda.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Perkembangan Skor Simulasi</h3>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition">
                <span>SNBT</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end pt-4 pb-2">
              <div className="border-l border-b border-gray-100 flex items-end justify-around h-44 px-3 pb-1">
                {[
                  { label: 'Simulasi 1', score: 450, height: '60%' },
                  { label: 'Simulasi 2', score: 520, height: '72%' },
                  { label: 'Simulasi 3', score: 490, height: '67%' },
                  { label: 'Simulasi 4', score: 610, height: '88%' },
                ].map((sim, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-xs font-bold text-indigo-900 group-hover:scale-110 transition-transform">
                      {sim.score}
                    </span>
                    <div className="w-10 sm:w-12 bg-slate-50/50 rounded-t-xl overflow-hidden flex items-end h-32">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-300 via-indigo-500 to-indigo-600 rounded-t-xl transition-all duration-500"
                        style={{ height: sim.height }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap mt-1">
                      {sim.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/student/riasec"
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Compass size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Tes Minat Bakat</h3>
              <p className="text-gray-500 text-sm mt-1">
                Selesaikan tes untuk mengetahui potensi dan kecenderungan karirmu.
              </p>
              <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                Mulai Tes <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>

            <Link
              href="/student/jurusan"
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Jelajahi Jurusan</h3>
              <p className="text-gray-500 text-sm mt-1">
                Temukan informasi lengkap 50+ program studi di berbagai universitas.
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Eksplorasi <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>

            <Link
              href="/student/booking"
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">Sesi Mentoring</h3>
              <p className="text-gray-500 text-sm mt-1">
                Jadwalkan konsultasi 1-on-1 dengan Guru BK atau Mentor pilihanmu.
              </p>
              <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                Booking <ChevronRight size={16} className="ml-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
