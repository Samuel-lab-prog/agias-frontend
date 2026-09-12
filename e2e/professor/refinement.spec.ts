import { expect, test } from '@playwright/test';
import { setupProfessor } from './fixtures';

test.use({ timezoneId: 'America/Sao_Paulo' });

test('dashboard, search, pagination and class navigation', async ({ page }) => {
	await setupProfessor(page);
	await page.goto('/professor');
	await expect(page.getByRole('heading', { name: 'Olá, Helena.' })).toBeVisible();
	await page
		.getByRole('link', { name: 'Minhas turmas Planeje aulas e acompanhe os alunos.' })
		.click();
	await page.getByRole('button', { name: 'Próxima', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'Engenharia de software' })).toBeVisible();
	await page.getByRole('textbox', { name: 'Buscar turmas' }).fill('Programação');
	await expect(page.getByRole('heading', { name: 'Programação web' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Anterior', exact: true })).toBeDisabled();
	await page.getByRole('link', { name: 'Abrir turma Programação web' }).click();
	await expect(page.getByRole('heading', { name: 'Sobre a turma' })).toBeVisible();
	await expect(page.getByText('Noturno', { exact: true })).toBeVisible();
});

test('plan save failure preserves edits and publishing validates the syllabus', async ({
	page,
}) => {
	const writes = await setupProfessor(page);
	await page.goto('/professor/classes/11?tab=plan');
	await page.getByRole('textbox', { name: 'Ementa', exact: true }).fill('');
	await page.getByRole('combobox', { name: 'Situação do plano' }).selectOption('published');
	await page.getByRole('button', { name: 'Salvar plano' }).click();
	await expect(page.getByRole('alert')).toContainText('Preencha a ementa');
	await page
		.getByRole('textbox', { name: 'Ementa', exact: true })
		.fill('Ementa revisada para a disciplina.');
	await page.route('**/teaching/classes/11/plan', (route) =>
		route.fulfill({ status: 500, json: { message: 'Falha temporária ao salvar.' } }),
	);
	await page.getByRole('button', { name: 'Salvar plano' }).click();
	await expect(page.getByRole('alert')).toContainText('Falha temporária');
	await expect(page.getByRole('textbox', { name: 'Ementa', exact: true })).toHaveValue(
		'Ementa revisada para a disciplina.',
	);
	await page.unroute('**/teaching/classes/11/plan');
	await page.getByRole('button', { name: 'Salvar plano' }).click();
	await expect(page.getByRole('status')).toContainText('Plano de ensino salvo');
	expect(writes.at(-1)?.body).toMatchObject({
		syllabus: 'Ementa revisada para a disciplina.',
		status: 'published',
		methodology: 'Aulas práticas e projetos colaborativos.',
	});
});

test('lesson and assessment forms send valid local dates and prevent invalid intervals', async ({
	page,
}) => {
	const writes = await setupProfessor(page);
	await page.goto('/professor/classes/11?tab=lessons');
	await page.getByRole('textbox', { name: 'Tema da aula' }).fill('Nova aula de testes');
	await page.getByLabel('Início da aula').fill('2026-09-18T18:00');
	await page.getByLabel('Término da aula').fill('2026-09-18T17:00');
	await page.getByRole('button', { name: 'Registrar aula' }).click();
	await expect(page.getByRole('alert')).toContainText('O término deve ser posterior');
	expect(writes).toHaveLength(0);
	await page.getByLabel('Término da aula').fill('2026-09-18T20:00');
	await page.getByRole('button', { name: 'Registrar aula' }).click();
	await expect(page.getByText('Aula registrada. Sua agenda foi atualizada.')).toBeVisible();
	expect(writes[0].body).toMatchObject({
		startsAt: '2026-09-18T21:00:00.000Z',
		endsAt: '2026-09-18T23:00:00.000Z',
	});
	await page
		.getByRole('navigation', { name: 'Seções da turma' })
		.getByRole('link', { name: 'Atividades', exact: true })
		.click();
	await page.getByRole('textbox', { name: 'Título', exact: true }).fill('Avaliação de interfaces');
	await page.getByRole('combobox', { name: 'Tipo', exact: true }).selectOption('assessment');
	await page.getByLabel('Data de aplicação').fill('2026-09-21T18:00');
	await page.getByRole('button', { name: 'Criar avaliação' }).click();
	await expect(
		page.getByText('Proposta criada e adicionada às atividades da turma.'),
	).toBeVisible();
	expect(writes.at(-1)?.body).toMatchObject({
		kind: 'assessment',
		appliesAt: '2026-09-21T21:00:00.000Z',
		maxGrade: 10,
	});
});

test('calendar ranges, material context and roster avoid misleading submission states', async ({
	page,
}) => {
	await setupProfessor(page);
	await page.goto('/professor/calendar');
	await expect(page.getByText('18:30 – 20:10').first()).toBeVisible();
	await expect(page.getByText('Cancelada', { exact: true })).toBeVisible();
	const request = page.waitForRequest(
		(req) =>
			req.url().includes('/teaching/lessons?') &&
			new URL(req.url()).searchParams.get('from') === '2026-10-01T03:00:00.000Z',
	);
	await page.getByRole('button', { name: 'Próximo mês' }).click();
	await request;
	await expect(page.getByText('Nenhuma aula neste mês')).toBeVisible();
	await page.getByRole('button', { name: 'Hoje', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'setembro de 2026' })).toBeVisible();
	await page.goto('/professor/materials');
	await expect(page.getByText('Programação web', { exact: true })).toBeVisible();
	await expect(
		page.getByRole('link', { name: 'Abrir Guia de componentes em nova aba' }),
	).toHaveAttribute('href', 'https://example.com/componentes');
	await page.goto('/professor/classes/11?tab=roster');
	await expect(page.getByText('Ana Souza', { exact: true })).toBeVisible();
	await expect(page.getByText('Sem entrega', { exact: true })).toHaveCount(0);
	await page.getByRole('textbox', { name: 'Buscar alunos' }).fill('Pedro');
	await expect(page.getByText('Ana Souza', { exact: true })).toHaveCount(0);
});

test('read errors have retry and empty search has recovery', async ({ page }) => {
	await setupProfessor(page);
	await page.route('**/teaching/overview', (route) =>
		route.fulfill({ status: 500, json: { message: 'Perfil temporariamente indisponível.' } }),
	);
	await page.goto('/professor/profile');
	await expect(page.getByRole('alert')).toContainText('Perfil temporariamente indisponível.');
	await page.unroute('**/teaching/overview');
	await page.getByRole('button', { name: 'Tentar novamente' }).click();
	await expect(page.getByRole('heading', { name: 'Helena Duarte' })).toBeVisible();
	await page.goto('/professor/activities');
	await page.getByRole('textbox', { name: 'Buscar atividades' }).fill('inexistente');
	await expect(page.getByText('Nenhuma atividade encontrada')).toBeVisible();
	await page.getByRole('button', { name: 'Limpar busca' }).click();
	await expect(
		page.getByRole('heading', { name: 'Projeto: uma biblioteca de componentes' }),
	).toBeVisible();
});

test('all pages fit mobile and desktop in both themes', async ({ page }, testInfo) => {
	await setupProfessor(page);
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	const routes = [
		'/professor',
		'/professor/classes',
		'/professor/classes/11',
		'/professor/classes/11?tab=plan',
		'/professor/classes/11?tab=lessons',
		'/professor/classes/11?tab=activities',
		'/professor/classes/11?tab=roster',
		'/professor/activities',
		'/professor/calendar',
		'/professor/materials',
		'/professor/profile',
	];
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 960 });
		for (const [index, route] of routes.entries()) {
			await page.goto(route);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await expect(page.getByLabel('Carregando conteúdo')).toHaveCount(0);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
			).toBe(true);
			await page.screenshot({ path: testInfo.outputPath(`${width}-${index}.png`), fullPage: true });
		}
	}
	await page.goto('/professor');
	await page.getByRole('checkbox', { name: 'Tema escuro' }).focus();
	await page.keyboard.press('Space');
	await expect(page.locator('html')).toHaveClass(/dark/);
	await page.screenshot({ path: testInfo.outputPath('desktop-dark.png'), fullPage: true });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.getByRole('button', { name: 'Abrir navegação' }).click();
	await page.locator('#mobile-navigation').getByRole('link', { name: 'Calendário' }).click();
	await expect(page).toHaveURL(/\/professor\/calendar/);
	await expect(page.getByRole('button', { name: 'Abrir navegação' })).toBeVisible();
	await page.screenshot({ path: testInfo.outputPath('mobile-dark.png'), fullPage: true });
	expect(errors).toEqual([]);
});
