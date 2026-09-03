import type { StudentEnrollment } from '@Api/academic/types';
import { describe, expect, it } from 'vitest';

import { mapSubjectDetails } from './mapSubjectDetails';

const enrollment: StudentEnrollment = {
	id: 12,
	status: 'active',
	classOffering: {
		id: 8,
		title: 'Design para Web',
		code: 'INF-2026-A',
		year: 2026,
		term: '2',
		shift: 'evening',
		courseId: 3,
	},
	sessions: [{ id: 1, startsAt: '2026-09-03T22:00:00.000Z', endsAt: null, topic: null }],
	activities: [
		{
			id: 4,
			title: 'Protótipo',
			description: null,
			dueAt: '2026-09-01T12:00:00.000Z',
			createdAt: '2026-08-20T12:00:00.000Z',
		},
	],
};

describe('mapSubjectDetails', () => {
	it('maps enrollment data and derives overdue activity status', () => {
		const result = mapSubjectDetails(enrollment, [], new Date('2026-09-02T12:00:00.000Z'));

		expect(result.title).toBe('Design para Web');
		expect(result.shift).toBe('Noturno');
		expect(result.status).toBe('Ativa');
		expect(result.sessions[0]?.topic).toBe('Conteúdo ainda não informado');
		expect(result.activities[0]?.status).toBe('overdue');
	});

	it('prioritizes a graded submission over the deadline', () => {
		const result = mapSubjectDetails(
			enrollment,
			[
				{
					id: 9,
					activityId: 4,
					submittedAt: '2026-09-01T10:00:00.000Z',
					grade: '9.5',
					feedback: null,
				},
			],
			new Date('2026-09-02T12:00:00.000Z'),
		);

		expect(result.activities[0]).toMatchObject({ status: 'graded', grade: '9.5' });
	});
});
