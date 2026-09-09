import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import type { WellnessRecord } from '@/data/WellnessSurvey'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight, type InsightData } from '@/Service/aiService'

export const useInsight = (id: string) => {
	const isRequestPending = useRef(false)
	const { getFormData, updateSimulation } = useSimulationStorage()

	const [insight, setInsight] = useState<InsightData | null>(() => {
		const survey = getFormData(id)

		if (survey?.insight) {
			return survey.insight
		}

		return null
	})

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchInsight = useCallback(
		async (surveyId: string) => {
			const survey = getFormData(surveyId)

			if (!survey) {
				setError('Pesquisa não encontrada.')
				return
			}

			isRequestPending.current = true
			setIsLoading(true)
			setError(null)

			try {
				const prompt = buildAIPrompt(survey)
				console.log('Enviando prompt para IA...')
				const data = await getInsight(prompt)
				console.log('Resposta da IA recebida:', data)
				setInsight(data)

				updateSimulation(surveyId, {
					...survey,
					insight: data,
				} as WellnessRecord)
			} catch (err) {
				console.error('Erro completo:', err)
				setError('Erro ao gerar as recomendações. Verifique sua conexão e tente novamente.')
			} finally {
				isRequestPending.current = false
				setIsLoading(false)
			}
		},
		[getFormData, updateSimulation],
	)

	useEffect(() => {
		if (insight || isLoading || error || isRequestPending.current) {
			return
		}

		fetchInsight(id)
	}, [id, insight, isLoading, error, fetchInsight])

	return { insight, isLoading, error, fetchInsight }
}
