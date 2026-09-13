import { expect, test, type Page } from '@playwright/test';
import type { StaffClass, StaffEnrollment } from '../src/core/api/curriculum/types';

const period = {
	id: 1,
	code: '2026.2',
	year: 2026,
	term: 2,
	startsAt: '2026-08-03T03:00:00Z',
	endsAt: '2026-12-18T03:00:00Z',
};
const course = { id: 1, name: 'Técnico em Informática', code: 'INFO' };
const student = { id: 8, name: 'Ana Souza', academicId: '20260008', courseId: 1 };
const professor = { id: 9, name: 'Helena Duarte' };
const offering: StaffClass = {
	id: 7,
	courseId: 1,
	academicPeriodId: 1,
	shift: 'morning',
	year: 2026,
	term: '2',
	code: 'WEB-2026-2',
	title: 'Programação Web II',
	course,
	academicPeriod: period,
	activeEnrollments: 0,
	professors: [],
};

async function setup(page: Page, initial = true, role = 'staff') {
	await page.route('**/institution/context', route => route.fulfill({ json: {
		id: 100, role, name: 'Pessoa de teste', campus: { name: 'Campus inicial', institution: { configured: false } },
	} }));
	let classes = initial ? [structuredClone(offering)] : [];
	let roster: StaffEnrollment[] = [];
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
	await page.route('**/curriculum/**', async (route) => {
		const request = route.request();
		const url = new URL(request.url());
		const path = url.pathname.split('/curriculum')[1];
		const method = request.method();
		const result = (data: unknown, status = 200) => route.fulfill({ json: data, status });
		const paged = (items: unknown[]) => ({ items, total: items.length, page: 1, pageSize: 25 });
		if (path === '/academic-periods') return result([period]);
		if (path === '/courses') return result([course]);
		if (path === '/students') return result(paged([student]));
		if (path === '/professors') return result(paged([professor]));
		if (path === '/class-offerings' && method === 'POST') {
			classes = [{ ...structuredClone(offering), ...request.postDataJSON() }];
			return result(classes[0], 201);
		}
		if (path === '/class-offerings') {
			const q = url.searchParams.get('q')?.toLowerCase() ?? '';
			return result(
				paged(classes.filter((item) => `${item.title} ${item.code}`.toLowerCase().includes(q))),
			);
		}
		if (path === '/class-offerings/7' && method === 'PUT') {
			Object.assign(classes[0]!, request.postDataJSON());
			return result(classes[0]);
		}
		if (path === '/class-offerings/7') return result(classes[0]);
		if (path === '/class-offerings/7/professors' && method === 'POST') {
			classes[0]!.professors = [professor];
			return result(professor);
		}
		if (path === '/class-offerings/7/professors/9' && method === 'DELETE') {
			classes[0]!.professors = [];
			return result({ success: true });
		}
		if (path === '/class-offerings/7/enrollments' && method === 'POST') {
			if (roster.length)
				return result({ message: 'O aluno já possui matrícula nesta turma.' }, 409);
			roster = [{ id: 20, studentProfileId: 8, classOfferingId: 7, status: 'active', student }];
			classes[0]!.activeEnrollments = 1;
			return result(roster[0], 201);
		}
		if (path === '/class-offerings/7/enrollments/20' && method === 'PATCH') {
			roster[0]!.status = request.postDataJSON().status;
			classes[0]!.activeEnrollments = roster[0]!.status === 'active' ? 1 : 0;
			return result(roster[0]);
		}
		if (path === '/class-offerings/7/enrollments') return result(paged(roster));
		return result({ message: 'Turma não encontrada.' }, 404);
	});
}

test('staff creates and edits a class, assigns a professor and manages enrollment status', async ({
	page,
}) => {
	await setup(page, false);
	await page.goto('/staff/classes');
	await expect(page.getByText('Nenhuma turma encontrada')).toBeVisible();
	await page.getByRole('link', { name: 'Nova turma' }).click();
	await page.getByLabel('Nome da turma / disciplina').fill('Programação Web II');
	await page.getByLabel('Código da turma').fill('WEB-2026-2');
	await page.getByLabel('Curso', { exact: true }).selectOption('1');
	await page.getByLabel('Período letivo', { exact: true }).selectOption('1');
	await page.getByRole('button', { name: 'Criar turma', exact: true }).click();
	await expect(page).toHaveURL(/\/staff\/classes\/7$/);
	await expect(page.getByRole('heading', { name: 'Programação Web II', level: 1 })).toBeVisible();
	await page.getByRole('button', { name: 'Editar turma', exact: true }).click();
	await expect(page.getByLabel('Curso', { exact: true })).toBeDisabled();
	await page.getByLabel('Nome da turma / disciplina').fill('Programação Web II — turma A');
	await page.getByRole('button', { name: 'Salvar alterações', exact: true }).click();
	await expect(
		page.getByRole('heading', { name: 'Programação Web II — turma A', level: 1 }),
	).toBeVisible();
	await page.getByRole('button', { name: 'Vincular professor', exact: true }).click();
	await page.getByRole('button', { name: 'Vincular Helena Duarte', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Desvincular Helena Duarte' })).toBeVisible();
	await page.getByRole('button', { name: 'Matricular aluno', exact: true }).click();
	await page.getByRole('button', { name: 'Matricular Ana Souza', exact: true }).click();
	await expect(page.getByRole('combobox', { name: 'Situação de Ana Souza' })).toHaveValue('active');
	await page.getByRole('combobox', { name: 'Situação de Ana Souza' }).selectOption('cancelled');
	await page.getByRole('button', { name: 'Salvar situação de Ana Souza' }).click();
	await expect(page.getByRole('button', { name: 'Salvar situação de Ana Souza' })).toBeDisabled();
	await expect(page.getByText(/0 matrículas ativas/)).toBeVisible();
	await page.getByRole('combobox', { name: 'Situação de Ana Souza' }).selectOption('active');
	await page.getByRole('button', { name: 'Salvar situação de Ana Souza' }).click();
	await expect(page.getByText(/1 matrículas ativas/)).toBeVisible();
});

test('class management filters, retries errors and fits a mobile screen', async ({
	page,
}, testInfo) => {
	await setup(page);
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/staff/classes');
	await page.getByLabel('Buscar turma', { exact: true }).fill('sem resultado');
	await expect(page.getByText('Nenhuma turma encontrada')).toBeVisible();
	await page.getByRole('button', { name: 'Limpar filtros' }).click();
	await page.getByRole('link', { name: 'Gerenciar Programação Web II' }).click();
	await expect(page.getByRole('heading', { name: 'Matrículas', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Matricular aluno', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Matricular Ana Souza' })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: testInfo.outputPath('staff-class-mobile.png'), fullPage: true });
	await page.route(
		'**/curriculum/class-offerings/7/enrollments*',
		(route) =>
			route.fulfill({
				status: 500,
				json: { message: 'Falha temporária ao consultar matrículas.' },
			}),
		{ times: 1 },
	);
	await page.reload();
	await expect(page.getByRole('heading', { name: 'Programação Web II', level: 1 })).toBeVisible();
	await expect(page.getByText('Nenhuma matrícula encontrada.', { exact: false })).toBeVisible();
});

test('a rejected save explains the error and preserves the class form for retry', async ({
	page,
}) => {
	await setup(page, false);
	await page.route(
		'**/curriculum/class-offerings',
		(route) =>
			route.fulfill({
				status: 409,
				json: { code: 'CONFLICT', message: 'Já existe uma turma com este código.' },
			}),
		{ times: 1 },
	);
	await page.goto('/staff/classes/new');
	await page.getByLabel('Nome da turma / disciplina').fill('Programação Web II');
	await page.getByLabel('Código da turma').fill('WEB-2026-2');
	await page.getByLabel('Curso', { exact: true }).selectOption('1');
	await page.getByLabel('Período letivo', { exact: true }).selectOption('1');
	await page.getByRole('button', { name: 'Criar turma', exact: true }).click();
	await expect(page.getByText('Já existe uma turma com este código.')).toBeVisible();
	await expect(page.getByLabel('Nome da turma / disciplina')).toHaveValue('Programação Web II');
	await page.getByLabel('Código da turma').fill('WEB-2026-2-B');
	await page.getByRole('button', { name: 'Criar turma', exact: true }).click();
	await expect(page).toHaveURL(/\/staff\/classes\/7$/);
});

test('a student cannot open staff class management', async ({ page }) => {
	await setup(page, true, 'student');
	await page.route('**/academic/students/dashboard/me', (route) =>
		route.fulfill({ status: 404, json: { message: 'Perfil não encontrado' } }),
	);
	await page.goto('/staff/classes');
	await expect(page).toHaveURL(/\/student$/);
	await expect(page.getByRole('heading', { name: 'Turmas e matrículas' })).toHaveCount(0);
});
