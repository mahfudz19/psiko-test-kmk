import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ArrowLeft, Home, Compass, LayoutDashboard, LogIn } from 'lucide-react'

export default function NotFound() {
  const { auth } = usePage<any>().props
  const user = auth?.user

  const dashboardHref = user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : user.role === 'guru'
      ? '/guru/dashboard'
      : '/student/dashboard'
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 py-12 px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <Compass size={14} className="animate-spin" style={{ animationDuration: '6s' }} /> Error 404
        </div>

        <div className="relative mb-6 select-none">
          <span className="text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
            404
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL yang Anda masukkan keliru.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {dashboardHref ? (
            <>
              <Link
                href={dashboardHref}
                id="btn-back-dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition"
              >
                <LayoutDashboard size={18} />
                <span>Kembali ke Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                id="btn-history-back"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm transition"
              >
                <ArrowLeft size={18} />
                <span>Halaman Sebelumnya</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                id="btn-back-home"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition"
              >
                <Home size={18} />
                <span>Kembali ke Beranda</span>
              </Link>
              <Link
                href="/login"
                id="btn-go-login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm shadow-sm transition"
              >
                <LogIn size={18} />
                <span>Masuk ke Akun</span>
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 text-xs text-gray-600 font-medium">
          Gen-U Platform &bull; Dikelola oleh univeral.ac.id
        </div>
      </div>
    </div>
  )
}
