import { defineSemanticTokens } from '@chakra-ui/react';

import { foundations, semanticValues } from './foundations';

const adaptive = (light: string, dark: string) => ({ value: { base: light, _dark: dark } });

export const semanticTokens = defineSemanticTokens({
	colors: {
		bg: {
			canvas: adaptive(semanticValues.canvas.light, semanticValues.canvas.dark),
			surface: adaptive(semanticValues.surface.light, semanticValues.surface.dark),
			muted: adaptive(semanticValues.surfaceMuted.light, semanticValues.surfaceMuted.dark),
			interactive: adaptive(semanticValues.accentSoft.light, semanticValues.accentSoft.dark),
		},
		fg: {
			default: adaptive(semanticValues.text.light, semanticValues.text.dark),
			muted: adaptive(semanticValues.textMuted.light, semanticValues.textMuted.dark),
			inverted: { value: foundations.colors.white },
		},
		border: {
			default: adaptive(semanticValues.border.light, semanticValues.border.dark),
			surface: adaptive(semanticValues.surfaceBorder.light, semanticValues.surfaceBorder.dark),
			muted: adaptive(semanticValues.borderMuted.light, semanticValues.borderMuted.dark),
			interactive: adaptive(
				semanticValues.borderInteractive.light,
				semanticValues.borderInteractive.dark,
			),
		},
		action: {
			primary: adaptive(semanticValues.accent.light, semanticValues.accent.dark),
			primaryStrong: adaptive(semanticValues.accentStrong.light, semanticValues.accentStrong.dark),
			primarySubtle: adaptive(semanticValues.accentSoft.light, semanticValues.accentSoft.dark),
			destructive: adaptive(semanticValues.error.light, semanticValues.error.dark),
		},
		status: {
			error: adaptive(semanticValues.error.light, semanticValues.error.dark),
			errorSubtle: adaptive(semanticValues.errorSoft.light, semanticValues.errorSoft.dark),
			warning: adaptive(semanticValues.warning.light, semanticValues.warning.dark),
		},
		focus: { ring: adaptive(semanticValues.focus.light, semanticValues.focus.dark) },
	},
	shadows: {
		surface: {
			value: { base: '0 1px 3px rgba(15, 23, 42, 0.04)', _dark: '0 12px 30px rgba(0, 0, 0, 0.32)' },
		},
		surfaceStrong: {
			value: { base: '0 2px 6px rgba(15, 23, 42, 0.06)', _dark: '0 14px 34px rgba(0, 0, 0, 0.40)' },
		},
		floating: {
			value: { base: '0 8px 20px rgba(15, 23, 42, 0.16)', _dark: '0 8px 20px rgba(0, 0, 0, 0.34)' },
		},
	},
});

export const documentedColorTokens = [
	['bg.canvas', semanticValues.canvas, 'Fundo global da aplicação'],
	['bg.surface', semanticValues.surface, 'Cartões, menus e painéis'],
	['bg.muted', semanticValues.surfaceMuted, 'Áreas de baixa ênfase'],
	['fg.default', semanticValues.text, 'Texto e ícones principais'],
	['fg.muted', semanticValues.textMuted, 'Texto secundário e legendas'],
	['border.default', semanticValues.border, 'Bordas e divisores'],
	['border.surface', semanticValues.surfaceBorder, 'Contorno de cartões e painéis'],
	['border.interactive', semanticValues.borderInteractive, 'Hover e foco de controles'],
	['action.primary', semanticValues.accent, 'Ação principal e links'],
	['action.primarySubtle', semanticValues.accentSoft, 'Destaque de baixa ênfase'],
	['status.error', semanticValues.error, 'Erro e ação destrutiva'],
	['status.warning', semanticValues.warning, 'Avisos'],
	['focus.ring', semanticValues.focus, 'Foco por teclado'],
] as const;
