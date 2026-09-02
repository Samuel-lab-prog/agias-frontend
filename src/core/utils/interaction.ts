import type { SystemStyleObject } from '@chakra-ui/react';

import { componentColors } from '../components/localStyles';

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
			bg: componentColors.light.surface,
			borderColor: componentColors.light.borderHover,
			transform: 'translateY(-1px)',
		},
		_hover: {
			bg: componentColors.light.surface,
			borderColor: componentColors.light.borderHover,
			transform: 'translateY(-1px)',
		},
		active: {
			transform: 'translateY(0)',
		},
		_active: {
			transform: 'translateY(0)',
		},
		focusVisible: {
			bg: componentColors.light.surface,
			boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
		},
		_focusVisible: {
			bg: componentColors.light.surface,
			boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
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
			bg: componentColors.light.surface,
			color: componentColors.light.text,
			transform: 'translateX(2px)',
		},
		_hover: {
			bg: componentColors.light.surface,
			color: componentColors.light.text,
			transform: 'translateX(2px)',
		},
		active: {
			transform: 'translateX(1px)',
		},
		_active: {
			transform: 'translateX(1px)',
		},
		focusVisible: {
			boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
		},
		_focusVisible: {
			boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
		},
	};
}

export function hoverSubtle(): HoverRecipe {
	return {
		transition: interactiveTransition,
		hover: {
			bg: componentColors.light.surface,
			color: componentColors.light.text,
		},
		_hover: {
			bg: componentColors.light.surface,
			color: componentColors.light.text,
		},
		active: {
			bg: componentColors.light.surface,
		},
		_active: {
			bg: componentColors.light.surface,
		},
		focusVisible: {
			boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
		},
		_focusVisible: {
			boxShadow: `0 0 0 3px ${componentColors.light.focusRing}`,
		},
	};
}
