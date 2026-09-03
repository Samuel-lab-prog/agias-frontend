import type { BoxProps } from '@chakra-ui/react';

const baseStyle: BoxProps = {
	px: { base: '1rem', md: '1.5rem' },
	py: { base: '1.25rem', md: '1.75rem' },
};

/** Shared, semantic surface patterns. No feature should recreate these styles. */
export const surfaceVariants = {
	panel: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border.default',
		borderRadius: 'xl',
		bg: 'bg.surface',
		backdropFilter: 'blur(8px)',
		boxShadow: 'surface',
	},
	soft: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border.muted',
		borderRadius: 'xl',
		bg: 'bg.muted',
		boxShadow: 'surface',
	},
	gradient: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border.interactive',
		borderRadius: 'xl',
		bg: 'linear-gradient(145deg, token(colors.bg.surface), token(colors.bg.canvas) 58%, token(colors.action.primarySubtle))',
		backdropFilter: 'blur(8px)',
		boxShadow: 'surface',
	},
	elevated: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border.default',
		borderRadius: 'xl',
		bg: 'bg.surface',
		backdropFilter: 'blur(10px)',
		boxShadow: 'surfaceStrong',
	},
	topBar: {
		...baseStyle,
		px: { base: '0.75rem', md: '1rem', xl: '1.5rem' },
		py: { base: '0.75rem', md: '1rem' },
		border: 0,
		borderRadius: 0,
		borderBottom: '1px solid',
		borderBottomColor: 'border.default',
		bg: 'bg.canvas',
		backdropFilter: 'blur(14px)',
		boxShadow: 'surface',
	},
	sidebar: {
		...baseStyle,
		px: { base: '0.75rem', md: '1rem' },
		py: '1rem',
		border: '1px solid',
		borderColor: 'border.default',
		borderRadius: 0,
		borderTop: 0,
		bg: 'bg.surface',
		boxShadow: 'surfaceStrong',
	},
} as const;
