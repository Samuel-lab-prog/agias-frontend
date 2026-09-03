import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
	base: {
		fontWeight: 'semibold',
		borderRadius: 'md',
		transitionDuration: 'normal',
		_focusVisible: { outline: '3px solid', outlineColor: 'focus.ring', outlineOffset: '2px' },
	},
	variants: {
		visual: {
			primary: {
				bg: 'action.primary',
				color: 'fg.inverted',
				_hover: { bg: 'action.primaryStrong' },
			},
			secondary: {
				bg: 'transparent',
				color: 'fg.default',
				border: '1px solid',
				borderColor: 'border.default',
				_hover: { bg: 'bg.muted', borderColor: 'border.interactive' },
			},
			subtle: { bg: 'transparent', color: 'fg.default', _hover: { bg: 'bg.muted' } },
			destructive: {
				bg: 'action.destructive',
				color: 'fg.inverted',
				_hover: { filter: 'brightness(1.08)' },
			},
		},
	},
});
