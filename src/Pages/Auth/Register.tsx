import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { ChevronRight, ShieldCheck } from 'lucide-react'

interface RegisterProps {
  errors?: Record<string, string>
}

export default function Register({ errors }: RegisterProps) {
  const [role, setRole] = useState<'siswa' | 'guru'>('siswa')

  const { data, setData, post, processing, errors: formErrors } = useForm({
    role: 'siswa',
    name: '',
    school: '',
    email: '',
    phone: '',
  })

  const currentErrors = { ...errors, ...formErrors }

  const handleRoleChange = (selectedRole: 'siswa' | 'guru') => {
    setRole(selectedRole)
    setData('role', selectedRole)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans relative py-12">
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2"
      >
        <ChevronRight className="rotate-180" size={20} /> Kembali ke Beranda
      </Link>

      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Daftar Akun Gen-U</h2>
          <p className="text-gray-500 mt-2">Bergabunglah untuk memulai persiapan masa depanmu.</p>
        </div>

        <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleRoleChange('siswa')}
            className={`flex-1 py-2 text-sm rounded-md transition-all ${
              role === 'siswa'
                ? 'font-bold bg-white shadow-sm text-blue-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            Siswa
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('guru')}
            className={`flex-1 py-2 text-sm rounded-md transition-all ${
              role === 'guru'
                ? 'font-bold bg-white shadow-sm text-blue-600'
                : 'font-medium text-gray-500 hover:text-gray-700'
            }`}
          >
            Guru / Mentor
          </button>
        </div>

        {Object.keys(currentErrors).length > 0 && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {Object.values(currentErrors)[0]}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'guru' ? 'Asal Sekolah / Instansi' : 'Asal Sekolah'}
            </label>
            <input
              type="text"
              required
              value={data.school}
              onChange={(e) => setData('school', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Pribadi
              </label>
              <input
                type="email"
                required
                placeholder="nama@gmail.com"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No HP / WA</label>
              <input
                type="tel"
                required
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-xs text-indigo-900 leading-relaxed mt-2">
            <ShieldCheck size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-indigo-950 mb-0.5">Pembuatan Akun Resmi & Password:</span>
              Akun resmi Google Workspace beserta password awal akan dibuatkan oleh Administrator dan dikirimkan langsung ke email pribadi Anda.
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-75"
          >
            {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
