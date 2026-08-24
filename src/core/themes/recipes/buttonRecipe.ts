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
			opacity: '0.55',
			cursor: 'not-allowed',
			boxShadow: 'none',
			transform: 'translateY(0)',
			filter: 'saturate(0.75)',
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
				borderColor: 'gray.950',
				background: 'linear-gradient(135deg, {colors.gray.950}, {colors.gray.700})',
				boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
				_hover: {
					background: 'linear-gradient(135deg, {colors.gray.900}, {colors.gray.600})',
					boxShadow: '0 8px 24px rgba(0, 0, 0, 0.24)',
					transform: 'translateY(-1px)',
				},
				_active: {
					background: 'linear-gradient(135deg, {colors.gray.950}, {colors.gray.800})',
					transform: 'translateY(1px) scale(0.99)',
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.26)',
				},
			},
			solidPurple: {
				bg: 'gray.900',
				color: 'white',
				borderColor: 'gray.900',
				boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
				_hover: {
					bg: 'gray.800',
					boxShadow: '0 8px 20px rgba(0, 0, 0, 0.26)',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'gray.950',
					transform: 'translateY(1px) scale(0.99)',
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
				},
			},
			solidPink: {
				bg: 'gray.700',
				color: 'white',
				borderColor: 'gray.700',
				boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
				_hover: {
					bg: 'gray.600',
					boxShadow: '0 8px 20px rgba(0, 0, 0, 0.26)',
					transform: 'translateY(-1px)',
				},
				_active: {
					bg: 'gray.800',
					transform: 'translateY(1px) scale(0.99)',
					boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
				},
			},
			outlinePurple: {
				bg: 'transparent',
				color: 'textMuted',
				borderColor: 'border',
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
				color: 'textMuted',
				borderColor: 'transparent',
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
