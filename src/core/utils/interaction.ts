import type { SystemStyleObject } from '@chakra-ui/react';

const interactiveTransition =
	'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease';

type HoverRecipe = {
	hover: SystemStyleObject;
	active: SystemStyleObject;
	focusVisible?: SystemStyleObject;
	disabled?: SystemStyleObject;
	_hover: SystemStyleObject;
	_active: SystemStyleObject;
	_focusVisible?: SystemStyleObject;
	_disabled?: SystemStyleObject;
	transition: string;
};

export function hoverLift(): HoverRecipe {
	return {
		transition: interactiveTransition,
		hover: {
			bg: 'bg.surface',
			borderColor: 'border.interactive',
			transform: 'translateY(-1px)',
		},
		_hover: {
			bg: 'bg.surface',
			borderColor: 'border.interactive',
			transform: 'translateY(-1px)',
		},
		active: {
			transform: 'translateY(0)',
		},
		_active: {
			transform: 'translateY(0)',
		},
		focusVisible: {
			bg: 'bg.surface',
			boxShadow: '0 0 0 3px token(colors.focus.ring)',
		},
		_focusVisible: {
			bg: 'bg.surface',
			boxShadow: '0 0 0 3px token(colors.focus.ring)',
		},
		disabled: {
			opacity: 0.72,
			cursor: 'not-allowed',
			transform: 'translateY(0)',
		},
		_disabled: {
			opacity: 0.72,
			cursor: 'not-allowed',
			transform: 'translateY(0)',
		},
	};
}

export function hoverNav(): HoverRecipe {
	return {
		transition: interactiveTransition,
		hover: {
			bg: 'bg.surface',
			color: 'fg.default',
			transform: 'translateX(2px)',
		},
		_hover: {
			bg: 'bg.surface',
			color: 'fg.default',
			transform: 'translateX(2px)',
		},
		active: {
			transform: 'translateX(1px)',
		},
		_active: {
			transform: 'translateX(1px)',
		},
		focusVisible: {
			boxShadow: '0 0 0 3px token(colors.focus.ring)',
		},
		_focusVisible: {
			boxShadow: '0 0 0 3px token(colors.focus.ring)',
		},
	};
}

export function hoverSubtle(): HoverRecipe {
	return {
		transition: interactiveTransition,
		hover: {
			bg: 'bg.surface',
			color: 'fg.default',
		},
		_hover: {
			bg: 'bg.surface',
			color: 'fg.default',
		},
		active: {
			bg: 'bg.surface',
		},
		_active: {
			bg: 'bg.surface',
		},
		focusVisible: {
			boxShadow: '0 0 0 3px token(colors.focus.ring)',
		},
		_focusVisible: {
			boxShadow: '0 0 0 3px token(colors.focus.ring)',
		},
	};
}
