import React, { useState, useRef } from 'react'
import PortalLayout from '../../Layouts/PortalLayout'
import { adminMenuItems } from '../../config/navigation'
import { Plus } from 'lucide-react'
import PsychometricTestForm, {
  PsychometricTestItem,
} from '../../components/Admin/PsychometricTestForm'
import PsychometricTestTable from '../../components/Admin/PsychometricTestTable'

interface AdminInputTestProps {
  tests: PsychometricTestItem[]
  stats?: {
    totalTests: number
    activeGform: number
    estimatedRespondents: string
  }
}

export default function AdminInputTest({
  tests = [],
  stats = {
    totalTests: 4,
    activeGform: 4,
    estimatedRespondents: '1,248',
  },
}: AdminInputTestProps) {
  const [testToEdit, setTestToEdit] = useState<PsychometricTestItem | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleEdit = (test: PsychometricTestItem) => {
    setTestToEdit(test)
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCancelEdit = () => {
    setTestToEdit(null)
  }

  const handleAddNew = () => {
    setTestToEdit(null)
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <PortalLayout role="admin" menuItems={adminMenuItems} activeId="input_test">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Kelola Alat Tes Minat Bakat
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tambahkan, perbarui, dan atur tautan instrumen alat tes psikologi untuk peserta.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#4355F9] hover:bg-[#3243E5] shadow-sm transition-all shrink-0"
          >
            <Plus size={18} />
            Tambah Alat Tes Baru
          </button>
        </div>

        <div ref={formRef}>
          <PsychometricTestForm
            stats={stats}
            testToEdit={testToEdit}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <PsychometricTestTable tests={tests} onEditTest={handleEdit} />
      </div>
    </PortalLayout>
  )
}
