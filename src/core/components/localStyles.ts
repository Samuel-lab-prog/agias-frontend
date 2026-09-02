export const componentColors = {
	light: {
		text: '#0f172a',
		textMuted: '#475569',
		surface: '#ffffff',
		background: '#f7f8fa',
		border: 'rgba(15, 23, 42, 0.08)',
		borderHover: 'rgba(37, 99, 235, 0.18)',
		accent: '#2563eb',
		accentStrong: '#1d4ed8',
		accentSoft: 'rgba(37, 99, 235, 0.08)',
		error: '#e11d48',
		errorSoft: 'rgba(225, 29, 72, 0.08)',
		warning: '#b45309',
		focusRing: 'rgba(37, 99, 235, 0.18)',
	},
	dark: {
		text: '#f8fafc',
		textMuted: '#cbd5e1',
		surface: '#0f172a',
		background: '#020617',
		border: 'rgba(148, 163, 184, 0.24)',
		borderHover: 'rgba(96, 165, 250, 0.32)',
		accent: '#60a5fa',
		accentStrong: '#93c5fd',
		accentSoft: 'rgba(96, 165, 250, 0.14)',
		error: '#fb7185',
		errorSoft: 'rgba(251, 113, 133, 0.12)',
		warning: '#fbbf24',
		focusRing: 'rgba(96, 165, 250, 0.28)',
	},
} as const;

export const componentRadii = {
	sm: '0.25rem',
	md: '0.375rem',
	lg: '0.5rem',
	xl: '0.75rem',
	full: '9999px',
} as const;

export const componentTypography = {
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
