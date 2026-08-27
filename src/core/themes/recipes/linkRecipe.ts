import { defineRecipe } from '@chakra-ui/react';

import { hoverNav, hoverSubtle } from '../../utils/interaction';

const navMotion = hoverNav();
const subtleMotion = hoverSubtle();

export const linkRecipe = defineRecipe({
	base: {
		textDecoration: 'none',
		cursor: 'pointer',
		borderRadius: 'sm',
		outline: 'none',
		transition: subtleMotion.transition,
		_focusVisible: subtleMotion.focusVisible,
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
					...subtleMotion.hover,
					color: 'text',
					textDecoration: 'underline',
				},
				_active: {
					...subtleMotion.active,
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
					...navMotion.hover,
					bg: 'rgba(0, 0, 0, 0.04)',
					color: 'text',
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
					...subtleMotion.hover,
					bg: 'rgba(0, 0, 0, 0.04)',
					color: 'text',
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
					...subtleMotion.hover,
					color: 'text',
					opacity: '1',
				},
				_active: {
					...subtleMotion.active,
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
