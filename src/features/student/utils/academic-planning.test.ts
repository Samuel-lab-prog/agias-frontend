import { describe, expect, it } from 'vitest';

import { studentScenario } from '../fixtures/scenarios';
import { activityState, dateKey, lessonState, planProgress } from './academic-planning';

describe('student planning semantics', () => {
	it('counts unique delivered topics and excludes future/cancelled lessons', () => {
		const enrollment = studentScenario().enrollments[0]!;
		expect(planProgress(enrollment)?.progress).toBe(50);
		enrollment.sessions.push({ ...enrollment.sessions[0]!, id: 4 });
		expect(planProgress(enrollment)?.progress).toBe(50);
		enrollment.sessions[2]!.status = 'completed';
		expect(planProgress(enrollment)?.progress).toBe(100);
	});
	it('does not infer delivery from a past date or a topic link', () => {
		const enrollment = studentScenario('exceptions').enrollments[0]!;
		expect(lessonState(enrollment.sessions[0]!, new Date('2026-09-10T12:00:00Z')).label).toBe(
			'Realização não informada',
		);
	});
	it('hides drafts and handles an empty published plan', () => {
		const enrollment = studentScenario().enrollments[0]!;
		enrollment.plan!.status = 'draft';
		expect(planProgress(enrollment)).toBeNull();
		enrollment.plan!.status = 'published';
		enrollment.plan!.units = [];
		expect(planProgress(enrollment)?.progress).toBe(0);
	});
	it('keeps pending drafts overdue and preserves a grade of zero', () => {
		const activity = studentScenario().enrollments[0]!.activities[0]!;
		const draft = {
			id: 1,
			activityId: activity.id,
			submittedAt: null,
			grade: null,
			feedback: null,
		};
		expect(activityState(activity, [draft], new Date('2026-09-10')).status).toBe('overdue');
		expect(activityState(activity, [{ ...draft, grade: '0' }]).grade).toBe('0');
	});
	it('uses the Brazilian calendar day around UTC midnight', () => {
		expect(dateKey('2026-09-09T02:59:00Z')).toBe('2026-09-08');
	});
});
