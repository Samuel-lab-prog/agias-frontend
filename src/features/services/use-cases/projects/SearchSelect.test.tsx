// @vitest-environment happy-dom
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, expect, it } from 'vitest';

import { SearchSelect } from './SearchSelect';

afterEach(cleanup);

function UnitField() {
	const [value, setValue] = useState<number | null>(null);
	return (
		<SearchSelect
			label='Unidade'
			value={value}
			onChange={setValue}
			options={[
				{ id: 1, name: 'Administração', code: 'ADM' },
				{ id: 2, name: 'Biblioteca', code: 'BIB' },
			]}
		/>
	);
}

it('filters units from the first typed character, replaces the selection and clears it', async () => {
	render(
		<ChakraProvider value={defaultSystem}>
			<UnitField />
		</ChakraProvider>,
	);
	const input = screen.getByRole('combobox') as HTMLInputElement;
	fireEvent.focus(input);
	fireEvent.change(input, { target: { value: 'b' } });
	await screen.findByRole('option', { name: 'BIB — Biblioteca' });
	expect(screen.queryByRole('option', { name: 'ADM — Administração' })).toBeNull();
	fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
	fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
	await waitFor(() => expect(input.value).toBe('BIB — Biblioteca'));
	fireEvent.change(input, { target: { value: 'administracao' } });
	await screen.findByRole('option', { name: 'ADM — Administração' });
	expect(screen.queryByRole('option', { name: 'BIB — Biblioteca' })).toBeNull();
	fireEvent.click(screen.getByRole('option', { name: 'ADM — Administração' }));
	await waitFor(() => expect(input.value).toBe('ADM — Administração'));
	fireEvent.click(screen.getByRole('button', { name: 'Limpar Unidade' }));
	await waitFor(() => expect(input.value).toBe(''));
	fireEvent.change(input, { target: { value: 'inexistente' } });
	await screen.findByText('Nenhuma opção encontrada.');
	expect(screen.queryAllByRole('option')).toHaveLength(0);
});
