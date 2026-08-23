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
