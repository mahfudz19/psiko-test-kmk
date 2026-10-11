import React, { useState } from 'react'
import { usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'
import RiasecAvailableTests from '../../components/Student/RiasecAvailableTests'
import RiasecStartModal from '../../components/Student/RiasecStartModal'
import RiasecResultView, {
  RiasecAssessmentData,
} from '../../components/Student/RiasecResultView'
import { PsychometricTestItem } from '../../components/Admin/PsychometricTestForm'

interface StudentRiasecPageProps {
  tests: PsychometricTestItem[]
  mentors: { id: number; name: string; school: string }[]
  previousResult?: RiasecAssessmentData | null
}

export default function StudentRiasec({
  tests = [],
  mentors = [],
  previousResult = null,
}: StudentRiasecPageProps) {
  const { auth } = usePage<any>().props
  const user = auth?.user

  const [selectedTest, setSelectedTest] = useState<PsychometricTestItem | null>(null)
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)

  const handleStartTest = (test: PsychometricTestItem) => {
    setSelectedTest(test)
    setIsStartModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsStartModalOpen(false)
    setSelectedTest(null)
  }

  const isCompleted = Boolean(previousResult && previousResult.status === 'selesai')

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="minat_bakat">
      <div className="max-w-5xl mx-auto pb-10 text-slate-900">
        {isCompleted ? (
          <RiasecResultView assessment={previousResult} user={user} />
        ) : (
          <RiasecAvailableTests
            tests={tests}
            onStartTest={handleStartTest}
            completedCount={0}
          />
        )}

        <RiasecStartModal
          isOpen={isStartModalOpen}
          onClose={handleCloseModal}
          test={selectedTest}
          user={user}
          mentors={mentors}
        />
      </div>
    </PortalLayout>
  )
}
