import { BookOpen, Coffee, Leaf, MapPin, TreePine } from 'lucide-react'

import type { InsightData } from '@/Service/aiService'
import type { FormStepProps } from '../components/features/Simulation/FormStep'

export const wellnessFormSteps = [
	{
		id: 'city',
		icon: MapPin,
		title: 'Sua cidade',
		question: 'Em qual cidade você está?',
		inputProps: {
			placeholder: 'ex: São Paulo, Rio de Janeiro, Belo Horizonte...',
			maxLength: 100,
		},
	},
	{
		id: 'mood',
		icon: Leaf,
		title: 'Como você está se sentindo?',
		question: 'O que você mais precisa neste momento?',
		options: [
			{ value: 'relax', label: '🧘 Relaxar e respirar' },
			{ value: 'focus', label: '📚 Estudar ou me concentrar' },
			{ value: 'disconnect', label: '🌿 Me desconectar da rotina' },
			{ value: 'nature', label: '🌳 Ter contato com a natureza' },
		],
	},
	{
		id: 'environment',
		icon: TreePine,
		title: 'Tipo de ambiente',
		question: 'Qual tipo de lugar você prefere?',
		options: [
			{ value: 'outdoor', label: '☀️ Ao ar livre' },
			{ value: 'indoor', label: '🏠 Ambiente fechado' },
			{ value: 'both', label: '🤷 Tanto faz' },
		],
	},
	{
		id: 'maxDistance',
		icon: Coffee,
		title: 'Distância máxima',
		question: 'Até onde você está disposto a ir? (em km)',
		inputProps: {
			type: 'number',
			placeholder: 'ex: 5',
			suffix: 'km',
			min: 1,
			max: 50,
		},
	},
	{
		id: 'timePreference',
		icon: BookOpen,
		title: 'Horário preferido',
		question: 'Qual o melhor horário para você?',
		options: [
			{ value: 'morning', label: '🌅 Manhã' },
			{ value: 'afternoon', label: '☀️ Tarde' },
			{ value: 'night', label: '🌙 Noite' },
		],
		submitButtonProps: {
			label: 'Encontrar meu oásis',
			emojiIcon: '🌿',
		},
	},
] satisfies FormStepProps[]

export type WellnessFormData = Record<(typeof wellnessFormSteps)[number]['id'], string>

export type WellnessRecord = WellnessFormData & { id: string; createdAt: string; insight?: InsightData }
