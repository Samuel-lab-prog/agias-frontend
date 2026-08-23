import type { NavigationPreset } from '@core/components/navigation';
import {
	BadgeCent,
	BookOpen,
	Ellipsis,
	Home,
	Library,
	Link2,
	Megaphone,
	Monitor,
	Search,
} from 'lucide-react';

export const homeNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Home institucional',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Entrar', to: '/login', icon: Home },
		{ label: 'Ensino', to: '/login', icon: BookOpen },
		{ label: 'Pesquisa', to: '/login', icon: Search },
		{ label: 'Extensão', to: '/login', icon: Megaphone },
		{ label: 'Ações Associadas', to: '/login', icon: Link2 },
		{ label: 'Biblioteca', to: '/login', icon: Library },
		{ label: 'Bolsas', to: '/login', icon: BadgeCent },
		{ label: 'Ambientes Virtuais', to: '/login', icon: Monitor },
		{ label: 'Outros', to: '/login', icon: Ellipsis },
	],
};
