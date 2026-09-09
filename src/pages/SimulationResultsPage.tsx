import { MapPin, Navigation, TreePine } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { AIInsightsCard } from '@/components/features/SimulationsResults/AIInsightCardProps'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationResultsPage() {
	const { id } = useParams<{ id: string }>()
	const { getFormData } = useSimulationStorage()

	const data = id ? getFormData(id) : null

	if (!data) {
		return <p>Pesquisa não encontrada.</p>
	}

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

	return (
		<main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-10 sm:py-14">
			<PageHero
				title="Seu oásis foi encontrado"
				subtitle={`Lugares perfeitos em ${data.city || 'sua cidade'} para o seu momento.`}
			/>
			<div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-4 sm:gap-4">
				<div className="bg-card flex items-center gap-3 rounded-2xl p-3 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-4">
					<div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
						<MapPin size={18} className="text-primary sm:h-5 sm:w-5" />
					</div>
					<div>
						<p className="text-muted-foreground text-[10px] sm:text-xs">Cidade</p>
						<p className="text-foreground text-xs font-semibold sm:text-sm">{data.city || 'Não informada'}</p>
					</div>
				</div>
				<div className="bg-card flex items-center gap-3 rounded-2xl p-3 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-4">
					<div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
						<TreePine size={18} className="text-primary sm:h-5 sm:w-5" />
					</div>
					<div>
						<p className="text-muted-foreground text-[10px] sm:text-xs">O que você precisa</p>
						<p className="text-foreground text-xs font-semibold sm:text-sm">
							{moodLabels[data.mood] || data.mood}
						</p>
					</div>
				</div>
				<div className="bg-card flex items-center gap-3 rounded-2xl p-3 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-4">
					<div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
						<Navigation size={18} className="text-primary sm:h-5 sm:w-5" />
					</div>
					<div>
						<p className="text-muted-foreground text-[10px] sm:text-xs">Ambiente</p>
						<p className="text-foreground text-xs font-semibold sm:text-sm">
							{environmentLabels[data.environment] || data.environment}
						</p>
					</div>
				</div>
				<div className="bg-card flex items-center gap-3 rounded-2xl p-3 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-4">
					<div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10">
						<Navigation size={18} className="text-primary sm:h-5 sm:w-5" />
					</div>
					<div>
						<p className="text-muted-foreground text-[10px] sm:text-xs">Distância máxima</p>
						<p className="text-foreground text-xs font-semibold sm:text-sm">{data.maxDistance} km</p>
					</div>
				</div>
			</div>
			<AIInsightsCard simulationId={data.id} />
		</main>
	)
}
