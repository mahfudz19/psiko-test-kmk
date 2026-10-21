import React, { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { ArrowLeft, SquarePen, Save, X, RefreshCw, Check } from 'lucide-react'
import { getDimensionDefaultContent, getScoreLevel } from '@/features/riasec/dimensionProfiles'

export interface StudentRiasecDetailData {
  id: number
  name: string
  npsn: string
  school: string
  testStatus: string
  dominantCode?: string
  isAllImported?: boolean
  isCompleted?: boolean
  completedCount?: number
  totalTests?: number
  importedCount?: number
  imported_tests?: any[]
  mentor_name?: string | null
  assessment?: {
    id?: number
    psychometric_test_id?: number
    score_r?: number
    score_i?: number
    score_a?: number
    score_s?: number
    score_e?: number
    score_c?: number
    dominant_code?: string
    mentor_name?: string
    answers?: {
      dimensions?: Record<string, { desc?: string; majors?: string }>
      [key: string]: any
    } | null
  } | null
  assessments?: any[]
}

interface TestOption {
  id: number
  name: string
  is_imported?: boolean
  [key: string]: any
}

interface StudentRiasecDetailProps {
  student: StudentRiasecDetailData
  onBack: () => void
  canEdit?: boolean
  tests?: TestOption[]
}

interface DimensionInfo {
  code: string
  name: string
  score: number
  color: string
  badgeBg: string
  desc: string
  majors: string
}

export default function StudentRiasecDetail({
  student,
  onBack,
  canEdit = true,
  tests = [],
}: StudentRiasecDetailProps) {
  const availableTests =
    tests && tests.length > 0
      ? tests
      : student.imported_tests && student.imported_tests.length > 0
      ? student.imported_tests
      : student.assessments && student.assessments.length > 0
      ? student.assessments.map((a: any, idx: number) => ({
          id: a.psychometric_test_id || idx + 1,
          name: `Alat Tes ${idx + 1}`,
        }))
      : []

  const [activeTestId, setActiveTestId] = useState<number | null>(() => {
    if (student.assessment?.psychometric_test_id) {
      return student.assessment.psychometric_test_id
    }
    if (student.assessments && student.assessments.length > 0) {
      return student.assessments[0].psychometric_test_id
    }
    if (availableTests.length > 0) {
      return availableTests[0].id
    }
    return null
  })

  const activeAssessment =
    student.assessments?.find((a: any) => a.psychometric_test_id === activeTestId) ||
    (student.assessment?.psychometric_test_id === activeTestId ? student.assessment : null) ||
    (availableTests.length <= 1 ? student.assessment : null)

  const initialR = activeAssessment?.score_r ?? 15
  const initialI = activeAssessment?.score_i ?? 22
  const initialA = activeAssessment?.score_a ?? 24
  const initialS = activeAssessment?.score_s ?? 26
  const initialE = activeAssessment?.score_e ?? 20
  const initialC = activeAssessment?.score_c ?? 17
  const initialMentor = activeAssessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi'

  const getInitialCustoms = (
    asm: typeof activeAssessment,
    scores?: { r: number; i: number; a: number; s: number; e: number; c: number },
  ): Record<string, { desc: string; majors: string }> => {
    const scR = scores?.r ?? (asm?.score_r ?? 15)
    const scI = scores?.i ?? (asm?.score_i ?? 22)
    const scA = scores?.a ?? (asm?.score_a ?? 24)
    const scS = scores?.s ?? (asm?.score_s ?? 26)
    const scE = scores?.e ?? (asm?.score_e ?? 20)
    const scC = scores?.c ?? (asm?.score_c ?? 17)

    return {
      R: {
        desc: asm?.answers?.dimensions?.R?.desc || getDimensionDefaultContent('R', scR).desc,
        majors: asm?.answers?.dimensions?.R?.majors || getDimensionDefaultContent('R', scR).majors,
      },
      S: {
        desc: asm?.answers?.dimensions?.S?.desc || getDimensionDefaultContent('S', scS).desc,
        majors: asm?.answers?.dimensions?.S?.majors || getDimensionDefaultContent('S', scS).majors,
      },
      I: {
        desc: asm?.answers?.dimensions?.I?.desc || getDimensionDefaultContent('I', scI).desc,
        majors: asm?.answers?.dimensions?.I?.majors || getDimensionDefaultContent('I', scI).majors,
      },
      E: {
        desc: asm?.answers?.dimensions?.E?.desc || getDimensionDefaultContent('E', scE).desc,
        majors: asm?.answers?.dimensions?.E?.majors || getDimensionDefaultContent('E', scE).majors,
      },
      A: {
        desc: asm?.answers?.dimensions?.A?.desc || getDimensionDefaultContent('A', scA).desc,
        majors: asm?.answers?.dimensions?.A?.majors || getDimensionDefaultContent('A', scA).majors,
      },
      C: {
        desc: asm?.answers?.dimensions?.C?.desc || getDimensionDefaultContent('C', scC).desc,
        majors: asm?.answers?.dimensions?.C?.majors || getDimensionDefaultContent('C', scC).majors,
      },
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [scoreR, setScoreR] = useState(initialR)
  const [scoreI, setScoreI] = useState(initialI)
  const [scoreA, setScoreA] = useState(initialA)
  const [scoreS, setScoreS] = useState(initialS)
  const [scoreE, setScoreE] = useState(initialE)
  const [scoreC, setScoreC] = useState(initialC)
  const [mentorName, setMentorName] = useState(initialMentor)

  const [cardCustoms, setCardCustoms] = useState<Record<string, { desc: string; majors: string }>>(() =>
    getInitialCustoms(activeAssessment),
  )
  const [editingCardCode, setEditingCardCode] = useState<string | null>(null)
  const [isEditingAllCards, setIsEditingAllCards] = useState(false)
  const [savingCardCode, setSavingCardCode] = useState<string | null>(null)

  useEffect(() => {
    setScoreR(activeAssessment?.score_r ?? 15)
    setScoreI(activeAssessment?.score_i ?? 22)
    setScoreA(activeAssessment?.score_a ?? 24)
    setScoreS(activeAssessment?.score_s ?? 26)
    setScoreE(activeAssessment?.score_e ?? 20)
    setScoreC(activeAssessment?.score_c ?? 17)
    setMentorName(activeAssessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi')
    setCardCustoms(getInitialCustoms(activeAssessment))
    setEditingCardCode(null)
    setIsEditingAllCards(false)
  }, [activeAssessment, activeTestId])

  const handleCancelEdit = () => {
    setScoreR(activeAssessment?.score_r ?? 15)
    setScoreI(activeAssessment?.score_i ?? 22)
    setScoreA(activeAssessment?.score_a ?? 24)
    setScoreS(activeAssessment?.score_s ?? 26)
    setScoreE(activeAssessment?.score_e ?? 20)
    setScoreC(activeAssessment?.score_c ?? 17)
    setMentorName(activeAssessment?.mentor_name || 'Bpk. Budi Santoso, M.Psi')
    setCardCustoms(getInitialCustoms(activeAssessment))
    setEditingCardCode(null)
    setIsEditingAllCards(false)
    setIsEditing(false)
  }

  const dimensions: DimensionInfo[] = [
    {
      code: 'R',
      name: 'Realistis',
      score: scoreR,
      color: 'bg-[#10B981]',
      badgeBg: 'bg-[#10B981]',
      desc: cardCustoms.R?.desc || getDimensionDefaultContent('R', scoreR).desc,
      majors: cardCustoms.R?.majors || getDimensionDefaultContent('R', scoreR).majors,
    },
    {
      code: 'S',
      name: 'Sosial',
      score: scoreS,
      color: 'bg-[#EF4444]',
      badgeBg: 'bg-[#EF4444]',
      desc: cardCustoms.S?.desc || getDimensionDefaultContent('S', scoreS).desc,
      majors: cardCustoms.S?.majors || getDimensionDefaultContent('S', scoreS).majors,
    },
    {
      code: 'I',
      name: 'Penyelidikan',
      score: scoreI,
      color: 'bg-[#3B82F6]',
      badgeBg: 'bg-[#3B82F6]',
      desc: cardCustoms.I?.desc || getDimensionDefaultContent('I', scoreI).desc,
      majors: cardCustoms.I?.majors || getDimensionDefaultContent('I', scoreI).majors,
    },
    {
      code: 'E',
      name: 'Giat',
      score: scoreE,
      color: 'bg-[#F59E0B]',
      badgeBg: 'bg-[#F59E0B]',
      desc: cardCustoms.E?.desc || getDimensionDefaultContent('E', scoreE).desc,
      majors: cardCustoms.E?.majors || getDimensionDefaultContent('E', scoreE).majors,
    },
    {
      code: 'A',
      name: 'Artistik',
      score: scoreA,
      color: 'bg-[#8B5CF6]',
      badgeBg: 'bg-[#8B5CF6]',
      desc: cardCustoms.A?.desc || getDimensionDefaultContent('A', scoreA).desc,
      majors: cardCustoms.A?.majors || getDimensionDefaultContent('A', scoreA).majors,
    },
    {
      code: 'C',
      name: 'Konvensional',
      score: scoreC,
      color: 'bg-[#475569]',
      badgeBg: 'bg-[#475569]',
      desc: cardCustoms.C?.desc || getDimensionDefaultContent('C', scoreC).desc,
      majors: cardCustoms.C?.majors || getDimensionDefaultContent('C', scoreC).majors,
    },
  ]

  const initialDominant = (
    activeAssessment?.dominant_code ||
    student.dominantCode ||
    ''
  ).replace(/[^A-Za-z]/g, '').toUpperCase()

  const activeDominantCode = (
    !isEditing && initialDominant
      ? initialDominant
      : [...dimensions].sort((a, b) => b.score - a.score).slice(0, 3).map((d) => d.code).join('')
  )

  const dominantOrder = activeDominantCode.split('')

  const sortedDimensions = [...dimensions].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    const idxA = dominantOrder.indexOf(a.code)
    const idxB = dominantOrder.indexOf(b.code)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return 0
  })

  const dominantCode = activeDominantCode
  const topDimension = sortedDimensions[0]?.name || 'Realistis'

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      score_r: scoreR,
      score_i: scoreI,
      score_a: scoreA,
      score_s: scoreS,
      score_e: scoreE,
      score_c: scoreC,
      dominant_code: dominantCode,
      mentor_name: mentorName,
      psychometric_test_id: activeTestId ?? activeAssessment?.psychometric_test_id,
      dimension_customizations: cardCustoms,
    }

    router.put(`/admin/monitoring-tes/${student.id}`, payload, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSaving(false)
        setIsEditing(false)
        setIsEditingAllCards(false)
        setEditingCardCode(null)
      },
      onError: () => {
        setIsSaving(false)
      },
    })
  }

  const saveCustomizations = (
    customsToSave: Record<string, { desc: string; majors: string }>,
    cardCode: string | 'all',
  ) => {
    setSavingCardCode(cardCode)
    const payload = {
      score_r: scoreR,
      score_i: scoreI,
      score_a: scoreA,
      score_s: scoreS,
      score_e: scoreE,
      score_c: scoreC,
      dominant_code: dominantCode,
      mentor_name: mentorName,
      psychometric_test_id: activeTestId ?? activeAssessment?.psychometric_test_id,
      dimension_customizations: customsToSave,
    }

    router.put(`/admin/monitoring-tes/${student.id}`, payload, {
      preserveScroll: true,
      onSuccess: () => {
        setSavingCardCode(null)
        if (cardCode === 'all') {
          setIsEditingAllCards(false)
        } else {
          setEditingCardCode(null)
        }
      },
      onError: () => {
        setSavingCardCode(null)
      },
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft size={18} />
          Kembali ke daftar siswa
        </button>

        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <SquarePen size={16} />
            <span>Edit Skor Siswa</span>
          </button>
        )}
      </div>

      {availableTests.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {availableTests.map((t) => {
            const isActive = activeTestId === t.id
            const isImported =
              student.assessments?.some((a: any) => a.psychometric_test_id === t.id) ||
              student.assessment?.psychometric_test_id === t.id ||
              t.is_imported

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  if (activeTestId !== t.id) {
                    setActiveTestId(t.id)
                    setIsEditing(false)
                    setEditingCardCode(null)
                    setIsEditingAllCards(false)
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{t.name}</span>
                {isImported ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sudah diimpor" />
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium">
                    Belum diimpor
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!activeAssessment && !isEditing && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-3">
          <h3 className="text-base font-bold text-amber-950">
            Alat Tes Ini Belum Diimpor untuk Siswa Ini
          </h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            Hasil asesmen untuk alat tes ini belum diimpor atau belum dikerjakan. Anda dapat menunggu hasil impor CSV atau memasukkan skor secara manual sekarang.
          </p>
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <SquarePen size={14} />
              <span>Input Skor Manual Sekarang</span>
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <form
          onSubmit={handleSaveScores}
          className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-200/60">
            <div>
              <h3 className="text-base font-extrabold text-indigo-950 flex items-center gap-2">
                <SquarePen size={18} className="text-indigo-600" />
                Penyesuaian Skor Manual Asesmen
              </h3>
              <p className="text-xs text-indigo-700 mt-0.5">
                Ubah nilai per dimensi (0 - 28 poin). Grafik visual dan kode Holland dominan akan otomatis terbarui.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-[#10B981] text-white font-bold text-xs flex items-center justify-center">
                  R
                </span>
                <span className="text-xs font-bold text-gray-800">Realistis</span>
              </div>
              <input
                type="number"
                min="0"
                max="28"
                value={scoreR}
                onChange={(e) => setScoreR(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
                className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-[#EF4444] text-white font-bold text-xs flex items-center justify-center">
                  S
                </span>
                <span className="text-xs font-bold text-gray-800">Sosial</span>
              </div>
              <input
                type="number"
                min="0"
                max="28"
                value={scoreS}
                onChange={(e) => setScoreS(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
                className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-[#3B82F6] text-white font-bold text-xs flex items-center justify-center">
                  I
                </span>
                <span className="text-xs font-bold text-gray-800">Penyelidikan</span>
              </div>
              <input
                type="number"
                min="0"
                max="28"
                value={scoreI}
                onChange={(e) => setScoreI(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
                className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-[#F59E0B] text-white font-bold text-xs flex items-center justify-center">
                  E
                </span>
                <span className="text-xs font-bold text-gray-800">Giat</span>
              </div>
              <input
                type="number"
                min="0"
                max="28"
                value={scoreE}
                onChange={(e) => setScoreE(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
                className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <span className="text-xs font-bold text-gray-800">Artistik</span>
              </div>
              <input
                type="number"
                min="0"
                max="28"
                value={scoreA}
                onChange={(e) => setScoreA(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
                className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-[#475569] text-white font-bold text-xs flex items-center justify-center">
                  C
                </span>
                <span className="text-xs font-bold text-gray-800">Konvensional</span>
              </div>
              <input
                type="number"
                min="0"
                max="28"
                value={scoreC}
                onChange={(e) => setScoreC(Math.max(0, Math.min(28, Number(e.target.value) || 0)))}
                className="w-full text-center text-lg font-black text-gray-900 border border-gray-200 rounded-xl py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
              <span className="block text-center text-[10px] text-gray-400 mt-1">Maks. 28</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="block text-[11px] font-bold text-gray-500 mb-0.5">
                Guru/Mentor Pembimbing:
              </span>
              <span className="font-semibold text-gray-900 text-sm">
                {mentorName}
              </span>
            </div>
            <div className="text-right self-end sm:self-center">
              <span className="text-gray-500 block text-[11px]">Kode Dominan Baru:</span>
              <span className="text-xl font-black text-indigo-600 tracking-wider">
                {dominantCode}
              </span>
            </div>
          </div>
        </form>
      )}

      {(activeAssessment || isEditing) && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              PROFIL MINAT SISWA
            </span>
            <div className="text-5xl sm:text-6xl font-black text-gray-900 tracking-wider my-4">
              {dominantCode}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Dimensi teratas siswa adalah{' '}
              <strong className="text-gray-900 font-bold">{topDimension}</strong> . Hasil ini dapat menjadi titik awal eksplorasi studi.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-1 text-xs text-gray-500 font-medium">
            <div>
              {student.name} &middot; NPSN {student.npsn} &middot; {student.school}
            </div>
            <div>
              Guru/Mentor: {mentorName}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Peta enam dimensi
          </h3>

          <div className="space-y-4">
            {dimensions.map((d) => {
              const max = 28
              const percentage = Math.min(Math.round((d.score / max) * 100), 100)

              return (
                <div key={d.code} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg ${d.badgeBg} text-white font-extrabold text-[11px] flex items-center justify-center shrink-0`}
                  >
                    {d.code}
                  </div>
                  <span className="w-28 text-xs font-bold text-gray-800 shrink-0">
                    {d.name}
                  </span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${d.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-10 text-right shrink-0">
                    {d.score}/{max}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Karakteristik & Bidang Studi Enam Dimensi
          </h3>
          <p className="text-xs text-gray-500">
            {canEdit
              ? 'Admin dapat menyesuaikan deskripsi dan rekomendasi bidang studi untuk setiap dimensi.'
              : 'Deskripsi karakteristik dan rekomendasi bidang studi berdasarkan pemetaan Holland.'}
          </p>
        </div>
        {canEdit && !isEditing && (
          <div className="flex items-center gap-2">
            {isEditingAllCards ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCardCustoms(getInitialCustoms(activeAssessment))
                    setIsEditingAllCards(false)
                  }}
                  disabled={savingCardCode === 'all'}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => saveCustomizations(cardCustoms, 'all')}
                  disabled={savingCardCode === 'all'}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {savingCardCode === 'all' ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Simpan Perubahan 6 Card</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingCardCode(null)
                  setIsEditingAllCards(true)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <SquarePen size={14} />
                <span>Edit 6 Card</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDimensions.map((dim, idx) => {
          const isCardEditing = editingCardCode === dim.code || isEditingAllCards || isEditing
          const isSavingThisCard = savingCardCode === dim.code || savingCardCode === 'all' || isSaving

          return (
            <div
              key={dim.code}
              className={`bg-white rounded-3xl border ${
                isCardEditing
                  ? 'border-indigo-300 ring-2 ring-indigo-500/10 shadow-md'
                  : 'border-gray-100 shadow-sm hover:shadow-md'
              } p-6 flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg ${dim.badgeBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}
                    >
                      {dim.code}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">
                      #{idx + 1} &middot; {dim.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        getScoreLevel(dim.score) === 'high'
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : getScoreLevel(dim.score) === 'medium'
                          ? 'text-amber-700 bg-amber-50 border border-amber-200'
                          : 'text-slate-600 bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {getScoreLevel(dim.score) === 'high'
                        ? 'Tinggi'
                        : getScoreLevel(dim.score) === 'medium'
                        ? 'Sedang'
                        : 'Rendah'}
                    </span>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {dim.score}/28
                    </span>
                    {canEdit && !isEditing && !isEditingAllCards && (
                      <button
                        type="button"
                        onClick={() => {
                          if (editingCardCode === dim.code) {
                            setEditingCardCode(null)
                          } else {
                            setEditingCardCode(dim.code)
                          }
                        }}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          editingCardCode === dim.code
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                        title="Edit deskripsi dan contoh bidang studi"
                      >
                        <SquarePen size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {isCardEditing ? (
                  <div className="space-y-3 mb-4 animate-in fade-in duration-200">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Deskripsi Dimensi
                      </label>
                      <textarea
                        rows={3}
                        value={cardCustoms[dim.code]?.desc ?? ''}
                        onChange={(e) =>
                          setCardCustoms((prev) => ({
                            ...prev,
                            [dim.code]: {
                              ...prev[dim.code],
                              desc: e.target.value,
                            },
                          }))
                        }
                        className="w-full text-xs p-2.5 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white text-gray-800 leading-relaxed resize-none"
                        placeholder="Tuliskan deskripsi karakter dimensi..."
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">
                        Contoh Bidang Studi
                      </label>
                      <textarea
                        rows={2}
                        value={cardCustoms[dim.code]?.majors ?? ''}
                        onChange={(e) =>
                          setCardCustoms((prev) => ({
                            ...prev,
                            [dim.code]: {
                              ...prev[dim.code],
                              majors: e.target.value,
                            },
                          }))
                        }
                        className="w-full text-xs p-2.5 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white text-gray-800 leading-relaxed resize-none"
                        placeholder="Contoh: Teknik, Kedokteran, Desain..."
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {dim.desc}
                  </p>
                )}
              </div>

              {isCardEditing && editingCardCode === dim.code && !isEditingAllCards && !isEditing ? (
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const def = getDimensionDefaultContent(dim.code, dim.score)
                      setCardCustoms((prev) => ({
                        ...prev,
                        [dim.code]: {
                          desc: def.desc,
                          majors: def.majors,
                        },
                      }))
                    }}
                    className="text-[11px] text-gray-500 hover:text-red-600 font-semibold transition cursor-pointer"
                  >
                    Reset Default
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const def = getDimensionDefaultContent(dim.code, dim.score)
                        setCardCustoms((prev) => ({
                          ...prev,
                          [dim.code]: {
                            desc:
                              activeAssessment?.answers?.dimensions?.[dim.code]?.desc ||
                              def.desc,
                            majors:
                              activeAssessment?.answers?.dimensions?.[dim.code]?.majors ||
                              def.majors,
                          },
                        }))
                        setEditingCardCode(null)
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={isSavingThisCard}
                      onClick={() => saveCustomizations(cardCustoms, dim.code)}
                      className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    >
                      {isSavingThisCard ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <Check size={12} />
                      )}
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>
              ) : !isCardEditing ? (
                <div className="pt-3 border-t border-gray-50">
                  <span className="block text-[11px] font-bold text-gray-800 mb-1">
                    Contoh bidang studi
                  </span>
                  <p className="text-xs text-gray-500">
                    {dim.majors}
                  </p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
        </>
      )}
    </div>
  )
}
