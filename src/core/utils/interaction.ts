import type { SystemStyleObject } from '@chakra-ui/react';

import { focusRing, interactionTransition } from '../themes/motion';

function recipe(hover: SystemStyleObject, active: SystemStyleObject) {
	const reducedHover = { ...hover, _motionReduce: { transform: 'none' } };
	const disabled = {
		opacity: 0.65,
		cursor: 'not-allowed',
		transform: 'none',
	} satisfies SystemStyleObject;
	return {
		transition: interactionTransition,
		hover: reducedHover,
		active,
		focusVisible: focusRing,
		disabled,
		_hover: reducedHover,
		_active: active,
		_focusVisible: focusRing,
		_disabled: disabled,
	};
}
export function hoverLift() {
	return recipe(
		{ bg: 'bg.surface', borderColor: 'border.interactive', transform: 'translateY(-1px)' },
		{ transform: 'translateY(0)' },
	);
}
export function hoverNav() {
	return recipe(
		{ bg: 'action.primarySubtle', color: 'action.primaryStrong', transform: 'translateX(2px)' },
		{ transform: 'translateX(0)' },
	);
}
export function hoverSubtle() {
	return recipe({ bg: 'action.primarySubtle', color: 'fg.default' }, { bg: 'bg.muted' });
}
