import type { NavigationPreset } from '@core/components/navigation';
import { CalendarDays, Home, ShieldCheck, UserRound, UserRoundCog } from 'lucide-react';

export const adminNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Home admin',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/admin', icon: Home },
		{ label: 'Gerenciar staff', to: '/staff', icon: UserRoundCog },
		{ label: 'Cadastrar aluno', to: '/student', icon: UserRound },
		{ label: 'Criar turma', to: '/staff', icon: CalendarDays },
		{ label: 'Ver permissões', to: '/admin', icon: ShieldCheck },
	],
};
