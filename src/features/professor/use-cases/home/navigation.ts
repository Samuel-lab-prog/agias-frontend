import type { NavigationPreset } from '@core/components/navigation';
import {
	BookOpen,
	CalendarDays,
	ClipboardList,
	FileText,
	FlaskConical,
	Home,
	School,
	UserRound,
} from 'lucide-react';

export const professorNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Espaço docente',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/professor', icon: Home },
		{ label: 'Projetos', to: '/projects', icon: FlaskConical },
		{ label: 'Documentos', to: '/documents', icon: FileText },
		{ label: 'Minhas turmas', to: '/professor/classes', icon: School },
		{ label: 'Atividades', to: '/professor/activities', icon: ClipboardList },
		{ label: 'Calendário', to: '/professor/calendar', icon: CalendarDays },
		{ label: 'Materiais', to: '/professor/materials', icon: BookOpen },
		{ label: 'Meu perfil', to: '/professor/profile', icon: UserRound },
	],
};
