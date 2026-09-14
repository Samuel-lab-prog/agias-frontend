// @vitest-environment happy-dom
import { type Project, projects } from '@Api/projects/endpoints';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, expect, it, vi } from 'vitest';

import { ProjectCombobox } from './ProjectCombobox';

vi.mock('@Api/projects/endpoints', () => ({ projects: { list: vi.fn() } }));
afterEach(cleanup);

function Field() {
	const [value, setValue] = useState('');
	return <ProjectCombobox value={value} onChange={setValue} scope='institution' />;
}

it('suggests projects in the selected scope and selects their code while preserving free text', async () => {
	vi.mocked(projects.list).mockResolvedValue({
		items: [{ id: 1, code: 'P0000001-2026', title: 'Pesquisa ambiental' } as Project],
		total: 1,
		page: 1,
		pageSize: 20,
	});
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
	fireEvent.change(input, { target: { value: 'ambiental' } });
	await screen.findByRole('option', { name: 'P0000001-2026 — Pesquisa ambiental' });
	expect(projects.list).toHaveBeenCalledWith({
		q: 'ambiental',
		scope: 'institution',
		ownership: 'all',
	});
	expect(input.value).toBe('ambiental');
	fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
	fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
	await waitFor(() => expect(input.value).toBe('P0000001-2026'));
	fireEvent.click(screen.getByRole('button', { name: 'Limpar busca de projeto' }));
	await waitFor(() => expect(input.value).toBe(''));
	vi.mocked(projects.list).mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 });
	fireEvent.change(input, { target: { value: 'Sem resultado' } });
	await screen.findByText('Nenhum projeto encontrado.');
	fireEvent.blur(input);
	expect(input.value).toBe('Sem resultado');
});
