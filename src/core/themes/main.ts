import {
	createSystem,
	defaultConfig,
	defineConfig,
	defineGlobalStyles,
	defineSemanticTokens,
	defineTokens,
} from '@chakra-ui/react';

import { animationStyles } from './animationStyles';
import { layerStyles } from './layerStyles';
import { recipes, slotRecipes } from './recipes';
import { textStyles } from './textStyles';

const tokens = defineTokens({
	colors: {
		white: { value: '#ffffff' },
		black: { value: '#000000' },
		slate: {
			50: { value: '#f8fafc' },
			100: { value: '#f1f5f9' },
			200: { value: '#e2e8f0' },
			300: { value: '#cbd5e1' },
			400: { value: '#94a3b8' },
			500: { value: '#64748b' },
			600: { value: '#475569' },
			700: { value: '#334155' },
			800: { value: '#1e293b' },
			900: { value: '#0f172a' },
			950: { value: '#020617' },
		},
		rose: {
			50: { value: '#fff1f2' },
			100: { value: '#ffe4e6' },
			200: { value: '#fecdd3' },
			300: { value: '#fda4af' },
			400: { value: '#fb7185' },
			500: { value: '#f43f5e' },
			600: { value: '#e11d48' },
			700: { value: '#be123c' },
			800: { value: '#9f1239' },
			900: { value: '#881337' },
			950: { value: '#4c0519' },
		},
		blue: {
			50: { value: '#eff6ff' },
			100: { value: '#dbeafe' },
			200: { value: '#bfdbfe' },
			300: { value: '#93c5fd' },
			400: { value: '#60a5fa' },
			500: { value: '#3b82f6' },
			600: { value: '#2563eb' },
			700: { value: '#1d4ed8' },
			800: { value: '#1e40af' },
			900: { value: '#1e3a8a' },
			950: { value: '#172554' },
		},
		amber: {
			50: { value: '#fffbeb' },
			100: { value: '#fef3c7' },
			200: { value: '#fde68a' },
			300: { value: '#fcd34d' },
			400: { value: '#fbbf24' },
			500: { value: '#f59e0b' },
			600: { value: '#d97706' },
			700: { value: '#b45309' },
			800: { value: '#92400e' },
			900: { value: '#78350f' },
			950: { value: '#451a03' },
		},
		neutral: {
			50: { value: '#fcfcfd' },
			100: { value: '#f7f8fa' },
			200: { value: '#eceff3' },
			800: { value: '#1f2933' },
			900: { value: '#111827' },
		},
	},
});

const semanticTokens = defineSemanticTokens({
	colors: {
		background: {
			value: {
				DEFAULT: '{colors.neutral.100}',
				_dark: '{colors.slate.950}',
			},
		},

		border: {
			value: {
				DEFAULT: 'rgba(15, 23, 42, 0.03)',
				_dark: '{colors.slate.800}',
			},
		},

		borderHover: {
			value: {
				DEFAULT: 'rgba(15, 23, 42, 0.05)',
				_dark: '{colors.slate.500}',
			},
		},

		shadow: {
			value: {
				DEFAULT: '{colors.slate.200}',
				_dark: '{colors.slate.700}',
			},
		},

		surfaceShadow: {
			value: {
				DEFAULT: 'rgba(15, 23, 42, 0.06)',
				_dark: 'rgba(0, 0, 0, 0.38)',
			},
		},

		surfaceShadowSoft: {
			value: {
				DEFAULT: 'rgba(15, 23, 42, 0.05)',
				_dark: 'rgba(0, 0, 0, 0.28)',
			},
		},

		surfaceShadowStrong: {
			value: {
				DEFAULT: 'rgba(15, 23, 42, 0.08)',
				_dark: 'rgba(0, 0, 0, 0.42)',
			},
		},

		surface: {
			value: {
				base: '{colors.white}',
				_dark: '{colors.slate.900}',
			},
		},

		accent: {
			value: {
				base: '{colors.blue.700}',
				_dark: '{colors.blue.300}',
			},
		},

		accentStrong: {
			value: {
				base: '{colors.blue.950}',
				_dark: '{colors.blue.100}',
			},
		},

		accentSoft: {
			value: {
				base: 'rgba(37, 99, 235, 0.06)',
				_dark: '{colors.blue.900}',
			},
		},

		text: {
			value: {
				base: '#182235',
				_dark: '{colors.slate.100}',
			},
		},

		textMuted: {
			value: {
				base: '#526074',
				_dark: '{colors.slate.300}',
			},
		},

		error: {
			value: {
				base: '{colors.rose.600}',
				_dark: '{colors.rose.400}',
			},
		},

		warning: {
			value: {
				base: '{colors.amber.600}',
				_dark: '{colors.amber.400}',
			},
		},

		focusRing: {
			value: {
				base: '{colors.blue.400}',
				_dark: '{colors.blue.300}',
			},
		},
	},
});

const globalCss = defineGlobalStyles({
	html: {
		scrollBehavior: 'smooth',
		scrollbarGutter: 'stable',
		fontSize: '18px',
	},

	'h1, h2, h3, h4, h5, h6': {
		marginBottom: { base: '0.15em', md: '0.15em', lg: '0.25em', xl: '0.25', '2xl': '0.25em' },
	},

	body: {
		background: '{colors.background}',
		color: '{colors.text}',
		display: 'flex',
		margin: '0',
		boxSizing: 'border-box',
		overflowX: 'hidden',
		overflowY: 'auto',
		minHeight: '100dvh',
	},

	'#root': {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		width: '100%',
		minHeight: '100dvh',
		height: 'auto',
	},

	'.dark body': {
		backgroundImage: 'linear-gradient(180deg, rgba(2,6,23,0.98), rgba(15,23,42,1))',
	},
});

const config = defineConfig({
	globalCss,
	theme: {
		tokens,
		semanticTokens,
		layerStyles,
		textStyles,
		animationStyles,
		recipes,
		slotRecipes,
	},
});

export const system = createSystem(defaultConfig, config);
