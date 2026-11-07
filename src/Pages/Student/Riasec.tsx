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
  const hasAnyCompleted = completedCount > 0

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
    if (test.is_locked) return
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

  const demoTests = React.useMemo(() => {
    return tests.map((t) => ({
      ...t,
      is_completed: true,
      has_score: true,
      is_locked: false,
    }))
  }, [tests])

  const demoAssessments: RiasecAssessmentData[] = React.useMemo(() => {
    const userInfo = {
      name: user?.name || 'Andi Pratama',
      npsn: user?.npsn || '20101111',
      school: user?.school || 'SMAN 1 Jakarta',
    }

    return tests.map((t) => {
      const type =
        t.test_type ||
        (t.name.toLowerCase().includes('papi')
          ? 'papi_kostick'
          : t.name.toLowerCase().includes('disc')
          ? 'disc'
          : t.name.toLowerCase().includes('mbti')
          ? 'mbti'
          : 'riasec')

      if (type === 'papi_kostick') {
        const papiScores: Record<string, number> = {
          G: 6, L: 5, I: 5, T: 6, V: 2,
          S: 5, R: 2, D: 4, C: 4, E: 4,
          N: 3, A: 3, P: 7, X: 3, B: 4,
          O: 8, Z: 3, K: 6, F: 3, W: 7,
        }
        return {
          id: t.id,
          psychometric_test_id: t.id,
          test_type: 'papi_kostick',
          status: 'selesai',
          primary_result: 'O:8-P:7-W:7',
          dominant_code: 'O:8-P:7-W:7',
          dimension_scores: papiScores,
          interpretation: {
            type_name: 'Profil PAPI Kostick',
            summary:
              'Menunjukkan dinamika kerja dominan pada Need for Closeness, Need to Control Others, dan Need for Rules and Supervision.',
            top_aspects: [
              {
                code: 'O',
                score: 8,
                name: 'Need for Closeness',
                area: 'Sifat Sosial',
                desc: 'Kebutuhan akan kehangatan emosional dan persahabatan yang akrab serta mendalam.',
              },
              {
                code: 'P',
                score: 7,
                name: 'Need to Control Others',
                area: 'Kepemimpinan',
                desc: 'Dorongan untuk mengarahkan, mengatur, dan mengendalikan langkah orang lain.',
              },
              {
                code: 'W',
                score: 7,
                name: 'Need for Rules and Supervision',
                area: 'Ketaatan',
                desc: 'Kebutuhan terhadap regulasi yang jelas, pedoman tertulis, dan kepatuhan aturan.',
              },
            ],
            majors: [
              'Manajemen Bisnis & Kewirausahaan',
              'Ilmu Hukum',
              'Ilmu Komunikasi & Hubungan Masyarakat',
              'Psikologi & Bimbingan Konseling',
            ],
          },
          mentor_name: selectedMentor,
          user: userInfo,
          psychometric_test: t,
        }
      }

      if (type === 'disc') {
        return {
          id: t.id,
          psychometric_test_id: t.id,
          test_type: 'disc',
          status: 'selesai',
          primary_result: 'D',
          dominant_code: 'D',
          dimension_scores: {
            graph1_most: { D: 16, I: 8, S: 7, C: 5 },
            graph2_least: { D: 4, I: 9, S: 11, C: 12 },
            graph3_diff: { D: 12, I: -1, S: -4, C: -7 },
            d: 12,
            i: -1,
            s: -4,
            c: -7,
          },
          interpretation: {
            type_name: 'Dominance (Penggerak & Pengambil Keputusan)',
            summary:
              'Menyukai tantangan, berorientasi hasil, mandiri, berani mengambil risiko, dan tegas dalam memimpin.',
            majors: [
              'Manajemen Bisnis',
              'Teknik Industri',
              'Ilmu Hukum',
              'Kewirausahaan',
            ],
          },
          mentor_name: selectedMentor,
          user: userInfo,
          psychometric_test: t,
        }
      }

      if (type === 'mbti') {
        return {
          id: t.id,
          psychometric_test_id: t.id,
          test_type: 'mbti',
          status: 'selesai',
          primary_result: 'INTJ',
          dominant_code: 'INTJ',
          dimension_scores: {
            E: 4,
            I: 11,
            S: 3,
            N: 12,
            T: 10,
            F: 5,
            J: 11,
            P: 4,
            percentages: {
              E: 27,
              I: 73,
              S: 20,
              N: 80,
              T: 67,
              F: 33,
              J: 73,
              P: 27,
            },
          },
          interpretation: {
            type_name: 'The Architect (Ahli Strategi Visioner)',
            summary:
              'Pemikir imajinatif dan strategis, dengan rencana untuk segala sesuatunya.',
            majors: [
              'Teknik Informatika',
              'Data Science',
              'Fisika Teoretis',
              'Teknik Elektro',
              'Ilmu Hukum',
            ],
            percentages: {
              E: 27,
              I: 73,
              S: 20,
              N: 80,
              T: 67,
              F: 33,
              J: 73,
              P: 27,
            },
          },
          mentor_name: selectedMentor,
          user: userInfo,
          psychometric_test: t,
        }
      }

      return {
        id: t.id,
        psychometric_test_id: t.id,
        test_type: 'riasec',
        status: 'selesai',
        dominant_code: 'RSI',
        primary_result: 'RSI',
        score_r: 24,
        score_s: 22,
        score_i: 21,
        score_e: 20,
        score_a: 19,
        score_c: 18,
        mentor_name: selectedMentor,
        user: userInfo,
        psychometric_test: t,
      }
    })
  }, [tests, user, selectedMentor])

  return (
    <PortalLayout role="siswa" menuItems={studentMenuItems} activeId="minat_bakat">
      <div className="max-w-5xl mx-auto pb-10 text-slate-900">
        {isDemoView ? (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900">
              <span className="font-semibold">
                Mode Demo: Ini adalah simulasi visual laporan hasil asesmen lengkap untuk semua instrumen tes (RIASEC, PAPI Kostick, DiSC, MBTI).
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
              assessment={demoAssessments[0] || null}
              assessments={demoAssessments}
              tests={demoTests}
              user={user}
              onBack={() => setIsDemoView(false)}
              backButtonLabel="Tutup Demo & Kembali"
            />
          </div>
        ) : allCompleted || (hasAnyCompleted && viewingResult) ? (
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
