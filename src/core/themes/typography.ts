export const typographyStyles = {
	xs: {
		fontSize: '0.75rem',
		lineHeight: '1rem',
	},
	smaller: {
		fontSize: '0.8125rem',
		lineHeight: '1.25rem',
	},
	small: {
		fontSize: '0.875rem',
		lineHeight: '1.4rem',
	},
	body: {
		fontSize: '1rem',
		lineHeight: '1.7rem',
	},
	lead: {
		fontSize: '1.125rem',
		lineHeight: '1.85rem',
	},
	code: {
		fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
		fontSize: '0.875rem',
		lineHeight: '1.5rem',
	},
	h1: {
		fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
		lineHeight: '1.02',
		fontWeight: '800',
	},
	h2: {
		fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
		lineHeight: '1.08',
		fontWeight: '800',
	},
	h3: {
		fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)',
		lineHeight: '1.14',
		fontWeight: '700',
	},
	h4: {
		fontSize: 'clamp(1.25rem, 2vw, 1.65rem)',
		lineHeight: '1.2',
		fontWeight: '700',
	},
	h5: {
		fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
		lineHeight: '1.25',
		fontWeight: '700',
	},
	h6: {
		fontSize: '1rem',
		lineHeight: '1.3',
		fontWeight: '700',
	},
	label: {
		fontSize: '0.75rem',
		lineHeight: '1rem',
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
	},
} as const;
