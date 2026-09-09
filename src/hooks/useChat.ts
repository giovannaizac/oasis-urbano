import { useEffect, useState } from 'react'

import { buildFollowUpPrompt, type ChatMessage } from '@/data/aiPrompt'
import type { WellnessRecord } from '@/hooks/useSimulationStorage'
import { askFollowUp, type InsightData } from '@/Service/aiService'

const STORAGE_PREFIX = 'oasisurbano:chat:'

export function useChat(simulationId: string) {
	const [messages, setMessages] = useState<ChatMessage[]>(() => {
		const saved = localStorage.getItem(STORAGE_PREFIX + simulationId)
		return saved ? (JSON.parse(saved) as ChatMessage[]) : []
	})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		localStorage.setItem(STORAGE_PREFIX + simulationId, JSON.stringify(messages))
	}, [messages, simulationId])

	const sendMessage = async (
		question: string,
		survey: WellnessRecord,
		recommendation: InsightData,
	) => {
		setError(null)
		setMessages((prev) => [...prev, { role: 'user', content: question }])
		setIsLoading(true)

		try {
			const prompt = buildFollowUpPrompt(survey, recommendation, messages, question)
			const answer = await askFollowUp(prompt)
			setMessages((prev) => [...prev, { role: 'ai', content: answer }])
		} catch (err) {
			console.error('Erro no chat:', err)
			if (err instanceof Error && err.message.includes('503')) {
				setError(
					'O serviço de IA está sobrecarregado no momento. Tente novamente em alguns segundos.',
				)
			} else {
				setError('Não foi possível obter uma resposta. Tente novamente.')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return { messages, isLoading, error, sendMessage }
}
