import { describe, expect, it } from 'vitest';

import { academicEvents, studentScenario } from '../../fixtures/scenarios';
import { buildCalendarEntries, calendarRange, entriesForDay } from './calendar';

describe('student calendar', () => {
	it('filters periods, disciplines and assessments independently', () => {
		const data = studentScenario('semester');
		expect(
			buildCalendarEntries(data.enrollments, academicEvents, {
				period: '2026.1',
				classId: 'all',
				kind: 'classes',
			}).map((item) => item.title),
		).toEqual(['Algoritmos']);
		expect(
			buildCalendarEntries(data.enrollments, academicEvents, {
				period: '2026.1',
				classId: 'all',
				kind: 'academicEvents',
			}),
		).toEqual([]);
		expect(
			buildCalendarEntries(data.enrollments, [], {
				period: '2026.2',
				classId: '12',
				kind: 'classes',
			}).map((item) => item.title),
		).toEqual(['Banco de dados']);
		expect(
			buildCalendarEntries(data.enrollments, [], {
				period: '2026.2',
				classId: 'all',
				kind: 'assessments',
			}).map((item) => item.title),
		).toEqual(['Avaliação parcial']);
	});
	it('shows multi-day academic events on every covered day', () => {
		const entries = buildCalendarEntries(studentScenario().enrollments, academicEvents, {
			period: '2026.2',
			classId: 'all',
			kind: 'academicEvents',
		});
		expect(entriesForDay(entries, '2026-10-21').map((entry) => entry.title)).toEqual([
			'Semana acadêmica',
		]);
		expect(entriesForDay(entries, '2026-10-24')).toEqual([]);
		expect(entriesForDay(entries, '2026-09-07')[0]?.title).toBe('Independência do Brasil');
	});
	it('groups late deadlines by local date and retains cancellation information', () => {
		const entries = buildCalendarEntries(studentScenario().enrollments, [], {
			period: 'all',
			classId: 'all',
			kind: 'all',
		});
		expect(
			entriesForDay(entries, '2026-09-08').some((entry) => entry.title === 'Exercícios de fixação'),
		).toBe(true);
		expect(entries.find((entry) => entry.session?.status === 'cancelled')).toBeDefined();
		expect(entries.find((entry) => entry.session?.replacesSessionId)).toBeDefined();
	});
	it('navigates months across year boundaries', () => {
		const range = calendarRange(new Date('2026-12-10T12:00:00-03:00'), 1, 'month');
		expect(range.headingDate.getUTCFullYear()).toBe(2027);
		expect(range.headingDate.getUTCMonth()).toBe(0);
		expect(range.days).toHaveLength(42);
	});
});
