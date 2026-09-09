export interface Place {
	id: string
	name: string
	type: 'park' | 'library' | 'cafe' | 'green_area' | 'coworking' | 'other'
	description: string
	address: string
	neighborhood: string
	latitude: number
	longitude: number
	features: string[]
	bestFor: string[]
	imageUrl?: string
}

export interface WellnessRecommendation {
	places: Place[]
	message: string
	tips: string[]
}

export const placeTypeLabels: Record<Place['type'], string> = {
	park: 'Parque',
	library: 'Biblioteca',
	cafe: 'Café',
	green_area: 'Área Verde',
	coworking: 'Coworking',
	other: 'Outro',
}

export const placeTypeEmojis: Record<Place['type'], string> = {
	park: '🌳',
	library: '📚',
	cafe: '☕',
	green_area: '🌿',
	coworking: '💻',
	other: '📍',
}
