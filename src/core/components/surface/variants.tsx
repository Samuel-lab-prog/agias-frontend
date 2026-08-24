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
		boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
	},
	soft: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border',
		borderRadius: 'xl',
		bg: 'rgba(255, 255, 255, 0.95)',
		boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
	},
	gradient: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'rgba(99, 102, 241, 0.18)',
		borderRadius: '2xl',
		bg: 'linear-gradient(145deg, rgba(226, 232, 240, 0.95) 0%, rgba(255, 255, 255, 0.98) 58%, rgba(219, 234, 254, 0.75) 100%)',
		backdropFilter: 'blur(8px)',
		boxShadow: '0 12px 30px rgba(59, 130, 246, 0.08)',
	},
	elevated: {
		...baseStyle,
		border: '1px solid',
		borderColor: 'border',
		borderRadius: '2xl',
		bg: 'rgba(255, 255, 255, 0.98)',
		backdropFilter: 'blur(10px)',
		boxShadow: '0 14px 34px rgba(15, 23, 42, 0.07)',
	},
} as const;
