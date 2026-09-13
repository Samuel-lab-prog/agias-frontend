import type { NavigationPreset } from '@core/components/navigation';
import { CalendarDays, CalendarRange, FileText, FlaskConical, Home, UserRound } from 'lucide-react';
export const staffNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Secretaria acadêmica',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/staff', icon: Home },
		{ label: 'Meu perfil', to: '/staff/my-profile', icon: UserRound },
		{ label: 'Cadastrar aluno', to: '/staff/students', icon: UserRound },
		{ label: 'Turmas e matrículas', to: '/staff/classes', icon: CalendarDays },
		{ label: 'Calendário acadêmico', to: '/staff/academic-calendar', icon: CalendarRange },
		{ label: 'Projetos', to: '/projects', icon: FlaskConical },
		{ label: 'Documentos', to: '/documents', icon: FileText },
	],
};
