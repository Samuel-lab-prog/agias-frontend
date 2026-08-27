import { defineRecipe } from '@chakra-ui/react';

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
		transition:
			'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease, filter 0.2s ease',
		_focusVisible: {
			outline: 'none',
			boxShadow: '0 0 0 2px {colors.background}, 0 0 0 4px {colors.gray.700}',
		},
		_disabled: {
			opacity: '0.78',
			cursor: 'not-allowed',
			boxShadow: 'none',
			transform: 'translateY(0)',
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
					background: 'linear-gradient(135deg, {colors.blue.900}, {colors.blue.700})',
					boxShadow: '0 8px 24px rgba(37, 99, 235, 0.28)',
					transform: 'translateY(-1px)',
				},
				_active: {
					background: 'linear-gradient(135deg, {colors.blue.950}, {colors.blue.900})',
					transform: 'translateY(1px) scale(0.99)',
					boxShadow: '0 2px 10px rgba(37, 99, 235, 0.32)',
				},
			},
			solidPurple: {
				bg: 'blue.700',
				color: 'white',
				borderColor: 'blue.700',
				boxShadow: '0 4px 14px rgba(37, 99, 235, 0.24)',
				_hover: {
					bg: 'blue.600',
					boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'blue.800',
					transform: 'translateY(1px) scale(0.99)',
					boxShadow: '0 2px 10px rgba(37, 99, 235, 0.34)',
				},
			},
			solidPink: {
				bg: 'rose.600',
				color: 'white',
				borderColor: 'rose.600',
				boxShadow: '0 4px 14px rgba(225, 29, 72, 0.22)',
				_hover: {
					bg: 'rose.500',
					boxShadow: '0 8px 20px rgba(225, 29, 72, 0.28)',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'rose.700',
					transform: 'translateY(1px) scale(0.99)',
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
					bg: 'surface',
					color: 'text',
					borderColor: 'borderHover',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'surface',
					transform: 'translateY(1px) scale(0.99)',
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
					bg: 'surface',
					color: 'text',
					borderColor: 'border',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'surface',
					transform: 'translateY(1px) scale(0.99)',
				},
			},
			danger: {
				bg: 'red.500',
				color: 'white',
				borderColor: 'red.500',
				boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
				_hover: {
					bg: 'red.400',
					boxShadow: '0 8px 20px rgba(239, 68, 68, 0.32)',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'red.500',
					filter: 'brightness(0.92)',
					transform: 'translateY(1px) scale(0.99)',
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
