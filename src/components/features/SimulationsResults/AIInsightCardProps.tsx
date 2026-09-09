import 'react-loading-skeleton/dist/skeleton.css'

import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import { useChat } from '@/hooks/useChat'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'

interface AIInsightCardProps {
	simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
	const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
	const { getFormData } = useSimulationStorage()
	const survey = getFormData(simulationId)

	const {
		messages,
		isLoading: isChatLoading,
		error: chatError,
		sendMessage,
	} = useChat(simulationId)
	const [question, setQuestion] = useState('')
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, isChatLoading])

	const handleSend = () => {
		if (!question.trim() || !survey || !insight) return
		sendMessage(question, survey, insight)
		setQuestion('')
	}

	return (
		<div className="bg-card flex max-h-[500px] flex-col rounded-2xl p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:max-h-[600px] sm:p-6">
			<div className="mb-3 flex items-center gap-1.5">
				<span className="text-base sm:text-lg">🌿</span>
				<span className="text-primary text-[10px] font-semibold tracking-widest uppercase sm:text-xs">
					Recomendações de Bem-Estar
				</span>
			</div>

			<div className="flex-1 overflow-y-auto lg:scrollbar-thin lg:[scrollbar-color:var(--border)_transparent]">
				{isLoading && (
					<div className="flex">
						<Skeleton
							count={10.5}
							baseColor="var(--color-skeleton-base)"
							highlightColor="var(--color-skeleton-highlight)"
							className="mb-3 flex rounded-lg"
							containerClassName="flex-1"
							inline
						/>
					</div>
				)}
				{!isLoading && error && (
					<Error
						simulationId={simulationId}
						message={error}
						onRetry={() => fetchInsight(simulationId)}
					/>
				)}
				{!isLoading && insight && !error && (
					<>
						<Content insight={insight} />

						{messages.map((msg, i) => (
							<div key={i} className="mt-4 border-t border-white/10 pt-4">
								<p className="text-muted-foreground text-xs font-semibold uppercase">
									{msg.role === 'user' ? 'Você' : 'Resposta da IA'}
								</p>
								<p className="text-foreground mt-1 text-sm">{msg.content}</p>
							</div>
						))}

						{isChatLoading && (
							<p className="text-muted-foreground mt-4 text-sm italic">Pensando...</p>
						)}
						{chatError && <p className="mt-4 text-sm text-red-500">{chatError}</p>}

						<div ref={scrollRef} />
					</>
				)}
			</div>

			{!isLoading && insight && !error && (
				<div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 sm:mt-4 sm:pt-4">
					<input
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						placeholder="Tem outro lugar parecido com esse na região..."
						className="bg-background flex-1 rounded-full px-3 py-2 text-xs outline-none sm:px-4 sm:text-sm"
					/>
					<button
						onClick={handleSend}
						disabled={isChatLoading}
						className="bg-primary flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white disabled:opacity-50 sm:h-9 sm:w-9"
						aria-label="Enviar pergunta"
					>
						<Send size={14} className="sm:h-4 sm:w-4" />
					</button>
				</div>
			)}
		</div>
	)
}
