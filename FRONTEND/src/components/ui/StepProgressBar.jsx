import { Stepper } from './designSystem'

export function StepProgressBar({ steps, currentStep, className }) {
  return <Stepper steps={steps} currentStep={currentStep} className={className} />
}
