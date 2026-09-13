import type { NavigationPreset } from '@core/components/navigation';
import {
	Building2,
	CalendarDays,
	FileText,
	FlaskConical,
	Home,
	ShieldCheck,
	UserRound,
	Users,
} from 'lucide-react';
export const adminNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Administração',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Visão geral', to: '/admin', icon: Home },
		{ label: 'Equipe', to: '/admin/team', icon: Users },
		{ label: 'Usuários e acessos', to: '/admin/users', icon: UserRound },
		{ label: 'Instituição e campus', to: '/admin/institution', icon: Building2 },
		{ label: 'Turmas e matrículas', to: '/staff/classes', icon: CalendarDays },
		{ label: 'Projetos', to: '/projects', icon: FlaskConical },
		{ label: 'Documentos', to: '/documents', icon: FileText },
		{ label: 'Permissões', to: '/admin/permissions', icon: ShieldCheck },
		{ label: 'Meu perfil', to: '/staff/my-profile', icon: UserRound },
	],
};
