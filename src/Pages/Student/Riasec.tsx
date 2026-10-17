import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import PortalLayout from '../../Layouts/PortalLayout'
import { studentMenuItems } from '../../config/navigation'
import RiasecIntroView from '../../components/Student/RiasecIntroView'
import RiasecAvailableTests, {
  ExtendedPsychometricTestItem,
} from '../../components/Student/RiasecAvailableTests'
import RiasecStartModal from '../../components/Student/RiasecStartModal'
import RiasecResultView, {
  RiasecAssessmentData,
} from '../../components/Student/RiasecResultView'
import RiasecEmptyResult from '../../components/Student/RiasecEmptyResult'

interface StudentRiasecPageProps {
  tests: ExtendedPsychometricTestItem[]
  mentors: { id: number; name: string; school: string }[]
  hasStarted: boolean
  allCompleted: boolean
  completedCount?: number
  hasScores: boolean
  assessment?: RiasecAssessmentData | null
  assessments?: RiasecAssessmentData[]
}

export default function StudentRiasec({
  tests = [],
  mentors = [],
  hasStarted = false,
  allCompleted = false,
  hasScores = false,
  assessment = null,
  assessments = [],
}: StudentRiasecPageProps) {
  const { auth } = usePage<any>().props
  const user = auth?.user

  const completedCount = tests.filter((t) => t.is_completed).length
  const hasAnyCompleted = completedCount > 0 && hasScores

  const [inAvailableTestsSession, setInAvailableTestsSession] = useState(hasStarted)
  const [selectedMentor, setSelectedMentor] = useState(
    mentors.length > 0 ? mentors[0].name : 'Bpk. Budi Santoso, M.Psi'
  )
  const [selectedTest, setSelectedTest] = useState<ExtendedPsychometricTestItem | null>(null)
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [isDemoView, setIsDemoView] = useState(false)
  const [viewingResult, setViewingResult] = useState<boolean>(allCompleted || hasAnyCompleted)

  useEffect(() => {
    if (allCompleted) {
      setViewingResult(true)
    }
  }, [allCompleted])

  useEffect(() => {
    if (hasStarted) {
      setInAvailableTestsSession(true)
    }
  }, [hasStarted])

  const handleStartTest = (test: ExtendedPsychometricTestItem) => {
    setSelectedTest(test)
    setIsStartModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsStartModalOpen(false)
    setSelectedTest(null)
  }

  const handleStartAssessmentFromIntro = (mentor: string) => {
    setSelectedMentor(mentor)
    setInAvailableTestsSession(true)
  }

  const demoAssessmentData: RiasecAssessmentData = {
    dominant_code: 'RSI',
    score_r: 22,
    score_s: 22,
    score_i: 21,
    score_e: 21,
    score_a: 20,
    score_c: 20,
    mentor_name: selectedMentor,
    user: {
      name: user?.name || 'Andi Pratama',
      npsn: user?.npsn || '20101111',
      school: user?.school || 'SMAN 1 Jakarta',
    },
  }

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="minat_bakat">
      <div className="max-w-5xl mx-auto pb-10 text-slate-900">
        {isDemoView ? (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900">
              <span className="font-semibold">
                Mode Demo: Ini adalah simulasi visual laporan hasil tes RIASEC setelah seluruh asesmen selesai dinilai.
              </span>
              <button
                type="button"
                onClick={() => setIsDemoView(false)}
                className="shrink-0 px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Tutup Demo
              </button>
            </div>
            <RiasecResultView
              assessment={demoAssessmentData}
              user={user}
              onBack={() => setIsDemoView(false)}
              backButtonLabel="Tutup Demo & Kembali"
            />
          </div>
        ) : allCompleted || (hasAnyCompleted && viewingResult) ? (
          hasScores ? (
            <div className="space-y-4">
              {!allCompleted && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
                  <span className="font-semibold">
                    Anda telah menyelesaikan {completedCount} dari {tests.length} alat tes. Hasil di bawah ini merupakan laporan dari alat tes yang telah selesai dinilai.
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewingResult(false)}
                    className="shrink-0 px-4 py-1.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors cursor-pointer"
                  >
                    Lanjutkan Alat Tes Berikutnya
                  </button>
                </div>
              )}
              <RiasecResultView
                assessment={assessment}
                assessments={assessments}
                tests={tests}
                user={user}
              />
            </div>
          ) : (
            <RiasecEmptyResult user={user} assessment={assessment} />
          )
        ) : !inAvailableTestsSession ? (
          <RiasecIntroView
            user={user}
            mentors={mentors}
            onStartAssessment={handleStartAssessmentFromIntro}
            onViewDemo={() => setIsDemoView(true)}
          />
        ) : (
          <div className="space-y-4">
            {hasAnyCompleted && !allCompleted && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900">
                <span className="font-semibold">
                  Anda telah menyelesaikan {completedCount} alat tes dan hasilnya sudah dapat dilihat.
                </span>
                <button
                  type="button"
                  onClick={() => setViewingResult(true)}
                  className="shrink-0 px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Lihat Hasil Tes ({completedCount} Selesai)
                </button>
              </div>
            )}
            <RiasecAvailableTests
              tests={tests}
              onStartTest={handleStartTest}
              completedCount={completedCount}
            />
          </div>
        )}

        <RiasecStartModal
          isOpen={isStartModalOpen}
          onClose={handleCloseModal}
          test={selectedTest}
          user={user}
          mentorName={selectedMentor}
        />
      </div>
    </PortalLayout>
  )
}
