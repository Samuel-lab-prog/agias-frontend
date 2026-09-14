import type { NavigationPreset } from '@core/components/navigation';
import {
	BookOpen,
	CalendarDays,
	ClipboardList,
	FileText,
	FlaskConical,
	Home,
	UserRound,
} from 'lucide-react';

export const studentNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/student', icon: Home },
		{ label: 'Projetos', to: '/projects', icon: FlaskConical },
		{ label: 'Documentos', to: '/documents', icon: FileText },
		{ label: 'Disciplinas', to: '/student/classes', icon: BookOpen },
		{ label: 'Meu perfil', to: '/student/profile', icon: UserRound },
		{ label: 'Agenda de aulas', to: '/student/schedule', icon: CalendarDays },
		{ label: 'Atividades', to: '/student/activities', icon: ClipboardList },
		{ label: 'Materiais', to: '/student/materials', icon: BookOpen },
	],
};
