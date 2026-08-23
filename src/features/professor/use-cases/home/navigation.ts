import type { NavigationPreset } from '@core/components/navigation';
import { BookOpen, CalendarDays, ClipboardList, Home, School } from 'lucide-react';

export const professorNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Home professor',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/professor', icon: Home },
		{ label: 'Minhas turmas', to: '/professor', icon: School },
		{ label: 'Atividades', to: '/professor', icon: ClipboardList },
		{ label: 'Calendário', to: '/professor', icon: CalendarDays },
		{ label: 'Materiais', to: '/professor', icon: BookOpen },
	],
};
