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
			bg: 'surface',
			borderColor: 'borderHover',
			transform: 'translateY(-1px)',
		},
		_hover: {
			bg: 'surface',
			borderColor: 'borderHover',
			transform: 'translateY(-1px)',
		},
		active: {
			transform: 'translateY(0)',
		},
		_active: {
			transform: 'translateY(0)',
		},
		focusVisible: {
			bg: 'surface',
			boxShadow: '0 0 0 3px {colors.focusRing}',
		},
		_focusVisible: {
			bg: 'surface',
			boxShadow: '0 0 0 3px {colors.focusRing}',
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
			bg: 'surface',
			color: 'text',
			transform: 'translateX(2px)',
		},
		_hover: {
			bg: 'surface',
			color: 'text',
			transform: 'translateX(2px)',
		},
		active: {
			transform: 'translateX(1px)',
		},
		_active: {
			transform: 'translateX(1px)',
		},
		focusVisible: {
			boxShadow: '0 0 0 3px {colors.focusRing}',
		},
		_focusVisible: {
			boxShadow: '0 0 0 3px {colors.focusRing}',
		},
	};
}

export function hoverSubtle(): HoverRecipe {
	return {
		transition: interactiveTransition,
		hover: {
			bg: 'surface',
			color: 'text',
		},
		_hover: {
			bg: 'surface',
			color: 'text',
		},
		active: {
			bg: 'surface',
		},
		_active: {
			bg: 'surface',
		},
		focusVisible: {
			boxShadow: '0 0 0 3px {colors.focusRing}',
		},
		_focusVisible: {
			boxShadow: '0 0 0 3px {colors.focusRing}',
		},
	};
}
