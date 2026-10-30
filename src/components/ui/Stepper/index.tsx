import { FC, ReactNode, useState } from 'react'
import NumberStep from './NumberStep'
import { twMerge } from 'tailwind-merge'

interface StepperProps {
  steps: string[]
  classNames?: {
    root?: string
    stepssRoot?: string
    container?: string
  }
  children: (props: {
    step: string
    steps: { label: string; complite: boolean }[]
    button: { prevStep: () => void; nextStep: () => void; complite: () => void }
  }) => ReactNode
}

const Stepper: FC<StepperProps> = ({ steps, children, classNames }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepss, setStepss] = useState(steps.map(v => ({ label: v, complite: false })))

  const nextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, stepss.length - 1))
  }

  const prevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0))
  }

  const complite = () => {
    setStepss(prevSteps => prevSteps.map((step, index) => (index === currentStep ? { ...step, complite: true } : step)))
    nextStep()
  }

  return (
    <div className={twMerge('max-w-2xl mx-auto', classNames?.root)}>
      <div className={twMerge('flex items-center justify-center space-x-4', classNames?.stepssRoot)}>
        {stepss?.map((step, index) => (
          <NumberStep
            stepName={step.label}
            complite={step.complite}
            currentStep={currentStep}
            index={index}
            key={step + '-' + index}
            lastNumber={index === stepss.length - 1}
          />
        ))}
      </div>

      <div className={twMerge('mt-8', classNames?.container)}>
        {children({
          step: stepss[currentStep].label,
          steps: stepss,
          button: { prevStep, nextStep, complite }
        })}
      </div>
    </div>
  )
}

export default Stepper
