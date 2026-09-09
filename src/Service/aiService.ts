import type { Place } from '@/data/Place'

interface GeminiResponse {
	candidates: {
		content: {
			parts: { text: string }[]
		}
	}[]
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-3.5-flash-lite'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (prompt: string) => {
	const response = await fetch(GEMINI_API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contents: [{ parts: [{ text: prompt }] }],
		}),
	})

	if (!response.ok) {
		const errorData = await response.text()
		console.error('Erro na API Gemini:', response.status, errorData)
		throw new Error(`Erro na requisição: ${response.status} - ${errorData}`)
	}

	return (await response.json()) as GeminiResponse
}

export interface InsightData {
	places: Place[]
	message: string
	tips: string[]
}

export const getInsight = async (prompt: string) => {
	const response = await callGeminiAPI(prompt)
	const json = response.candidates[0].content.parts[0].text

	// Try to extract JSON from the response if it's wrapped in markdown code blocks
	let jsonStr = json
	const jsonMatch = json.match(/```(?:json)?\s*([\s\S]*?)```/)
	if (jsonMatch) {
		jsonStr = jsonMatch[1]
	}

	try {
		return JSON.parse(jsonStr) as InsightData
	} catch (parseError) {
		console.error('Erro ao fazer parse do JSON:', parseError)
		console.error('Resposta recebida:', json)
		const error = new Error('Resposta da IA não está em formato JSON válido')
		if (parseError instanceof Error) {
			error.cause = parseError
		}
		throw error
	}
}

export const askFollowUp = async (prompt: string) => {
	const response = await callGeminiAPI(prompt)
	return response.candidates[0].content.parts[0].text
}
