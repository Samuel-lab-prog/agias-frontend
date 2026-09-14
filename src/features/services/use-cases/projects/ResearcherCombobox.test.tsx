// @vitest-environment happy-dom
import { projects } from '@Api/projects/endpoints';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, expect, it, vi } from 'vitest';

import { ResearcherCombobox } from './ResearcherCombobox';

vi.mock('@Api/projects/endpoints', () => ({ projects: { researchers: vi.fn() } }));
afterEach(cleanup);

function Field() {
	const [value, setValue] = useState('');
	return <ResearcherCombobox value={value} onChange={setValue} scope='campus' />;
}

it('keeps typed text, suggests names, selects with the keyboard and clears the field', async () => {
	vi.mocked(projects.researchers).mockResolvedValue([{ id: 1, name: 'Ana Silva' }]);
	render(
		<ChakraProvider value={defaultSystem}>
			<QueryClientProvider
				client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
			>
				<Field />
			</QueryClientProvider>
		</ChakraProvider>,
	);
	const input = screen.getByRole('combobox') as HTMLInputElement;
	fireEvent.focus(input);
	fireEvent.change(input, { target: { value: 'An' } });
	await screen.findByRole('option', { name: 'Ana Silva' });
	expect(input.value).toBe('An');
	expect(projects.researchers).toHaveBeenCalledWith('An', 'campus');
	fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
	fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
	await waitFor(() => expect(input.value).toBe('Ana Silva'));
	fireEvent.click(screen.getByRole('button', { name: 'Limpar pesquisador' }));
	await waitFor(() => expect(input.value).toBe(''));
	vi.mocked(projects.researchers).mockResolvedValue([]);
	fireEvent.change(input, { target: { value: 'Sem resultado' } });
	await screen.findByText('Nenhum pesquisador encontrado.');
	fireEvent.blur(input);
	expect(input.value).toBe('Sem resultado');
});
