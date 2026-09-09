import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { type WellnessFormData, wellnessFormSteps } from '@/data/WellnessSurvey'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

import { FormStep } from './FormStep'
import { StepProgress } from './Progress'

export const SimulationForm = () => {
	const { saveFormData } = useSimulationStorage()
	const navigate = useNavigate()
	const [currentStepIndex, setCurrentStepIndex] = useState(0)
	const [formData, setFormData] = useState<WellnessFormData>({} as WellnessFormData)

	const totalSteps = wellnessFormSteps.length
	const currentStep = wellnessFormSteps[currentStepIndex]

	const handleNextStep = (value: string) => {
		const updatedFormData = { ...formData, [currentStep.id]: value }
		setFormData(updatedFormData)

		console.log({ updatedFormData })

		if (currentStepIndex + 1 > totalSteps - 1) {
			const id = saveFormData(updatedFormData)
			void navigate(`/resultado/${id}`)
			return
		}

		setCurrentStepIndex((prev) => prev + 1)
	}

	const handlePreviousStep = () => {
		if (currentStepIndex === 0) {
			return
		}

		setCurrentStepIndex((prev) => prev - 1)
	}

	return (
		<>
			<StepProgress currentStep={currentStepIndex + 1} totalSteps={totalSteps} />
			<FormStep
				key={currentStep.id}
				{...currentStep}
				onBack={handlePreviousStep}
				onNext={handleNextStep}
				hideBackButton={currentStepIndex === 0}
			/>
		</>
	)
}
