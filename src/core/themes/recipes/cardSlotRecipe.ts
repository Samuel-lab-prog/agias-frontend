import { defineSlotRecipe } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/react/anatomy';

export const cardSlotRecipe = defineSlotRecipe({
	className: 'chakra-card',
	slots: cardAnatomy.keys(),
	base: {
		root: {
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			minWidth: '0',
			wordWrap: 'break-word',
			borderRadius: 'xl',
			textAlign: 'start',
			borderWidth: '1px',
			overflow: 'hidden',
			transition:
				'background-color 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease, transform 0.2s ease',
		},
		title: {
			textStyle: 'h4',
			fontWeight: '600',
		},
		description: {
			textStyle: 'small',
			color: 'textMuted',
		},
		header: {
			display: 'flex',
			flexDirection: 'column',
			gap: '1.5',
			paddingInline: 'var(--card-padding)',
			paddingTop: 'var(--card-padding)',
		},
		body: {
			paddingInline: 'var(--card-padding)',
			paddingTop: 'calc(var(--card-padding) * 0.5)',
			paddingBottom: 'calc(var(--card-padding) * 0.5)',
			flex: '1',
			display: 'flex',
			flexDirection: 'column',
		},
		footer: {
			display: 'flex',
			alignItems: 'center',
			gap: '2',
			paddingInline: 'var(--card-padding)',
			paddingBottom: 'var(--card-padding)',
		},
	},
	variants: {
		size: {
			sm: {
				root: { '--card-padding': 'spacing.4' },
				title: { textStyle: 'h5' },
			},
			md: {
				root: { '--card-padding': 'spacing.5' },
				title: { textStyle: 'h4' },
			},
			lg: {
				root: { '--card-padding': 'spacing.6' },
				title: { textStyle: 'h3' },
			},
		},
		variant: {
			surface: {
				root: {
					bg: 'rgba(255, 255, 255, 0.96)',
					borderColor: 'border',
					backdropFilter: 'blur(8px)',
					boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
				},
			},
			interactive: {
				root: {
					bg: 'rgba(255, 255, 255, 0.96)',
					borderColor: 'border',
					backdropFilter: 'blur(8px)',
					_hover: {
						borderColor: 'borderHover',
						bg: 'rgba(255, 255, 255, 1)',
						transform: 'translateY(-2px)',
						boxShadow: '0 12px 30px rgba(37, 99, 235, 0.08)',
					},
					_focusWithin: {
						borderColor: 'borderHover',
						bg: 'rgba(255, 255, 255, 1)',
						boxShadow: '0 12px 30px rgba(37, 99, 235, 0.1)',
					},
				},
			},
			elevated: {
				root: {
					bg: 'rgba(255, 255, 255, 0.98)',
					borderColor: 'border',
					backdropFilter: 'blur(10px)',
					boxShadow: '0 14px 34px rgba(15, 23, 42, 0.07)',
				},
			},
			subtle: {
				root: {
					bg: 'rgba(255, 255, 255, 0.9)',
					borderColor: 'border',
				},
			},
			danger: {
				root: {
					bg: 'rgba(248, 113, 113, 0.08)',
					borderColor: 'red.500',
					backdropFilter: 'blur(4px)',
				},
				title: {
					color: 'red.400',
				},
			},
		},
	},
	defaultVariants: {
		size: 'md',
		variant: 'surface',
	},
});
