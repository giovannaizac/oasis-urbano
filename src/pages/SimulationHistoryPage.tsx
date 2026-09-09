import { ExternalLink, Leaf, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationHistoryPage() {
	const navigate = useNavigate()
	const { getAllFormData, deleteFormData } = useSimulationStorage()
	const [simulations, setSimulations] = useState(() => getAllFormData())

	const handleDelete = (id: string) => {
		const surveyToDelete = simulations.find((sim) => sim.id === id)

		if (!surveyToDelete) return

		const confirmed = window.confirm(`Excluir esta pesquisa do histórico?`)

		if (!confirmed) return

		deleteFormData(id)
		setSimulations((prev) => prev.filter((sim) => sim.id !== id))
	}

	const sortedSimulations = [...simulations].sort((a, b) => {
		const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
		const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0

		return dateB - dateA
	})

	const environmentLabels: Record<string, string> = {
		outdoor: 'Ao ar livre',
		indoor: 'Ambiente fechado',
		both: 'Tanto faz',
	}

	if (simulations.length === 0) {
		return (
			<main className="mx-auto max-w-6xl px-3 py-6 text-center sm:px-6 sm:py-14 lg:px-8">
				<PageHero title="Locais Visitados" subtitle="Você ainda não descobriu nenhum oásis." />
				<Button variant="primary" onClick={() => navigate('/')}>
					Descobrir meu primeiro oásis
				</Button>
			</main>
		)
	}

	return (
		<main className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-14 lg:px-8">
			<PageHero title="Locais Visitados" subtitle="Histórico das suas descobertas de bem-estar." />
			<div className="flex flex-col gap-3 sm:gap-4">
				{sortedSimulations.map((survey) => {
					const formattedDate = survey.createdAt
						? new Date(survey.createdAt).toLocaleDateString('pt-BR', {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
							})
						: 'Data indisponível'
					return (
						<article
							key={survey.id}
							className="bg-card flex flex-col gap-3 rounded-2xl border-none p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:grid sm:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.8fr))_auto_auto] sm:items-center sm:gap-4 sm:p-6"
						>
							<div className="flex min-w-0 items-center gap-3 sm:gap-4">
								<div className="bg-muted-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11">
									<Leaf size={18} className="text-primary sm:h-5 sm:w-5" />
								</div>
								<div className="min-w-1">
									<p className="text-foreground truncate text-sm font-semibold">
										{oasisLabels[survey.mood] || survey.mood}
									</p>
									<p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
										{survey.city || 'Cidade não informada'} • {formattedDate}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-4 sm:block">
								<div>
									<p className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
										Ambiente
									</p>
									<p className="text-foreground mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">
										{environmentLabels[survey.environment] || survey.environment}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
										Distância
									</p>
									<p className="text-foreground mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">
										{survey.maxDistance} km
									</p>
								</div>
							</div>

							<div className="border-border/60 border-t pt-2 sm:border-t-0 sm:pt-0" />
							<div className="flex items-center justify-end gap-3 sm:gap-4 md:gap-8">
								<button
									aria-label="Excluir pesquisa"
									onClick={() => handleDelete(survey.id)}
									className="cursor-pointer text-red-500 transition-opacity hover:opacity-70"
								>
									<Trash2 size={20} className="sm:h-6 sm:w-6" />
								</button>
								<div className="bg-border/60 h-8 w-px sm:h-10" />
								<Button
									variant="secondary"
									icon={ExternalLink}
									onClick={() => navigate(`/resultado/${survey.id}`)}
									className="border-none bg-transparent text-xs transition-opacity hover:opacity-70 sm:pr-7"
								>
									Ver detalhes
								</Button>
							</div>
						</article>
					)
				})}
			</div>
		</main>
	)
}

const oasisLabels: Record<string, string> = {
	relax: '🧘 Relaxar e respirar',
	focus: '📚 Estudar ou me concentrar',
	disconnect: '🌿 Me desconectar da rotina',
	nature: '🌳 Contato com a natureza',
}
