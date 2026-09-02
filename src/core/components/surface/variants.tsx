import { type BoxProps } from '@chakra-ui/react';

import { componentColors, componentRadii } from '../localStyles';

const baseStyle: BoxProps = {
	px: { base: '1rem', md: '1.5rem' },
	py: { base: '1.25rem', md: '1.75rem' },
};

const light = {
	page: componentColors.light.background,
	card: componentColors.light.surface,
	cardMuted: componentColors.light.surface,
	border: componentColors.light.border,
	borderSoft: 'rgba(15, 23, 42, 0.06)',
	shadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
	shadowStrong: '0 2px 6px rgba(15, 23, 42, 0.06)',
} as const;

const dark = {
	page: componentColors.dark.background,
	card: componentColors.dark.surface,
	cardMuted: componentColors.dark.background,
	border: componentColors.dark.border,
	borderSoft: 'rgba(148, 163, 184, 0.16)',
	shadow: '0 12px 30px rgba(0, 0, 0, 0.32)',
	shadowStrong: '0 14px 34px rgba(0, 0, 0, 0.40)',
} as const;

/**
 * Shared surface variants for cards/panels and layout containers.
 */
export const surfaceVariants = {
	panel: {
		...baseStyle,
		border: '1px solid',
		borderColor: light.border,
		borderRadius: componentRadii.xl,
		bg: light.card,
		backdropFilter: 'blur(8px)',
		boxShadow: light.shadow,
		_dark: {
			bg: dark.card,
			borderColor: dark.border,
			boxShadow: dark.shadow,
		},
	},
	soft: {
		...baseStyle,
		border: '1px solid',
		borderColor: light.borderSoft,
		borderRadius: componentRadii.xl,
		bg: light.cardMuted,
		boxShadow: light.shadow,
		_dark: {
			bg: dark.cardMuted,
			borderColor: dark.borderSoft,
			boxShadow: dark.shadow,
		},
	},
	gradient: {
		...baseStyle,
		border: '1px solid',
		borderColor: componentColors.light.borderHover,
		borderRadius: componentRadii.xl,
		bg: `linear-gradient(145deg, ${light.card} 0%, ${light.page} 58%, ${componentColors.light.accentSoft} 100%)`,
		backdropFilter: 'blur(8px)',
		boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
		_dark: {
			bg: `linear-gradient(145deg, ${dark.card} 0%, ${dark.page} 58%, rgba(30, 64, 175, 0.28) 100%)`,
			borderColor: componentColors.dark.borderHover,
			boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28)',
		},
	},
	elevated: {
		...baseStyle,
		border: '1px solid',
		borderColor: light.border,
		borderRadius: componentRadii.xl,
		bg: light.card,
		backdropFilter: 'blur(10px)',
		boxShadow: light.shadowStrong,
		_dark: {
			bg: dark.card,
			borderColor: dark.border,
			boxShadow: dark.shadowStrong,
		},
	},
	topBar: {
		...baseStyle,
		px: { base: '0.75rem', md: '1rem', xl: '1.5rem' },
		py: { base: '0.75rem', md: '1rem' },
		border: '0',
		borderColor: componentColors.light.border,
		borderRadius: '0',
		borderBottom: '1px solid',
		borderBottomColor: componentColors.light.border,
		bg: light.page,
		backdropFilter: 'blur(14px)',
		boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
		_dark: {
			bg: dark.page,
			borderBottomColor: dark.border,
			boxShadow: '0 4px 18px rgba(0, 0, 0, 0.28)',
		},
	},
	sidebar: {
		...baseStyle,
		px: { base: '0.75rem', md: '1rem' },
		py: '1rem',
		border: '1px solid',
		borderColor: componentColors.light.border,
		borderRadius: '0',
		borderTop: 0,
		bg: 'white',
		boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
		_dark: {
			bg: dark.page,
			borderColor: dark.border,
			boxShadow: '0 10px 30px rgba(0, 0, 0, 0.32)',
		},
	},
} as const;
