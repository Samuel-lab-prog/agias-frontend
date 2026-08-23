import {
	BadgeCent,
	BookOpen,
	CalendarDays,
	ClipboardList,
	Ellipsis,
	Home,
	Library,
	Link2,
	Megaphone,
	Monitor,
	School,
	Search,
	ShieldCheck,
	UserRound,
	UserRoundCog,
} from 'lucide-react';

import type { NavigationAction, NavigationLink } from './types';

export type NavigationPreset = {
	title: string;
	subtitle?: string;
	action: NavigationAction;
	links: NavigationLink[];
};

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

export const studentNavigationPreset: NavigationPreset = {
	title: 'AGIAS',
	subtitle: 'Home student',
	action: { label: 'Sair', to: '/login' },
	links: [
		{ label: 'Início', to: '/student', icon: Home },
		{ label: 'Meu perfil', to: '/student', icon: UserRound },
		{ label: 'Agenda de aulas', to: '/student', icon: CalendarDays },
		{ label: 'Atividades', to: '/student', icon: ClipboardList },
		{ label: 'Materiais', to: '/student', icon: BookOpen },
	],
};

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
