import { describe, expect, it } from 'vitest';

import { documentedColorTokens } from './semanticTokens';

describe('design system color documentation', () => {
	it('uses unique semantic names with light and dark values', () => {
		const names = documentedColorTokens.map(([name]) => name);
		expect(new Set(names).size).toBe(names.length);

		for (const [, values] of documentedColorTokens) {
			expect(values.light).toBeTruthy();
			expect(values.dark).toBeTruthy();
		}
	});
});
