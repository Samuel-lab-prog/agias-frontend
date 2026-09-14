import { expect, test, type Page } from '@playwright/test';
import type { CatalogEntry } from '../src/core/api/projects/catalogs';

// Browser fixtures exercise UI contracts only; no catalog seed is installed in the application.
const entries: CatalogEntry[] = [
	{
		id: 10,
		type: 'knowledgeArea',
		name: 'Área de teste',
		code: 'AT',
		kind: null,
		parentId: null,
		active: true,
		version: 1,
	},
	{
		id: 11,
		type: 'fundingAgency',
		name: 'Agência de teste',
		code: 'AG',
		kind: null,
		parentId: null,
		active: true,
		version: 1,
	},
	{
		id: 12,
		type: 'callName',
		name: 'Edital de teste',
		code: null,
		kind: 'research',
		parentId: 11,
		active: true,
		version: 1,
	},
	{
		id: 13,
		type: 'researchGroup',
		name: 'Grupo de teste',
		code: null,
		kind: 'research',
		parentId: null,
		active: true,
		version: 1,
	},
	{
		id: 14,
		type: 'researchLine',
		name: 'Linha de teste',
		code: null,
		kind: 'research',
		parentId: 13,
		active: true,
		version: 1,
	},
	{
		id: 15,
		type: 'nature',
		name: 'Categoria de teste',
		code: null,
		kind: null,
		parentId: null,
		active: true,
		version: 1,
	},
	{
		id: 16,
		type: 'researchType',
		name: 'Tipo de teste',
		code: null,
		kind: 'research',
		parentId: null,
		active: true,
		version: 1,
	},
	{
		id: 17,
		type: 'knowledgeArea',
		name: 'Área histórica',
		code: null,
		kind: null,
		parentId: null,
		active: false,
		version: 1,
	},
];
const project = {
	id: 7,
	title: 'Proposta de teste',
	objectives: 'Objetivos para o projeto de teste.',
	code: 'P-TEST',
	year: 2026,
	kind: 'research',
	origin: 'internal',
	status: 'draft',
	finalReportStatus: 'not_submitted',
	coordinatorId: 100,
	version: 1,
	coordinator: { id: 100, name: 'Responsável de teste' },
	department: null,
	startsAt: '2026-01-01T03:00:00Z',
	endsAt: '2026-12-31T03:00:00Z',
	_count: { participants: 0, reports: 0 },
	participants: [],
	reports: [],
	events: [],
};
async function setup(page: Page, role = 'staff') {
	await page.addInitScript(
		(role) =>
			localStorage.setItem(
				'auth-client',
				JSON.stringify({
					authClient: { id: 100, role, status: 'active' },
					unreadNotificationsCount: 0,
				}),
			),
		role,
	);
	await page.route('**/institution/context', (route) =>
		route.fulfill({
			json: {
				id: 100,
				role,
				name: 'Responsável de teste',
				campusId: 1,
				campus: {
					id: 1,
					name: 'Campus de teste',
					institution: { id: 1, name: 'Instituição de teste', acronym: 'TEST' },
				},
			},
		}),
	);
	await page.route('**/curriculum/academic-periods', (route) => route.fulfill({ json: [] }));
}
async function choose(page: Page, label: string, text: string) {
	const input = page.getByRole('combobox', { name: label, exact: true });
	await input.fill(text);
	await page.getByRole('option').filter({ hasText: text }).click();
}
test('managers create, edit and deactivate options from an initially empty catalog', async ({
	page,
}) => {
	await setup(page);
	let catalog: CatalogEntry[] = [];
	await page.route('**/projects/catalogs**', async (route) => {
		if (route.request().resourceType() === 'document') return route.continue();
		if (route.request().method() === 'POST') {
			catalog = [{ ...route.request().postDataJSON(), id: 91, version: 1 }];
			return route.fulfill({ json: catalog[0], status: 201 });
		}
		if (route.request().method() === 'PUT') {
			catalog = [{ ...route.request().postDataJSON(), id: 91, version: 2 }];
			return route.fulfill({ json: catalog[0] });
		}
		return route.fulfill({ json: catalog });
	});
	await page.goto('/projects/catalogs');
	await expect(page.getByText(/Este catálogo ainda não tem opções/)).toBeVisible();
	await page.getByRole('button', { name: 'Nova opção', exact: true }).click();
	await page.getByLabel('Nome da opção').fill('Classificação cadastrada no teste');
	await page.getByLabel('Sigla ou código').fill('CCT');
	await page.getByRole('button', { name: 'Salvar opção' }).click();
	await expect(
		page.getByRole('heading', { name: 'CCT — Classificação cadastrada no teste' }),
	).toBeVisible();
	await expect(page.getByText('Catálogo atualizado.')).toBeVisible();
	await page.getByRole('button', { name: 'Editar Classificação cadastrada no teste' }).click();
	await page.getByLabel('Disponibilidade').selectOption('inactive');
	await page.getByRole('button', { name: 'Salvar opção' }).click();
	await expect(page.getByText('Inativa', { exact: true })).toBeVisible();
	expect(catalog[0].active).toBe(false);
});

test('search applies text and selected IDs together, restores URL values and clears unsent drafts', async ({
	page,
}) => {
	await setup(page);
	const requests: URL[] = [];
	await page.route('**/projects/**', async (route) => {
		if (route.request().resourceType() === 'document') return route.continue();
		const url = new URL(route.request().url());
		if (url.pathname.endsWith('/catalogs')) return route.fulfill({ json: entries });
		if (url.pathname.endsWith('/departments')) return route.fulfill({ json: [] });
		requests.push(url);
		return route.fulfill({ json: { items: [], total: 0, page: 1, pageSize: 20 } });
	});
	await page.goto('/projects?view=search');
	await page.getByLabel('Buscar projeto', { exact: true }).fill('Rascunho ainda não enviado');
	await page.getByRole('button', { name: 'Limpar filtros' }).click();
	await expect(page.getByLabel('Buscar projeto', { exact: true })).toHaveValue('');
	await page.getByText('Filtros de pesquisa e financiamento', { exact: true }).click();
	await choose(page, 'Agência financiadora', 'Agência de teste');
	await choose(page, 'Área do conhecimento', 'Área histórica');
	await page.getByLabel('Buscar projeto', { exact: true }).fill('Projeto consultado');
	expect(requests).toHaveLength(0);
	await page.getByRole('button', { name: 'Buscar', exact: true }).click();
	await expect.poll(() => requests.length).toBe(1);
	expect(requests[0].searchParams.get('fundingAgencyId')).toBe('11');
	expect(requests[0].searchParams.get('knowledgeAreaId')).toBe('17');
	expect(requests[0].searchParams.get('q')).toBe('Projeto consultado');
	expect(requests[0].searchParams.has('fundingAgency')).toBe(false);
	await page.reload();
	await expect(
		page.getByRole('combobox', { name: 'Área do conhecimento', exact: true }),
	).toHaveValue('Área histórica (inativa)');
	await page.getByRole('button', { name: 'Limpar filtros' }).click();
	await expect(page).toHaveURL(/\/projects\?view=search$/);
	await expect(page.getByLabel('Buscar projeto', { exact: true })).toHaveValue('');
	await expect(page.getByRole('heading', { name: 'Pesquise para ver projetos' })).toBeVisible();
});

test('creation submits database IDs, selects linked parents and excludes inactive options', async ({
	page,
}) => {
	await setup(page, 'professor');
	let created: Record<string, unknown> | undefined;
	await page.route('**/projects/**', async (route) => {
		if (route.request().resourceType() === 'document') return route.continue();
		const url = new URL(route.request().url());
		if (url.pathname.endsWith('/catalogs')) return route.fulfill({ json: entries });
		if (url.pathname.endsWith('/departments'))
			return route.fulfill({ json: [{ id: 30, name: 'Unidade de teste', code: 'UT' }] });
		if (route.request().method() === 'POST') {
			created = route.request().postDataJSON();
			return route.fulfill({ json: { ...project, ...created }, status: 201 });
		}
		return route.fulfill({ json: { ...project, ...created } });
	});
	await page.goto('/projects/new');
	await page.getByRole('textbox', { name: 'Título', exact: true }).fill('Proposta de teste');
	await page.getByLabel('Objetivos').fill('Objetivos para validar o cadastro completo.');
	await page.getByRole('textbox', { name: 'Início', exact: true }).fill('2026-01-01');
	await page.getByLabel('Término').fill('2026-12-31');
	await choose(page, 'Unidade', 'Unidade de teste');
	await page.getByRole('combobox', { name: 'Área do conhecimento', exact: true }).fill('historica');
	await expect(page.getByRole('option', { name: /Área histórica/ })).toHaveCount(0);
	await choose(page, 'Área do conhecimento', 'Área de teste');
	await choose(page, 'Edital', 'Edital de teste');
	await expect(
		page.getByRole('combobox', { name: 'Agência financiadora', exact: true }),
	).toHaveValue('AG — Agência de teste');
	await page.getByRole('button', { name: 'Limpar Agência financiadora', exact: true }).click();
	await expect(page.getByRole('combobox', { name: 'Edital', exact: true })).toHaveValue('');
	await choose(page, 'Edital', 'Edital de teste');
	await choose(page, 'Linha de pesquisa', 'Linha de teste');
	await expect(page.getByRole('combobox', { name: 'Grupo de pesquisa', exact: true })).toHaveValue(
		'Grupo de teste',
	);
	await choose(page, 'Natureza do projeto', 'Categoria de teste');
	await choose(page, 'Tipo de pesquisa', 'Tipo de teste');
	await page.getByRole('button', { name: 'Salvar projeto' }).click();
	await expect(page).toHaveURL(/\/projects\/7$/);
	expect(created).toMatchObject({
		departmentId: 30,
		knowledgeAreaId: 10,
		fundingAgencyId: 11,
		callNameId: 12,
		researchGroupId: 13,
		researchLineId: 14,
		natureId: 15,
		researchTypeId: 16,
	});
	expect(created).not.toHaveProperty('fundingAgency');
});

test('catalog failures are retryable and mobile selection works with the keyboard', async ({
	page,
}, testInfo) => {
	await setup(page);
	let failed = true;
	await page.route('**/projects/**', async (route) => {
		if (route.request().resourceType() === 'document') return route.continue();
		if (new URL(route.request().url()).pathname.endsWith('/catalogs'))
			return failed
				? route.fulfill({ status: 500, json: { message: 'Catálogo indisponível' } })
				: route.fulfill({ json: entries });
		return route.fulfill({ json: [] });
	});
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/projects/new');
	await expect(
		page.getByRole('alert').getByText('Não foi possível carregar', { exact: true }),
	).toBeVisible();
	await expect(page.getByRole('button', { name: 'Salvar projeto' })).toBeDisabled();
	failed = false;
	await page.getByRole('button', { name: 'Tentar novamente' }).click();
	const input = page.getByRole('combobox', { name: 'Área do conhecimento', exact: true });
	await input.fill('area de teste');
	await input.press('ArrowDown');
	await input.press('Enter');
	await expect(input).toHaveValue('AT — Área de teste');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true,
	);
	await page.screenshot({
		path: testInfo.outputPath('project-classification-mobile.png'),
		fullPage: true,
	});
});

test('existing projects retain inactive values when another classification is edited', async ({
	page,
}) => {
	await setup(page, 'professor');
	let saved: Record<string, unknown> | undefined;
	await page.route('**/projects/**', async (route) => {
		if (route.request().resourceType() === 'document') return route.continue();
		const url = new URL(route.request().url());
		if (url.pathname.endsWith('/catalogs')) return route.fulfill({ json: entries });
		if (url.pathname.endsWith('/departments')) return route.fulfill({ json: [] });
		if (url.pathname.endsWith('/classification')) {
			saved = route.request().postDataJSON();
			return route.fulfill({ json: { id: project.id } });
		}
		return route.fulfill({
			json: {
				...project,
				knowledgeAreaId: 17,
				knowledgeArea: entries.find((entry) => entry.id === 17),
				...(saved
					? { natureId: 15, nature: entries.find((entry) => entry.id === 15), version: 2 }
					: {}),
			},
		});
	});
	await page.goto('/projects/7');
	await expect(
		page.getByText('Área do conhecimento: Área histórica (inativa)', { exact: true }),
	).toBeVisible();
	await page.getByRole('button', { name: 'Editar classificação', exact: true }).click();
	await expect(
		page.getByRole('combobox', { name: 'Área do conhecimento', exact: true }),
	).toHaveValue('Área histórica (inativa)');
	await choose(page, 'Natureza do projeto', 'Categoria de teste');
	await page.getByRole('button', { name: 'Salvar classificação' }).click();
	await expect(
		page.getByText('Natureza do projeto: Categoria de teste', { exact: true }),
	).toBeVisible();
	expect(saved).toMatchObject({
		knowledgeAreaId: 17,
		natureId: 15,
		version: 1,
		departmentId: null,
	});
	expect(saved).not.toHaveProperty('title');
});
