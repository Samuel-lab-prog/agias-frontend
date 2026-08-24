import { defineRecipe } from '@chakra-ui/react';

export const linkRecipe = defineRecipe({
	base: {
		textDecoration: 'none',
		cursor: 'pointer',
		borderRadius: 'sm',
		outline: 'none',
		transition:
			'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
		_focusVisible: {
			boxShadow: '0 0 0 2px {colors.background}, 0 0 0 4px {colors.gray.950}',
		},
	},
	variants: {
		size: {
			sm: {
				textStyle: 'small',
			},
			md: {
				textStyle: 'body',
			},
		},
		variant: {
			inline: {
				color: 'textMuted',
				textUnderlineOffset: '3px',
				_hover: {
					color: 'text',
					textDecoration: 'underline',
				},
				_active: {
					color: 'text',
				},
			},
			nav: {
				color: 'textMuted',
				w: 'full',
				px: '3',
				py: '2',
				display: 'flex',
				justifyContent: 'flex-start',
				borderRadius: 'md',
				_hover: {
					bg: 'rgba(0, 0, 0, 0.04)',
					color: 'text',
					transform: 'translateX(2px)',
				},
				_currentPage: {
					fontWeight: '700',
					color: 'text',
					bg: 'rgba(0, 0, 0, 0.06)',
					borderColor: 'border',
				},
			},
			navIcon: {
				color: 'textMuted',
				flex: '1',
				minW: '58px',
				textAlign: 'center',
				px: '1',
				py: '2',
				borderRadius: 'md',
				_hover: {
					bg: 'rgba(0, 0, 0, 0.04)',
					color: 'text',
					transform: 'translateY(-1px)',
				},
				_currentPage: {
					fontWeight: '700',
					color: 'text',
					bg: 'rgba(0, 0, 0, 0.06)',
				},
			},
			muted: {
				color: 'textMuted',
				opacity: '0.9',
				_hover: {
					color: 'text',
					opacity: '1',
				},
				_active: {
					color: 'text',
				},
			},
		},
	},
	defaultVariants: {
		size: 'sm',
		variant: 'inline',
	},
});
