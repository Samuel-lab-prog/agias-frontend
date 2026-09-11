import type { SystemStyleObject } from '@chakra-ui/react';

import { foundations } from './foundations';

/** Shared motion vocabulary. Hover never carries information that is absent at rest. */
export const motionTokens = {
	duration: foundations.durations,
	easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
	staggerMs: 35,
	maxStaggerMs: 175,
} as const;

export const interactionTransition = [
	'background-color',
	'color',
	'border-color',
	'box-shadow',
	'opacity',
	'transform',
]
	.map((property) => `${property} ${motionTokens.duration.normal} ${motionTokens.easing}`)
	.join(', ');

export const focusRing: SystemStyleObject = {
	outline: '2px solid',
	outlineColor: 'action.primary',
	outlineOffset: '3px',
};

const base: SystemStyleObject = {
	transition: interactionTransition,
	_focusVisible: focusRing,
	_motionReduce: { transition: 'none', transform: 'none' },
};

export const interactiveStyles = {
	card: {
		...base,
		cursor: 'pointer',
		_hover: {
			borderColor: 'action.primary',
			boxShadow: 'floating',
			transform: 'translateY(-3px)',
			_motionReduce: { transform: 'none' },
		},
		_active: { transform: 'translateY(0)', boxShadow: 'surface' },
	} satisfies SystemStyleObject,
	row: {
		...base,
		cursor: 'pointer',
		_hover: {
			bg: 'action.primarySubtle',
			color: 'action.primaryStrong',
			transform: 'translateX(2px)',
			_motionReduce: { transform: 'none' },
		},
		_active: { transform: 'translateX(0)' },
	} satisfies SystemStyleObject,
	field: {
		...base,
		borderColor: 'border.default',
		bg: 'bg.surface',
		_hover: { borderColor: 'action.primary' },
		_focusVisible: { ...focusRing, outlineOffset: '1px' },
	} satisfies SystemStyleObject,
	day: {
		...base,
		_hover: { bg: 'action.primarySubtle', borderColor: 'action.primary', boxShadow: 'surface' },
		_active: { bg: 'action.primarySubtle' },
	} satisfies SystemStyleObject,
};

export const motionKeyframes = {
	'agias-enter': {
		from: { opacity: 0, transform: 'translateY(8px)' },
		to: { opacity: 1, transform: 'translateY(0)' },
	},
	'agias-fade': { from: { opacity: 0 }, to: { opacity: 1 } },
};

export const pageEntry: SystemStyleObject = {
	animation: `agias-enter ${motionTokens.duration.slow} ${motionTokens.easing} backwards`,
	_motionReduce: { animation: 'none' },
};

export const contentEntry: SystemStyleObject = {
	animation: `agias-fade ${motionTokens.duration.normal} ease-out both`,
	_motionReduce: { animation: 'none' },
};
