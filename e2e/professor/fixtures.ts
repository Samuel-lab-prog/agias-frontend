import type { Page } from '@playwright/test';

export const classItem = {
	id: 11,
	title: 'Programação web',
	code: 'WEB-2026-B',
	year: 2026,
	shift: 'evening',
	course: { name: 'Análise e Desenvolvimento de Sistemas' },
	academicPeriod: { code: '2026.2' },
	_count: { enrollments: 32, sessions: 18, activities: 4 },
};
export const plan = {
	id: 1,
	syllabus: 'Desenvolvimento de aplicações web acessíveis, com componentes e integração de dados.',
	generalObjectives: 'Construir interfaces para resolver problemas reais.',
	methodology: 'Aulas práticas e projetos colaborativos.',
	assessmentCriteria: 'Projetos e participação.',
	workloadMinutes: 3600,
	status: 'draft',
	units: [
		{
			id: 1,
			title: 'Fundamentos da web',
			topics: [{ id: 1, title: 'HTML semântico e acessibilidade' }],
		},
	],
};
export const lesson = {
	id: 1,
	classOfferingId: 11,
	topic: 'Componentes e composição de interfaces',
	startsAt: '2026-09-14T21:30:00Z',
	endsAt: '2026-09-14T23:10:00Z',
	room: 'Laboratório 204',
	deliveredContent: null,
	publicNotes: null,
	status: 'scheduled',
	coursePlanTopicId: null,
	classOffering: { title: classItem.title },
	materials: [{ id: 1, title: 'Guia de componentes', url: 'https://example.com/componentes' }],
};
export const activity = {
	id: 1,
	classOfferingId: 11,
	title: 'Projeto: uma biblioteca de componentes',
	description: 'Crie uma interface acessível e documente as decisões do projeto.',
	kind: 'activity',
	dueAt: '2026-09-20T02:59:00Z',
	appliesAt: null,
	maxGrade: 10,
	weight: null,
	assessmentType: null,
	allowLateSubmissions: true,
	classOffering: { title: classItem.title },
	_count: { submissions: 14 },
};
export const material = {
	id: 1,
	title: 'Guia de componentes',
	url: 'https://example.com/componentes',
	classSessionId: 1,
	classSession: {
		topic: lesson.topic,
		classOfferingId: 11,
		classOffering: { title: classItem.title },
	},
};
export const overview = {
	profile: {
		registryCode: 'DOC-0042',
		title: 'Mestre em Ciência da Computação',
		workload: 40,
		department: { name: 'Tecnologia e Computação' },
		user: { name: 'Helena Duarte', email: 'helena.duarte@agias.edu.br' },
	},
	classCount: 3,
	students: 96,
	pendingGrades: 8,
	lessons: [
		lesson,
		{
			...lesson,
			id: 2,
			topic: 'Integração com APIs',
			startsAt: '2026-09-16T21:30:00Z',
			endsAt: '2026-09-16T23:10:00Z',
		},
	],
};

export async function setupProfessor(page: Page) {
	await page.clock.setFixedTime(new Date('2026-09-11T15:00:00Z'));
	await page.addInitScript(() => {
		localStorage.setItem(
			'auth-client',
			JSON.stringify({
				authClient: { id: 42, role: 'professor', status: 'active' },
				unreadNotificationsCount: 0,
			}),
		);
		localStorage.setItem('theme', 'light');
	});
	const writes: Array<{ path: string; body: Record<string, unknown> }> = [];
	let savedPlan = { ...plan };
	await page.route('**/teaching/**', async (route) => {
		const url = new URL(route.request().url());
		const path = url.pathname.split('/teaching')[1];
		const pageNumber = Number(url.searchParams.get('page') ?? 1);
		const q = url.searchParams.get('q') ?? '';
		if (route.request().method() !== 'GET') {
			const body = route.request().postDataJSON();
			writes.push({ path, body });
			if (path.endsWith('/plan')) savedPlan = { ...savedPlan, ...body };
			await route.fulfill({ json: { success: true, id: 99 } });
			return;
		}
		if (path === '/overview') {
			await route.fulfill({ json: overview });
			return;
		}
		if (path === '/classes/11') {
			await route.fulfill({ json: { ...classItem, coursePlan: savedPlan } });
			return;
		}
		let items: unknown[] = [];
		if (path === '/classes')
			items =
				pageNumber === 1
					? [classItem, { ...classItem, id: 12, title: 'Banco de dados', code: 'BD-2026-B' }]
					: [{ ...classItem, id: 13, title: 'Engenharia de software' }];
		if (path === '/activities') items = [activity];
		if (path === '/materials') items = [material];
		if (path === '/lessons')
			items = url.searchParams.get('from')?.startsWith('2026-10')
				? []
				: [lesson, { ...lesson, id: 3, status: 'cancelled', topic: 'Aula de revisão' }];
		if (path.endsWith('/roster'))
			items = [
				{ id: 1, name: 'Ana Souza', academicId: '20260001', attendance: null, submission: null },
				{ id: 2, name: 'Pedro Lima', academicId: '20260002', attendance: null, submission: null },
			];
		if (q)
			items = items.filter((item) =>
				String(
					(item as { title?: string; name?: string }).title ?? (item as { name?: string }).name,
				)
					.toLowerCase()
					.includes(q.toLowerCase()),
			);
		await route.fulfill({
			json: {
				items,
				total: path === '/classes' && !q ? 3 : items.length,
				page: pageNumber,
				pageSize: path === '/classes' ? 2 : 25,
			},
		});
	});
	return writes;
}
