import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'

interface LoginProps {
  errors?: Record<string, string>
  flash?: {
    success?: string
    error?: string
  }
}

export default function Login({ errors, flash }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  const errorMessage =
    flash?.error ||
    (errors && Object.keys(errors).length > 0 ? Object.values(errors)[0] : null)

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center p-4 font-sans relative">
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 text-sm font-semibold transition"
      >
        <ArrowLeft size={18} /> Beranda
      </Link>

      <div className="bg-white w-full max-w-[420px] p-8 md:p-10 rounded-[28px] shadow-xl shadow-slate-200/60 border border-gray-100">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-md shadow-indigo-300/40 text-white">
          <Lock size={26} strokeWidth={2.3} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mt-6 tracking-tight text-center">
          Selamat datang kembali
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 font-medium text-center">
          Masuk ke akun Gen-U untuk melanjutkan.
        </p>

        {flash?.success && (
          <div className="mt-5 p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-left font-medium">
            {flash.success}
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 text-left font-medium">
            {errorMessage}
          </div>
        )}

        <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Email
            </label>
            <input
              type="text"
              required
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-300/30 transition-all text-sm tracking-wide mt-2 disabled:opacity-50"
          >
            {processing ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6 before:content-[''] before:flex-1 before:border-b before:border-gray-200 after:content-[''] after:flex-1 after:border-b after:border-gray-200 before:mr-3 after:ml-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          ATAU
        </div>

        <a
          href="/auth/google"
          className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 flex items-center justify-center gap-3 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.39 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Lanjutkan dengan Google
        </a>

        <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed">
          Dengan masuk, Anda menyetujui ketentuan penggunaan Gen-U.
        </p>

        <p className="text-center text-xs text-gray-500 mt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
