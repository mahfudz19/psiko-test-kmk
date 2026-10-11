import React from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { choices, dimensions } from './types'

interface RiasecQuestionsProps {
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  answers: Record<string, number>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>
  onSubmit: () => void
}

export default function RiasecQuestions({
  step,
  setStep,
  answers,
  setAnswers,
  onSubmit,
}: RiasecQuestionsProps) {
  const current = dimensions[step]
  const currentCompleted = current.items.filter(
    ([number]) => answers[`${current.code}-${number}`] !== undefined
  ).length
  const isCurrentComplete = currentCompleted === current.items.length
  const totalCompleted = dimensions.reduce(
    (total, dimension) =>
      total +
      dimension.items.filter(([number]) => answers[`${dimension.code}-${number}`] !== undefined)
        .length,
    0
  )

  const handleChoice = (code: string, itemNumber: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [`${code}-${itemNumber}`]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white ${current.color}`}
              >
                {current.code}
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{current.name}</h2>
                <p className="text-xs text-slate-500">{current.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>
              Dimensi {step + 1} dari {dimensions.length}
            </span>
            <span className="text-slate-300">•</span>
            <span>
              {totalCompleted} / 42 terjawab ({Math.round((totalCompleted / 42) * 100)}%)
            </span>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-300 ${current.color}`}
            style={{ width: `${(currentCompleted / current.items.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {current.items.map(([itemNumber, text]) => {
          const key = `${current.code}-${itemNumber}`
          const selectedValue = answers[key]

          return (
            <div
              key={itemNumber}
              className={`rounded-2xl border p-5 transition-all sm:p-6 ${
                selectedValue !== undefined
                  ? 'border-violet-200 bg-violet-50/20 shadow-sm'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {itemNumber}
                </span>
                <div className="flex-1">
                  <p className="text-base font-medium text-slate-800">{text}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {choices.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => handleChoice(current.code, itemNumber, c.value)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                          selectedValue === c.value
                            ? 'border-violet-600 bg-violet-600 font-semibold text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold">{c.short}</span>
                        <span
                          className={`text-[11px] ${
                            selectedValue === c.value ? 'text-violet-100' : 'text-slate-500'
                          }`}
                        >
                          {c.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          <ArrowLeft size={18} /> Dimensi Sebelumnya
        </button>

        {step < dimensions.length - 1 ? (
          <button
            type="button"
            disabled={!isCurrentComplete}
            onClick={() => setStep((prev) => Math.min(dimensions.length - 1, prev + 1))}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-40"
          >
            Dimensi Selanjutnya <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            disabled={totalCompleted < 42}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-40"
          >
            Lihat Hasil Asesmen <Check size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
