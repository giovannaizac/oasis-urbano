import { Clock, Leaf, Moon, Sun, TreePine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@/hooks/useTheme'

import { Button } from './Button'
import { Divider } from './Divider'

export function Header() {
	const navigate = useNavigate()
	const { theme, toggleTheme } = useTheme()

	return (
		<header className="border-b border-(--border) px-3 py-2 sm:px-6 sm:py-3">
			<nav className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9">
						<Leaf size={18} className="text-primary-foreground sm:h-5 sm:w-5" />
					</div>
					<span className="text-base sm:text-lg">
						<span className="text-muted-foreground font-medium">Oásis</span>
						<span className="font-extrabold">Urbano</span>
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Button variant="secondary" icon={TreePine} onClick={() => void navigate('/')}>
						<span className="hidden sm:inline">Novo Mapeamento</span>
					</Button>
					<Button variant="ghost" icon={Clock} onClick={() => void navigate('/historico')}>
						<span className="hidden whitespace-nowrap sm:inline">Locais Visitados</span>
					</Button>
					<Divider orientation="vertical" className="hidden sm:block" />
					<Button
						aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
						variant="ghost"
						icon={theme === 'light' ? Moon : Sun}
						onClick={toggleTheme}
					/>
				</div>
			</nav>
		</header>
	)
}
