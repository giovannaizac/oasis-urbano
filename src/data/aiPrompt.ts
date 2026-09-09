import type { InsightData } from '@/Service/aiService'
import type { WellnessRecord } from '@/hooks/useSimulationStorage'

const RESPONSE_SCHEMA = `{
  "places": [
    {
      "id": "<id_unico_do_lugar>",
      "name": "<nome do lugar>",
      "type": "<park | library | cafe | green_area | coworking | other>",
      "description": "<descrição curta e acolhedora do lugar, 1-2 frases>",
      "address": "<endereço completo>",
      "neighborhood": "<bairro>",
      "latitude": <coordenada latitude>,
      "longitude": <coordenada longitude>,
      "features": ["<feature1>", "<feature2>"],
      "bestFor": ["<用途1>", "<用途2>"]
    }
  ],
  "message": "<Mensagem acolhedora e personalizada explicando por que esses lugares são ideais para o momento do usuário. Máximo 3 frases.>",
  "tips": ["<Dica prática para aproveitar melhor o momento de bem-estar>"]
}`

export function buildAIPrompt(survey: WellnessRecord) {
	const { city, mood, environment, maxDistance, timePreference } = survey

	const moodLabels: Record<string, string> = {
		relax: 'Relaxar e respirar',
		focus: 'Estudar ou se concentrar',
		disconnect: 'Me desconectar da rotina',
		nature: 'Ter contato com a natureza',
	}

	const environmentLabels: Record<string, string> = {
		outdoor: 'Ao ar livre',
		indoor: 'Ambiente fechado',
		both: 'Tanto faz',
	}

	const timeLabels: Record<string, string> = {
		morning: 'Manhã',
		afternoon: 'Tarde',
		night: 'Noite',
	}

	return `Você é um guia de bem-estar urbano especializado em encontrar espaços que promovem saúde mental e qualidade de vida nas cidades.

Analise as respostas do usuário abaixo e recomende de 3 a 5 lugares reais e conhecidos na cidade de ${city || 'São Paulo'} que sejam ideais para o momento que ele está vivendo.

Dados do usuário:
- Cidade: ${city || 'São Paulo'}
- O que precisa: ${moodLabels[mood] || mood}
- Tipo de ambiente preferido: ${environmentLabels[environment] || environment}
- Distância máxima disposto a ir: ${maxDistance} km
- Horário preferido: ${timeLabels[timePreference] || timePreference}

IMPORTANTE:
- Recomende lugares REAIS e CONHECIDOS na cidade informada (${city || 'São Paulo'})
- Use coordenadas aproximadas reais dos lugares
- O primeiro lugar deve ser a "melhor escolha" para o usuário
- Seja específico em features e por que cada lugar é bom para o que o usuário precisa
- Se não conhecer a cidade, seja honesto e sugira que o usuário pesquise por locais similares

Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

${RESPONSE_SCHEMA}

Regras:
- Todos os textos em português do Brasil
- Máximo 5 lugares por recomendação
- O campo "features" deve ter no máximo 4 itens
- O campo "bestFor" deve ter no máximo 3 itens
- O campo "message" deve ser acolhedor e pessoal
- Nunca use markdown dentro dos valores do JSON`
}

export interface ChatMessage {
	role: 'user' | 'ai'
	content: string
}

export function buildFollowUpPrompt(
	survey: WellnessRecord,
	recommendation: InsightData,
	history: ChatMessage[],
	question: string,
) {
	const historyText = history
		.map((msg) => `${msg.role === 'user' ? 'Usuário' : 'Você'}: ${msg.content}`)
		.join('\n')

	const placesList = recommendation.places.map((p) => `- ${p.name} (${p.neighborhood})`).join('\n')

	return `Você é um guia de bem-estar urbano conversando com um usuário sobre as recomendações de lugares feitas anteriormente. Responda em português do Brasil, com linguagem acolhedora e informativa, em texto corrido (sem markdown, sem JSON).

Contexto do usuário:
- Cidade: ${survey.city || 'São Paulo'}
- O que precisa: ${survey.mood}
- Ambiente preferido: ${survey.environment}
- Distância máxima: ${survey.maxDistance} km
- Horário preferido: ${survey.timePreference}

Lugares recomendados:
${placesList}

Mensagem anterior: ${recommendation.message}

${historyText ? `Histórico da conversa até agora:\n${historyText}\n` : ''}Nova pergunta do usuário: ${question}

Responda de forma útil e empática, ajudando o usuário a aproveitar melhor os lugares recomendados ou sugerindo alternativas se necessário.`
}
