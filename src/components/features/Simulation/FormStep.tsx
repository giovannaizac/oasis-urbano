import { ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react'
import { type SyntheticEvent, useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Input, type InputProps } from '@/components/shared/Input'
import { Select, type SelectOption } from '@/components/shared/Select'
import { formatCurrencyMask } from '@/utils/currency'

export interface FormStepProps {
	id: string
	icon: LucideIcon
	title: string
	question: string
	inputProps?: InputProps
	options?: SelectOption[]
	submitButtonProps?: {
		label: string
		emojiIcon?: string
	}
}

interface ActionsButtonsProps {
	onBack: () => void
	onNext: (value: string) => void
	hideBackButton?: boolean
}

export function FormStep({
	icon: Icon,
	title,
	question,
	inputProps,
	options,
	submitButtonProps,
	hideBackButton,
	onBack,
	onNext,
}: FormStepProps & ActionsButtonsProps) {
	const [inputValue, setInputValue] = useState('')

	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!inputValue) {
			return
		}
		onNext(inputValue)
	}

	return (
		<div className="bg-card rounded-2xl p-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] sm:p-8">
			<div className="bg-primary mb-3 flex h-12 w-12 items-center justify-center rounded-xl sm:mb-4 sm:h-15 sm:w-15">
				<Icon size={24} className="text-primary-foreground sm:h-8 sm:w-8" />
			</div>
			<h2 className="text-primary mb-1 text-[10px] font-semibold tracking-widest uppercase sm:text-xs">{title}</h2>
			<h3 className="text-foreground mb-4 text-lg leading-snug font-semibold sm:mb-6 sm:text-2xl">
				{question}
			</h3>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				{options ? (
					<Select
						options={options}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				) : (
					<Input
						{...inputProps}
						value={inputValue}
						onChange={(e) =>
							setInputValue(
								inputProps?.prefix === 'R$' ? formatCurrencyMask(e.target.value) : e.target.value,
							)
						}
					/>
				)}
				<div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
					{!hideBackButton && (
						<Button
							type="button"
							onClick={onBack}
							variant="ghost"
							icon={ArrowLeft}
							className="order-2 flex-1 justify-center rounded-xl py-3 sm:order-1"
						>
							Voltar
						</Button>
					)}
					<Button
						type="submit"
						variant="primary"
						icon={!submitButtonProps ? ArrowRight : undefined}
						disabled={!inputValue}
						className="order-1 flex-1 sm:order-2"
					>
						{submitButtonProps?.label ?? 'Próximo'}
						{submitButtonProps?.emojiIcon}
					</Button>
				</div>
			</form>
		</div>
	)
}
