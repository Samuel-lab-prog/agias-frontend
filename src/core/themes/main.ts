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
				DEFAULT: '{colors.white}',
				_dark: '{colors.slate.950}',
			},
		},

		border: {
			value: {
				DEFAULT: '{colors.slate.200}',
				_dark: '{colors.slate.800}',
			},
		},

		borderHover: {
			value: {
				DEFAULT: '{colors.slate.300}',
				_dark: '{colors.slate.500}',
			},
		},

		shadow: {
			value: {
				DEFAULT: '{colors.slate.200}',
				_dark: '{colors.slate.700}',
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
				base: '#1d4ed8',
				_dark: '{colors.slate.100}',
			},
		},

		accentStrong: {
			value: {
				base: '#172554',
				_dark: '{colors.slate.50}',
			},
		},

		accentSoft: {
			value: {
				base: '#dbeafe',
				_dark: '{colors.slate.800}',
			},
		},

		text: {
			value: {
				base: '#1f2a44',
				_dark: '{colors.slate.100}',
			},
		},

		textMuted: {
			value: {
				base: '#5f6b85',
				_dark: '{colors.slate.300}',
			},
		},

		error: {
			value: {
				base: '{colors.rose.600}',
				_dark: '{colors.rose.400}',
			},
		},

		focusRing: {
			value: {
				base: '#93c5fd',
				_dark: '{colors.slate.300}',
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
		backgroundImage:
			'linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,1))',
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
