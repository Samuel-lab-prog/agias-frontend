import { expect, test } from '@playwright/test';
import {
	academicPeriods,
	fixtureNow,
	studentScenario,
} from '../../src/features/student/fixtures/scenarios';

test('semester-sized calendar reuses date formatters while navigating and filtering', async ({
	page,
}, testInfo) => {
	const dashboard = studentScenario();
	const template = dashboard.enrollments[0]!;
	dashboard.enrollments = Array.from({ length: 13 }, (_, index) => ({
		...template,
		id: index + 1,
		classOffering: { ...template.classOffering, id: index + 1, title: `Disciplina ${index + 1}` },
		sessions: Array.from({ length: 20 }, (_, lesson) => ({
			...template.sessions[0]!,
			id: index * 100 + lesson,
			startsAt: new Date(Date.UTC(2026, 7, 3 + lesson * 7 + (index % 5), 10)).toISOString(),
			endsAt: new Date(Date.UTC(2026, 7, 3 + lesson * 7 + (index % 5), 12)).toISOString(),
		})),
		activities: Array.from({ length: 6 }, (_, activity) => ({
			...template.activities[0]!,
			id: index * 100 + activity,
			title: `Atividade ${index + 1}.${activity + 1}`,
			dueAt: new Date(Date.UTC(2026, 7, 10 + activity * 21 + (index % 5), 22)).toISOString(),
		})),
	}));
	await page.clock.setFixedTime(new Date(fixtureNow));
	await page.addInitScript(() => {
		localStorage.setItem(
			'auth-client',
			JSON.stringify({
				authClient: { id: 1, role: 'student', status: 'active' },
				unreadNotificationsCount: 0,
			}),
		);
		let constructors = 0;
		Object.defineProperty(window, '__calendarFormatters', { get: () => constructors });
		Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
			construct(target, args) {
				constructors++;
				return Reflect.construct(target, args);
			},
		});
	});
	await page.route('**/academic/students/dashboard/me', (route) =>
		route.fulfill({ json: dashboard }),
	);
	await page.route('**/curriculum/academic-periods', (route) =>
		route.fulfill({ json: academicPeriods }),
	);
	await page.route('**/communications/announcements/me', (route) => route.fulfill({ json: [] }));
	await page.route('**/academic-calendar/students/me/events?*', (route) =>
		route.fulfill({ json: [] }),
	);
	await page.goto('/student/schedule');
	await expect(page.getByRole('button', { name: /01 de setembro de 2026:/ })).toBeVisible();
	const initial = await page.evaluate(() => Reflect.get(window, '__calendarFormatters') as number);
	await page.getByRole('button', { name: 'Próximo período', exact: true }).click();
	await expect(page.getByRole('heading', { name: 'outubro de 2026', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Período anterior', exact: true }).click();
	await page.getByRole('combobox', { name: 'Filtrar por disciplina' }).selectOption('13');
	await page.getByRole('button', { name: 'Aulas', exact: true }).click();
	await expect(
		page.getByRole('link', { name: 'Disciplina 13', exact: true }).first(),
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Disciplina 1', exact: true })).toHaveCount(0);
	const final = await page.evaluate(() => Reflect.get(window, '__calendarFormatters') as number);
	// Work budget is deterministic across machines; wall-clock thresholds would be flaky in CI.
	expect(initial).toBeLessThan(100);
	expect(final - initial).toBeLessThan(10);
	await testInfo.attach('calendar-work-budget', {
		body: JSON.stringify({ disciplines: 13, lessons: 260, activities: 78, initial, final }),
		contentType: 'application/json',
	});
});
