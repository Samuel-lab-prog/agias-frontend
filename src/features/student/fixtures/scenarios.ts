import type {
	AcademicCalendarEvent,
	StudentDashboard,
	StudentEnrollment,
} from '@Api/academic/types';
import type { AcademicPeriod } from '@Api/curriculum/types';

export const fixtureNow = '2026-09-10T12:00:00-03:00';
export const academicPeriods: AcademicPeriod[] = [
	{
		id: 1,
		code: '2026.1',
		year: 2026,
		term: 1,
		startsAt: '2026-02-02T00:00:00-03:00',
		endsAt: '2026-07-17T23:59:59-03:00',
	},
	{
		id: 2,
		code: '2026.2',
		year: 2026,
		term: 2,
		startsAt: '2026-08-03T00:00:00-03:00',
		endsAt: '2026-12-18T23:59:59-03:00',
	},
];
const offering: StudentEnrollment = {
	id: 101,
	status: 'active',
	classOffering: {
		id: 11,
		title: 'Programação web',
		code: 'INF-PROG-2026-2',
		courseId: 1,
		year: 2026,
		term: '2',
		shift: 'morning',
		academicPeriod: academicPeriods[1],
		professors: [{ id: 1, name: 'Helena Duarte' }],
	},
	plan: {
		id: 1,
		status: 'published',
		syllabus: 'Fundamentos e projeto aplicado.',
		generalObjectives: 'Construir interfaces acessíveis.',
		units: [
			{
				id: 1,
				title: 'Fundamentos',
				description: null,
				position: 1,
				topics: [
					{ id: 1, title: 'HTML semântico', description: null, position: 1, type: 'content' },
					{
						id: 2,
						title: 'Estilos e acessibilidade',
						description: null,
						position: 2,
						type: 'content',
					},
				],
			},
		],
	},
	sessions: [
		{
			id: 1,
			coursePlanTopicId: 1,
			startsAt: '2026-09-08T08:00:00-03:00',
			endsAt: '2026-09-08T09:40:00-03:00',
			topic: 'HTML semântico',
			status: 'completed',
			deliveredContent: 'Estrutura semântica e formulários',
			room: 'Lab 02',
			materials: [
				{ id: 1, title: 'Guia HTML', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML' },
			],
		},
		{
			id: 2,
			coursePlanTopicId: 2,
			startsAt: '2026-09-14T08:00:00-03:00',
			endsAt: '2026-09-14T09:40:00-03:00',
			topic: 'Estilos e acessibilidade',
			status: 'cancelled',
			publicNotes: 'Reposição no sábado.',
		},
		{
			id: 3,
			coursePlanTopicId: 2,
			startsAt: '2026-09-19T08:00:00-03:00',
			endsAt: '2026-09-19T09:40:00-03:00',
			topic: 'Estilos e acessibilidade',
			status: 'scheduled',
			replacesSessionId: 2,
			room: 'Lab 03',
		},
	],
	activities: [
		{
			id: 1,
			title: 'Exercícios de fixação',
			description: null,
			kind: 'activity',
			dueAt: '2026-09-08T23:59:00-03:00',
			createdAt: '2026-08-20T12:00:00Z',
			attachments: [],
		},
		{
			id: 2,
			title: 'Projeto aplicado',
			description: 'Construir uma página acessível.',
			kind: 'activity',
			dueAt: '2026-09-18T23:59:00-03:00',
			createdAt: '2026-08-20T12:00:00Z',
			attachments: [
				{
					id: 1,
					fileName: 'Referência do projeto',
					fileUrl: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML',
				},
			],
		},
		{
			id: 3,
			title: 'Avaliação parcial',
			description: null,
			kind: 'assessment',
			assessmentType: 'Prova',
			appliesAt: '2026-09-16T08:00:00-03:00',
			dueAt: null,
			maxGrade: 10,
			weight: 2,
			createdAt: '2026-08-20T12:00:00Z',
		},
	],
};
export const academicEvents: AcademicCalendarEvent[] = [
	{
		id: 1,
		academicPeriodId: 2,
		title: 'Independência do Brasil',
		type: 'holiday',
		description: null,
		startsAt: '2026-09-07T00:00:00Z',
		endsAt: '2026-09-07T23:59:59Z',
		allDay: true,
		isInstructionalDay: false,
	},
	{
		id: 2,
		academicPeriodId: 2,
		title: 'Semana acadêmica',
		type: 'academic_event',
		description: null,
		startsAt: '2026-10-19T00:00:00-03:00',
		endsAt: '2026-10-23T23:59:59-03:00',
		allDay: true,
		isInstructionalDay: false,
	},
];
export function studentScenario(
	name: 'complete' | 'empty' | 'semester' | 'exceptions' = 'complete',
): StudentDashboard {
	const first = structuredClone(offering);
	const second: StudentEnrollment = {
		...structuredClone(offering),
		id: 102,
		classOffering: {
			...first.classOffering,
			id: 12,
			title: 'Banco de dados',
			code: 'INF-BD-2026-2',
		},
		plan: null,
		sessions: [
			{
				id: 21,
				coursePlanTopicId: null,
				startsAt: '2026-09-15T08:00:00-03:00',
				endsAt: null,
				topic: 'Modelagem de dados',
				status: 'scheduled',
			},
		],
		activities: [],
	};
	let enrollments = [first, second];
	if (name === 'empty') enrollments = [];
	if (name === 'semester')
		enrollments.push({
			...structuredClone(first),
			id: 103,
			status: 'completed',
			classOffering: {
				...first.classOffering,
				id: 13,
				title: 'Algoritmos',
				year: 2026,
				term: '1',
				academicPeriod: academicPeriods[0],
			},
			sessions: [
				{
					id: 31,
					coursePlanTopicId: 1,
					startsAt: '2026-03-02T08:00:00-03:00',
					endsAt: null,
					topic: 'Introdução a algoritmos',
					status: 'completed',
				},
			],
			activities: [],
		});
	if (name === 'exceptions')
		enrollments = [
			{
				...first,
				plan: null,
				classOffering: { ...first.classOffering, professors: [] },
				sessions: [
					{
						id: 41,
						coursePlanTopicId: null,
						startsAt: '2026-09-09T08:00:00-03:00',
						endsAt: null,
						topic: null,
					},
				],
				activities: [first.activities[2]!],
			},
		];
	return {
		profile: {
			id: 1,
			userId: 1,
			academicId: 'DEMO2026',
			courseId: 1,
			admissionYear: 2026,
			status: 'active',
		},
		userName: 'Aluno de demonstração',
		courseLevel: 'Ensino Médio Integrado',
		attendanceSummary: { totalRecords: 0, presentRecords: 0, percentage: 0 },
		enrollments,
		submissions: [],
	};
}
