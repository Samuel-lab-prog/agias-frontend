import { createSystem, defaultConfig, defineConfig, defineTokens } from '@chakra-ui/react';

import { foundations } from './foundations';
import { buttonRecipe } from './recipes';
import { semanticTokens } from './semanticTokens';

const tokens = defineTokens({
	radii: Object.fromEntries(
		Object.entries(foundations.radii).map(([key, value]) => [key, { value }]),
	),
	durations: Object.fromEntries(
		Object.entries(foundations.durations).map(([key, value]) => [key, { value }]),
	),
	sizes: Object.fromEntries(
		Object.entries(foundations.sizes).map(([key, value]) => [key, { value }]),
	),
});

const config = defineConfig({
	globalCss: {
		html: { scrollBehavior: 'smooth', scrollbarGutter: 'stable' },
		body: { margin: 0, bg: 'bg.canvas', color: 'fg.default', minHeight: '100dvh' },
		'#root': { display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100dvh' },
		'::selection': { bg: 'action.primarySubtle', color: 'fg.default' },
	},
	theme: { tokens, semanticTokens, recipes: { appButton: buttonRecipe } },
});

export const system = createSystem(defaultConfig, config);
