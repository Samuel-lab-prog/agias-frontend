import { type BoxProps } from '@chakra-ui/react';

const baseStyle: BoxProps = {
	px: { base: 4, md: 6 },
	py: { base: 5, md: 7 },
};

/**
 * Shared surface variants for cards/panels and layout containers.
 */
export const surfaceVariants = {
	panel: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border',
		borderRadius: 'xl',
		bg: 'surface',
		backdropFilter: 'blur(8px)',
		boxShadow: '0 10px 30px {colors.surfaceShadow}',
	},
	soft: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border',
		borderRadius: 'xl',
		bg: 'background',
		boxShadow: '0 8px 24px {colors.surfaceShadowSoft}',
	},
	gradient: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'accentSoft',
		borderRadius: '2xl',
		bg: 'linear-gradient(145deg, {colors.surface} 0%, {colors.background} 58%, {colors.accentSoft} 100%)',
		backdropFilter: 'blur(8px)',
		boxShadow: '0 12px 30px {colors.surfaceShadowSoft}',
	},
	elevated: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border',
		borderRadius: '2xl',
		bg: 'background',
		backdropFilter: 'blur(10px)',
		boxShadow: '0 14px 34px {colors.surfaceShadow}',
	},
	topBar: {
		...baseStyle,
		px: { base: 3, md: 4, xl: 6 },
		py: { base: 3, md: 4 },
		border: '0',
		borderColor: 'border',
		borderRadius: 0,
		borderBottom: '1px solid',
		borderBottomColor: 'border',
		bg: 'background',
		backdropFilter: 'blur(14px)',
		boxShadow: '0 4px 18px {colors.surfaceShadowSoft}',
	},
	sidebar: {
		...baseStyle,
		px: { base: 3, md: 4 },
		py: 4,
		border: '1px solid',
		borderColor: 'border',
		borderRadius: 0,
		borderTop: 0,
		bg: 'background',
		boxShadow: '0 10px 30px {colors.surfaceShadow}',
	},
} as const;
