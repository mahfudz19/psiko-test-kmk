import React from 'react'
import { router } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'

interface PendingUserItem {
  id: number
  name: string
  role: string
  school: string
  email: string
  phone: string
}

interface AdminRegistrasiProps {
  pendingUsers: PendingUserItem[]
}

export default function AdminRegistrasi({ pendingUsers = [] }: AdminRegistrasiProps) {
  const handleApprove = (id: number) => {
    router.patch(
      `/admin/registrasi/${id}/approve`,
      {},
      { preserveScroll: true }
    )
  }

  const handleReject = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menolak pendaftaran ini?')) {
      router.delete(
        `/admin/registrasi/${id}/reject`,
        { preserveScroll: true }
      )
    }
  }

  const handleApproveAll = () => {
    router.post(
      '/admin/registrasi/approve-all',
      {},
      { preserveScroll: true }
    )
  }

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="registrasi">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Antrean Registrasi Pengguna</h2>
          {pendingUsers.length > 0 && (
            <button
              type="button"
              onClick={handleApproveAll}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md font-medium hover:bg-indigo-700 transition-colors"
            >
              Setujui Semua
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Tidak ada antrean pendaftaran yang menunggu persetujuan.
            </div>
          ) : (
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Asal Sekolah</th>
                  <th className="px-6 py-3">Kontak</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{u.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-semibold">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">{u.school}</td>
                    <td className="px-6 py-4 text-xs">
                      {u.email} <br />
                      <span className="text-slate-400">{u.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleApprove(u.id)}
                          className="text-emerald-600 font-semibold hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(u.id)}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
