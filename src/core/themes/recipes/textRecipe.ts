import { defineRecipe } from '@chakra-ui/react';

export const textRecipe = defineRecipe({
	base: {
		textStyle: 'body',
		color: 'text',
		overflowWrap: 'break-word',
	},
	variants: {
		variant: {
			body: {
				textStyle: 'body',
				color: 'text',
			},
			muted: {
				textStyle: 'small',
				color: 'textMuted',
			},
			caption: {
				textStyle: 'smaller',
				color: 'textMuted',
				opacity: '0.9',
			},
			emphasis: {
				textStyle: 'small',
				color: 'accent',
			},
			lead: {
				textStyle: 'lead',
				color: 'textMuted',
			},
			error: {
				textStyle: 'small',
				color: 'error',
			},
		},
	},
	defaultVariants: {
		variant: 'body',
	},
});
