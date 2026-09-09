import { type WellnessFormData, type WellnessRecord } from '@/data/WellnessSurvey'

const LOCAL_STORAGE_KEY = 'oasisurbano:simulation-data'

export const useSimulationStorage = () => {
	const saveFormData = (formData: WellnessFormData) => {
		const id = crypto.randomUUID()
		const createdAt = new Date().toISOString()
		const record: WellnessRecord = { ...formData, id, createdAt }

		const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
		const savedData = storage ? (JSON.parse(storage) as WellnessRecord[]) : []

		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...savedData, record]))

		return id
	}

	const getFormData = (id: string): WellnessRecord | null => {
		const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

		if (!storage) return null

		const savedData = JSON.parse(storage) as WellnessRecord[]
		return savedData.find((record) => record.id === id) || null
	}

	const getAllFormData = (): WellnessRecord[] => {
		const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (!storage) {
			return []
		}
		return JSON.parse(storage) as WellnessRecord[]
	}

	const deleteFormData = (id: string) => {
		const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (!storage) return

		const savedData = JSON.parse(storage) as WellnessRecord[]
		const updated = savedData.filter((record) => record.id !== id)

		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
	}

	const updateSimulation = (id: string, data: WellnessRecord) => {
		const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
		const savedData = storage ? (JSON.parse(storage) as WellnessRecord[]) : []

		const updated = savedData.map((record) => (record.id === id ? { ...data } : record))

		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
	}

	return { saveFormData, getFormData, updateSimulation, getAllFormData, deleteFormData }
}
export type { WellnessRecord }
