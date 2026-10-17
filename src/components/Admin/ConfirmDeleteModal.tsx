import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  itemName?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  itemName,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
  isLoading = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 sm:p-7 relative animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-2 space-y-2">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {message}
          </p>

          {itemName && (
            <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl text-xs font-semibold text-red-800 break-words">
              {itemName}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 mt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={15} />
            <span>{isLoading ? 'Menghapus...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
