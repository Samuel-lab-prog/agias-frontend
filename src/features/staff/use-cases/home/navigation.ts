import type { NavigationPreset } from '@core/components/navigation';
import { CalendarDays, CalendarRange, Home, ShieldCheck, UserRound } from 'lucide-react';

export const staffNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Gestão acadêmica',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/staff', icon: Home },
		{ label: 'Perfil de staff', to: '/staff/my-profile', icon: ShieldCheck },
		{ label: 'Cadastrar aluno', to: '/staff/students', icon: UserRound },
		{ label: 'Turmas e matrículas', to: '/staff/classes', icon: CalendarDays },
		{ label: 'Calendário acadêmico', to: '/staff/academic-calendar', icon: CalendarRange },
	],
};
