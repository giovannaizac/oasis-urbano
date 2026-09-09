import { MapPin } from 'lucide-react'
import type { PropsWithChildren } from 'react'

import { type Place, placeTypeEmojis, placeTypeLabels } from '@/data/Place'
import type { InsightData } from '@/Service/aiService'

interface ContentProps {
	insight: InsightData
}

function Paragraph({ children }: PropsWithChildren) {
	return <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
}

function SectionTitle({ children }: PropsWithChildren) {
	return (
		<h3 className="text-foreground mt-5 mb-1.5 text-sm leading-relaxed font-semibold">
			{children}
		</h3>
	)
}

function OrderedList({ items }: { items: string[] }) {
	return (
		<ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
			{items.map((item, index) => (
				<li key={index} className="pl-1">
					{item}
				</li>
			))}
		</ol>
	)
}

function PlaceCard({ place, isBestChoice }: { place: Place; isBestChoice?: boolean }) {
	const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`

	return (
		<div
			className={`rounded-xl border p-4 ${
				isBestChoice ? 'border-primary bg-primary/5' : 'border-border bg-background'
			}`}
		>
			<div className="mb-2 flex items-start justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xl">{placeTypeEmojis[place.type]}</span>
					<div>
						<h4 className="text-foreground text-sm font-semibold">{place.name}</h4>
						<p className="text-muted-foreground text-xs">
							{placeTypeLabels[place.type]} • {place.neighborhood}
						</p>
					</div>
				</div>
				{isBestChoice && (
					<span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
						⭐ Melhor escolha
					</span>
				)}
			</div>

			<p className="text-muted-foreground mb-3 text-sm">{place.description}</p>

			<div className="mb-3 flex flex-wrap gap-1">
				{place.features.map((feature, i) => (
					<span key={i} className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
						{feature}
					</span>
				))}
			</div>

			<div className="mb-3">
				<p className="text-muted-foreground text-xs font-medium">Ideal para:</p>
				<div className="mt-1 flex flex-wrap gap-1">
					{place.bestFor.map((use, i) => (
						<span key={i} className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
							{use}
						</span>
					))}
				</div>
			</div>

			<a
				href={googleMapsUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
			>
				<MapPin size={12} />
				Ver no Google Maps
			</a>
		</div>
	)
}

export function Content({ insight }: ContentProps) {
	return (
		<div className="lg:max-h-93 lg:scrollbar-thin lg:[scrollbar-color:var(--border)_transparent] lg:overflow-y-auto lg:pr-2">
			<section className="mb-4">
				<SectionTitle>🌿 Seu Oásis</SectionTitle>
				<Paragraph>{insight.message}</Paragraph>
			</section>

			<section className="mb-4">
				<SectionTitle>📍 Lugares Recomendados</SectionTitle>
				<div className="mt-3 flex flex-col gap-3">
					{insight.places.map((place, index) => (
						<PlaceCard key={place.id} place={place} isBestChoice={index === 0} />
					))}
				</div>
			</section>

			{insight.tips && insight.tips.length > 0 && (
				<section>
					<SectionTitle>💡 Dicas para seu momento</SectionTitle>
					<OrderedList items={insight.tips} />
				</section>
			)}
		</div>
	)
}
