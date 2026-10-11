import React, { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import {
  Menu,
  X,
  Shield,
  LogOut,
  LucideIcon,
} from 'lucide-react'
import NpsnLockNotice from '../components/NpsnLockNotice'
import NpsnFormCard from '../components/NpsnFormCard'

export interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

interface PortalLayoutProps {
  children: React.ReactNode
  role: 'siswa' | 'guru' | 'admin'
  menuItems: MenuItem[]
  activeId: string
}

export default function PortalLayout({
  children,
  role,
  menuItems,
  activeId,
}: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const { auth } = usePage<any>().props
  const user = auth?.user

  const isNpsnMissing = (role === 'siswa' || role === 'guru') && (!user?.npsn || String(user.npsn).trim() === '')
  const profileHref = role === 'siswa' ? '/student/profile' : role === 'guru' ? '/guru/profile' : '#'

  const handleLogout = () => {
    setLogoutModalOpen(false)
    router.post('/logout')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 ${
          role === 'admin' ? 'bg-slate-900 text-white' : 'bg-white border-r border-gray-200'
        } transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div
          className={`p-4 lg:p-6 flex items-center justify-between ${
            role === 'admin' ? 'border-b border-slate-700' : 'border-b border-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {role !== 'admin' ? (
              <Link
                href={profileHref}
                className="flex items-center gap-2 rounded-lg text-left transition-colors hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {role === 'siswa' ? 'S' : 'G'}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-bold text-gray-800">
                    {user?.name || (role === 'siswa' ? 'Andi Pratama' : 'Budi Santoso')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {role === 'siswa' ? 'Profil Saya' : 'Profil Guru'}
                  </span>
                  <span className="text-[11px] font-medium text-blue-600 mt-0.5">
                    {user?.npsn ? `NPSN ${user.npsn}` : 'NPSN belum diisi'}
                  </span>
                </span>
              </Link>
            ) : (
              <div className="p-2 rounded-lg bg-indigo-500 text-white">
                <Shield size={20} />
              </div>
            )}
            {role === 'admin' && (
              <span className="text-xl font-bold text-white">
                Gen-U <span className="text-sm font-normal opacity-75">ADMIN</span>
              </span>
            )}
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} className={role === 'admin' ? 'text-gray-300' : 'text-gray-500'} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={isNpsnMissing ? '#' : item.href}
                  onClick={(e) => {
                    if (isNpsnMissing) {
                      e.preventDefault()
                      return
                    }
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isNpsnMissing
                      ? 'text-gray-300 hover:text-gray-400 cursor-not-allowed opacity-50'
                      : activeId === item.id
                      ? role === 'admin'
                        ? 'bg-slate-800 text-indigo-400'
                        : 'bg-blue-50 text-blue-700 font-medium'
                      : role === 'admin'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm text-left flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`p-4 ${
            role === 'admin' ? 'border-t border-slate-700' : 'border-t border-gray-100'
          }`}
        >
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              role === 'admin' ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex items-center justify-between lg:justify-end">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className={`${role !== 'admin' ? 'hidden sm:inline' : ''} text-sm text-gray-500 font-medium`}>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {role !== 'admin' ? (
              <Link
                href={role === 'siswa' ? '/student/dashboard' : '/guru/dashboard'}
                className="rounded-lg px-2 py-1 text-lg font-bold text-blue-900 transition-colors hover:bg-blue-50"
              >
                Gen-U <span className="text-xs font-medium">{role.toUpperCase()}</span>
              </Link>
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                A
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {isNpsnMissing ? (
              activeId === 'profile' ? (
                <NpsnFormCard user={user} role={role} />
              ) : (
                <NpsnLockNotice profileHref={profileHref} />
              )
            ) : (
              children
            )}
          </div>
        </main>
      </div>

      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <LogOut size={26} strokeWidth={2.3} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Konfirmasi Keluar</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun Gen-U? Anda harus masuk kembali untuk mengakses portal.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
