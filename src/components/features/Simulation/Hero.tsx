import { Leaf } from 'lucide-react'

export function SimulationHero() {
	return (
		<div className="mb-6 text-center sm:mb-8">
			<div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
				<h1 className="text-foreground text-2xl font-semibold sm:text-4xl">
					Encontre seu oásis na cidade
				</h1>
				<Leaf size={36} className="text-primary sm:ml-2 sm:h-12 sm:w-12" />
			</div>
			<p className="text-muted-foreground mt-2 text-sm sm:mt-0">
				Responda o que você precisa agora e descubra lugares perfeitos para o seu momento.
			</p>
		</div>
	)
}
