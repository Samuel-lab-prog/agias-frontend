import type { ElementType } from 'react';

export type NavigationLink = {
	label: string;
	to: string;
	icon?: ElementType;
	hidden?: boolean;
};

export type NavigationAction = {
	label: string;
	to: string;
	icon?: ElementType;
};

export type NavigationPreset = {
	title: string;
	subtitle?: string;
	action: NavigationAction;
	links: NavigationLink[];
};
