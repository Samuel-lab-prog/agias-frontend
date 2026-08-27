import { defineRecipe } from '@chakra-ui/react';

import { hoverLift, hoverSubtle } from '../../utils/interaction';

const liftMotion = hoverLift();
const subtleMotion = hoverSubtle();

export const buttonRecipe = defineRecipe({
	base: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '2',
		fontWeight: 'semibold',
		borderRadius: 'md',
		border: '1px solid transparent',
		userSelect: 'none',
		transform: 'translateY(0)',
		willChange: 'transform, box-shadow, filter',
		transition: liftMotion.transition,
		_focusVisible: liftMotion.focusVisible,
		_disabled: {
			...liftMotion.disabled,
			opacity: '0.78',
			cursor: 'not-allowed',
			boxShadow: 'none',
			filter: 'saturate(0.92)',
		},
	},
	variants: {
		size: {
			sm: {
				h: '8',
				minW: '8',
				px: '3',
				fontSize: 'xs',
			},
			md: {
				h: '10',
				minW: '10',
				px: '4',
				fontSize: 'sm',
			},
			lg: {
				h: '12',
				minW: '12',
				px: '6',
				fontSize: 'md',
			},
		},
		variant: {
			surface: {
				color: 'white',
				borderColor: 'blue.950',
				background: 'linear-gradient(135deg, {colors.blue.950}, {colors.blue.800})',
				boxShadow: '0 4px 14px rgba(3, 105, 161, 0.22)',
				_hover: {
					...liftMotion.hover,
					background: 'linear-gradient(135deg, {colors.blue.900}, {colors.blue.700})',
					boxShadow: '0 8px 24px rgba(37, 99, 235, 0.28)',
				},
				_active: {
					...liftMotion.active,
					background: 'linear-gradient(135deg, {colors.blue.950}, {colors.blue.900})',
					boxShadow: '0 2px 10px rgba(37, 99, 235, 0.32)',
				},
			},
			solidPurple: {
				bg: 'blue.700',
				color: 'white',
				borderColor: 'blue.700',
				boxShadow: '0 4px 14px rgba(37, 99, 235, 0.24)',
				_hover: {
					...liftMotion.hover,
					bg: 'blue.600',
					boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
				},
				_active: {
					...liftMotion.active,
					bg: 'blue.800',
					boxShadow: '0 2px 10px rgba(37, 99, 235, 0.34)',
				},
			},
			solidPink: {
				bg: 'rose.600',
				color: 'white',
				borderColor: 'rose.600',
				boxShadow: '0 4px 14px rgba(225, 29, 72, 0.22)',
				_hover: {
					...liftMotion.hover,
					bg: 'rose.500',
					boxShadow: '0 8px 20px rgba(225, 29, 72, 0.28)',
				},
				_active: {
					...liftMotion.active,
					bg: 'rose.700',
					boxShadow: '0 2px 10px rgba(225, 29, 72, 0.32)',
				},
			},
			outlinePurple: {
				bg: 'transparent',
				color: 'text',
				borderColor: 'border',
				_disabled: {
					color: 'textMuted',
					borderColor: 'border',
					bg: 'transparent',
				},
				_hover: {
					...subtleMotion.hover,
					bg: 'surface',
					color: 'text',
					borderColor: 'borderHover',
				},
				_active: {
					...subtleMotion.active,
					bg: 'surface',
				},
			},
			ghostPink: {
				bg: 'transparent',
				color: 'text',
				borderColor: 'transparent',
				_disabled: {
					color: 'textMuted',
					bg: 'transparent',
					borderColor: 'transparent',
				},
				_hover: {
					...subtleMotion.hover,
					bg: 'surface',
					color: 'text',
					borderColor: 'border',
				},
				_active: {
					...subtleMotion.active,
					bg: 'surface',
				},
			},
			danger: {
				bg: 'red.500',
				color: 'white',
				borderColor: 'red.500',
				boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
				_hover: {
					...liftMotion.hover,
					bg: 'red.400',
					boxShadow: '0 8px 20px rgba(239, 68, 68, 0.32)',
				},
				_active: {
					...liftMotion.active,
					bg: 'red.500',
					filter: 'brightness(0.92)',
					boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
				},
			},
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'surface',
	},
});
