import { test, expect, type Page } from '@playwright/test';
import {
	academicEvents,
	academicPeriods,
	fixtureNow,
	studentScenario,
} from '../src/features/student/fixtures/scenarios';

async function setup(page: Page, scenario: Parameters<typeof studentScenario>[0] = 'complete') {
	await page.route('**/communications/announcements/me', (route) => route.fulfill({ json: [] }));
	await page.clock.setFixedTime(new Date(fixtureNow));
	await page.addInitScript(() =>
		localStorage.setItem(
			'auth-client',
			JSON.stringify({
				authClient: { id: 1, role: 'student', status: 'active' },
				unreadNotificationsCount: 0,
			}),
		),
	);
	await page.route('**/academic/students/dashboard/me', (route) =>
		route.fulfill({ json: studentScenario(scenario) }),
	);
	await page.route('**/curriculum/academic-periods', (route) =>
		route.fulfill({ json: academicPeriods }),
	);
	await page.route('**/academic-calendar/students/me/events?*', (route) =>
		route.fulfill({
			json: scenario === 'empty' || scenario === 'exceptions' ? [] : academicEvents,
		}),
	);
}

test('period selection, class navigation, planning and read-only assessments', async ({ page }) => {
	await setup(page, 'semester');
	await page.goto('/student/classes');
	await page.getByRole('combobox', { name: 'Filtrar por período letivo' }).selectOption('2026.1');
	await expect(page.getByRole('heading', { name: 'Algoritmos', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Programação web', exact: true })).toHaveCount(0);
	await page.getByRole('combobox', { name: 'Filtrar por período letivo' }).selectOption('2026.2');
	await page.getByRole('link', { name: 'Ver detalhes de Programação web' }).click();
	await expect(page).toHaveURL(/\/student\/classes\/11\?period=2026.2/);
	await expect(page.getByRole('heading', { name: 'Programação web', level: 1 })).toBeVisible();
	await expect(page.getByText('Helena Duarte', { exact: true })).toBeVisible();
	await page.getByRole('link', { name: 'Planejamento', exact: true }).click();
	await expect(page.getByText('Progresso do planejamento: 50%', { exact: false })).toBeVisible();
	await expect(page.getByText('Planejado', { exact: true })).toBeVisible();
	await page.getByRole('link', { name: 'Atividades', exact: true }).last().click();
	await expect(page.getByText('Atrasada', { exact: true })).toBeVisible();
	await page.getByRole('link', { name: 'Avaliações', exact: true }).click();
	await expect(page.getByText('Nota não publicada', { exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: /salvar|editar|criar|excluir/i })).toHaveCount(0);
	await page.getByRole('link', { name: 'Ver agenda', exact: true }).click();
	await expect(page.getByRole('combobox', { name: 'Filtrar por período letivo' })).toHaveValue(
		'2026.2',
	);
});

test('calendar filters, cancelled and replacement lessons, local deadlines and multi-day events', async ({
	page,
}) => {
	await setup(page);
	await page.goto('/student/schedule');
	await expect(page.getByRole('heading', { name: 'setembro de 2026' })).toBeVisible();
	await page.getByRole('button', { name: '14 de setembro de 2026: 1 eventos' }).click();
	await expect(page.getByText('Cancelada', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: '19 de setembro de 2026: 1 eventos' }).click();
	await expect(page.getByText('Reposição', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Atividades', exact: true }).click();
	await page.getByRole('button', { name: '08 de setembro de 2026: 1 eventos' }).click();
	await expect(
		page.getByRole('link', { name: 'Exercícios de fixação', exact: true }),
	).toBeVisible();
	await page.getByRole('button', { name: 'Avaliações', exact: true }).click();
	await expect(page.getByRole('link', { name: 'Avaliação parcial' })).toBeVisible();
	await page.getByRole('button', { name: 'Eventos', exact: true }).click();
	await page.getByRole('button', { name: 'Próximo período' }).click();
	await page.getByRole('button', { name: '21 de outubro de 2026: 1 eventos' }).click();
	await expect(page.getByText('Semana acadêmica', { exact: true }).last()).toBeVisible();
	await page.getByRole('button', { name: 'Hoje', exact: true }).click();
	await page.getByRole('button', { name: 'Aulas', exact: true }).click();
	await page.getByRole('combobox', { name: 'Filtrar por disciplina' }).selectOption('12');
	await expect(page.getByRole('link', { name: 'Banco de dados', exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Programação web', exact: true })).toHaveCount(0);
});

test('empty and incomplete states and invalid class isolation', async ({ page }) => {
	await setup(page, 'empty');
	await page.goto('/student/schedule');
	await expect(page.getByText('Nenhum evento neste período', { exact: true })).toBeVisible();
	await page.goto('/student/classes/999');
	await expect(page.getByText('Disciplina não encontrada', { exact: true })).toBeVisible();
	await page.route('**/academic/students/dashboard/me', (route) =>
		route.fulfill({ json: studentScenario('exceptions') }),
	);
	await page.goto('/student/classes/11');
	await expect(page.getByText('Professor ainda não informado', { exact: true })).toBeVisible();
	await expect(page.getByText('Planejamento ainda não publicado.', { exact: true })).toBeVisible();
	await expect(page.getByText('Realização não informada', { exact: true })).toBeVisible();
	await expect(page.getByText('Nota não publicada', { exact: true })).toBeVisible();
});

test('calendar error retry refetches the failing event request', async ({ page }) => {
	await setup(page);
	let failing = true;
	await page.route('**/academic-calendar/students/me/events?*', (route) =>
		route.fulfill(
			failing ? { status: 500, json: { message: 'Temporary failure' } } : { json: academicEvents },
		),
	);
	await page.goto('/student/schedule');
	await expect(page.getByText('Não foi possível carregar a agenda', { exact: true })).toBeVisible({
		timeout: 20000,
	});
	failing = false;
	await page.getByRole('button', { name: 'Tentar novamente' }).click();
	await expect(page.getByText('Não foi possível carregar a agenda', { exact: true })).toHaveCount(
		0,
	);
	await expect(
		page.getByRole('button', { name: '07 de setembro de 2026: 1 eventos' }),
	).toBeVisible();
});

test('mobile calendar supports keyboard selection without horizontal overflow', async ({
	page,
}, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await setup(page);
	await page.goto('/student/schedule');
	const selector = page.getByRole('combobox', { name: 'Filtrar por período letivo' });
	await selector.focus();
	await expect(selector).toBeFocused();
	await selector.selectOption('2026.2');
	const day = page.getByRole('button', { name: '19 de setembro de 2026: 1 eventos' });
	await day.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByText('Reposição', { exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true,
	);
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-schedule-mobile.png'),
		fullPage: true,
	});
	await page.goto('/student/classes/11/plan');
	await expect(page.getByRole('heading', { name: 'Planejamento da disciplina' })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true,
	);
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-plan-mobile.png'),
		fullPage: true,
	});
});

test('desktop overview and materials are usable', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await setup(page);
	await page.goto('/student/classes/11');
	await expect(page.getByText('Estrutura semântica e formulários', { exact: false })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Guia HTML (abre em nova aba)' })).toBeVisible();
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-class-desktop.png'),
		fullPage: true,
	});
	await page.goto('/student/materials');
	await expect(
		page.getByRole('link', { name: 'Referência do projeto (abre em nova aba)' }),
	).toBeVisible();
});

test('home summary excludes cancelled lessons and keeps assessments separate from pending work', async ({
	page,
}) => {
	await setup(page);
	await page.goto('/student');
	await expect(page.getByRole('link', { name: 'Abrir meu perfil' })).toBeVisible();
	await expect(page.getByText('Nenhuma aula prevista para hoje.', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Banco de dados', exact: true })).toBeVisible();
	await expect(page.getByText('2 atividades aguardando entrega', { exact: true })).toBeVisible();
	await expect(page.getByText('Estrutura semântica e formulários', { exact: true })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Ver detalhes de Avaliação parcial' })).toHaveCount(
		0,
	);
});

test('subject search combines with periods and can be cleared', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await setup(page, 'semester');
	await page.goto('/student/classes');
	const search = page.getByRole('searchbox', { name: 'Buscar disciplina' });
	await search.fill('programacao');
	await expect(page.getByRole('link', { name: 'Ver detalhes de Programação web' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Ver detalhes de Banco de dados' })).toHaveCount(0);
	await search.fill('Helena');
	await expect(page.getByRole('link', { name: 'Ver detalhes de Programação web' })).toBeVisible();
	await search.fill('programacao');
	await page.getByRole('combobox', { name: 'Filtrar por período letivo' }).selectOption('2026.1');
	await expect(page.getByText('Nenhuma disciplina encontrada', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Limpar filtros' }).click();
	await expect(search).toHaveValue('');
	await expect(page.locator('[data-interactive="card"]')).toHaveCount(3);
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-subjects-desktop.png'),
		fullPage: true,
	});
	await page.getByRole('link', { name: 'Ver detalhes de Programação web' }).click();
	await page.getByRole('link', { name: 'Minhas disciplinas', exact: true }).click();
	await expect(page.getByRole('combobox', { name: 'Filtrar por período letivo' })).toHaveValue(
		'all',
	);
});

test('interactive cards respect reduced motion and show keyboard focus', async ({
	page,
}, testInfo) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' });
	await setup(page);
	await page.goto('/student/classes');
	const card = page.getByRole('link', { name: 'Ver detalhes de Programação web' });
	await card.hover();
	await expect
		.poll(() => card.evaluate((element) => getComputedStyle(element).transform))
		.toBe('matrix(1, 0, 0, 1, 0, -3)');
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-card-hover.png'),
		fullPage: true,
	});
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect
		.poll(() => card.evaluate((element) => getComputedStyle(element).transform))
		.toBe('none');
	await expect
		.poll(() =>
			page.locator('#page-content').evaluate((element) => getComputedStyle(element).animationName),
		)
		.toBe('none');
	await page.getByRole('searchbox').focus();
	await page.keyboard.press('Tab');
	await expect(card).toBeFocused();
	await expect(card).toHaveCSS('outline-style', 'solid');
	await page.getByRole('checkbox', { name: 'Tema escuro' }).focus();
	await page.keyboard.press('Space');
	await expect(page.locator('html')).toHaveClass(/dark/);
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-subjects-dark.png'),
		fullPage: true,
	});
});

test('mobile navigation announces state, closes with Escape and has one active destination', async ({
	page,
}, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await setup(page);
	await page.goto('/student/classes');
	const menu = page.getByRole('button', { name: 'Abrir navegação' });
	await expect(menu).toHaveAttribute('aria-expanded', 'false');
	await menu.click();
	await expect(page.getByRole('button', { name: 'Fechar navegação' })).toHaveAttribute(
		'aria-expanded',
		'true',
	);
	const nav = page.getByRole('navigation', { name: 'Navegação principal' });
	await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-navigation-mobile.png'),
		fullPage: true,
	});
	await page.keyboard.press('Escape');
	await expect(menu).toBeFocused();
	await expect(nav).toHaveCount(0);
	await page.screenshot({
		animations: 'disabled',
		path: testInfo.outputPath('student-subjects-mobile.png'),
		fullPage: true,
	});
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true,
	);
});

test('today preserves calendar filters and clear restores all events', async ({ page }) => {
	await setup(page);
	await page.goto('/student/schedule');
	const period = page.getByRole('combobox', { name: 'Filtrar por período letivo' });
	const subject = page.getByRole('combobox', { name: 'Filtrar por disciplina' });
	await period.selectOption('2026.2');
	await subject.selectOption('12');
	await page.getByRole('button', { name: 'Aulas', exact: true }).click();
	await page.getByRole('button', { name: 'Próximo período' }).click();
	await page.getByRole('button', { name: 'Hoje', exact: true }).click();
	await expect(period).toHaveValue('2026.2');
	await expect(subject).toHaveValue('12');
	await expect(page.getByRole('button', { name: 'Aulas', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true',
	);
	await expect(page.getByRole('heading', { name: 'setembro de 2026' })).toBeVisible();
	await page.getByRole('button', { name: 'Limpar filtros' }).click();
	await expect(period).toHaveValue('all');
	await expect(subject).toHaveValue('all');
	await expect(page.getByRole('button', { name: 'Tudo', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true',
	);
});
