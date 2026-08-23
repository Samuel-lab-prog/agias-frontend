import type { NavigationPreset } from '@core/components/navigation';
import { CalendarDays, ClipboardList, Home, ShieldCheck, UserRound } from 'lucide-react';

export const staffNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Home staff',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/staff', icon: Home },
		{ label: 'Perfil de staff', to: '/staff/my-profile', icon: ShieldCheck },
		{ label: 'Cadastrar aluno', to: '/student', icon: UserRound },
		{ label: 'Turmas', to: '/staff', icon: CalendarDays },
		{ label: 'Atividades', to: '/staff', icon: ClipboardList },
	],
};
