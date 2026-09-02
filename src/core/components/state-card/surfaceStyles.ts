import { componentColors, componentRadii } from '../localStyles';

export const stateCardSurfaceStyles = {
	position: 'relative',
	overflow: 'hidden',
	borderRadius: componentRadii.xl,
	border: '1px solid',
	borderColor: 'rgba(15, 23, 42, 0.06)',
	bg: componentColors.light.surface,
	p: { base: '1.25rem', md: '1.5rem' },
	shadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
	_dark: {
		borderColor: 'rgba(148, 163, 184, 0.16)',
		bg: componentColors.dark.background,
		shadow: '0 12px 30px rgba(0, 0, 0, 0.32)',
	},
	_before: {
		content: '""',
		position: 'absolute',
		inset: '-40px auto auto -30px',
		w: '180px',
		h: '180px',
		borderRadius: componentRadii.full,
		bg: componentColors.light.accentSoft,
		filter: 'blur(70px)',
		opacity: 0.9,
	},
	_after: {
		content: '""',
		position: 'absolute',
		inset: 'auto -50px -60px auto',
		w: '200px',
		h: '200px',
		borderRadius: componentRadii.full,
		bg: 'rgba(147, 197, 253, 0.35)',
		filter: 'blur(75px)',
		opacity: 0.55,
	},
} as const;
