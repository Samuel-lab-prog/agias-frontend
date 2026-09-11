import { describe, expect, it, vi } from 'vitest';

import { academicEvents, studentScenario } from '../../fixtures/scenarios';
import { dateKey } from '../../utils/academic-planning';
import {
	buildCalendarEntries,
	type CalendarEntry,
	calendarRange,
	entriesForDay,
	indexEntriesByDay,
} from './calendar';

describe('student calendar', () => {
	it('indexes local dates and inclusive multi-day events only inside the visible range', () => {
		const entries: CalendarEntry[] = [
			{ id: 'deadline', kind: 'activities', title: 'Prazo', startsAt: '2026-09-09T02:59:00Z' },
			{
				id: 'overnight',
				kind: 'classes',
				title: 'Aula',
				startsAt: '2026-09-09T02:00:00Z',
				endsAt: '2026-09-09T04:00:00Z',
			},
			{
				id: 'holiday',
				kind: 'academicEvents',
				title: 'Evento',
				allDay: true,
				startsAt: '2026-09-07T00:00:00Z',
				endsAt: '2026-09-09T00:00:00Z',
			},
			{ id: 'outside', kind: 'classes', title: 'Futuro', startsAt: '2027-01-01T12:00:00Z' },
		];
		const { days } = calendarRange(new Date('2026-09-08T12:00:00Z'), 0, 'week');
		const index = indexEntriesByDay(entries, days);
		expect(index.size).toBe(7);
		expect(index.get('2026-09-08')?.map((entry) => entry.id)).toEqual([
			'deadline',
			'overnight',
			'holiday',
		]);
		expect(index.get('2026-09-09')?.map((entry) => entry.id)).toEqual(['overnight', 'holiday']);
		expect(index.get('2026-09-10')).toEqual([]);
		expect(index.has('2027-01-01')).toBe(false);
		for (const day of days)
			expect(index.get(dateKey(day))).toEqual(entriesForDay(entries, dateKey(day)));
	});
	it('formats event boundaries once per index instead of once per calendar cell', () => {
		const { days } = calendarRange(new Date('2026-09-08T12:00:00Z'), 0, 'month');
		const entries: CalendarEntry[] = Array.from({ length: 1000 }, (_, id) => ({
			id: String(id),
			kind: 'classes',
			title: 'Aula',
			startsAt: '2026-09-08T10:00:00Z',
			endsAt: '2026-09-08T12:00:00Z',
		}));
		const format = vi.spyOn(
			Intl.DateTimeFormat.prototype as { readonly format: unknown },
			'format',
			'get',
		);
		try {
			const index = indexEntriesByDay(entries, days);
			expect(index.get('2026-09-08')).toHaveLength(1000);
			expect(format.mock.calls.length).toBeLessThanOrEqual(entries.length * 2 + days.length);
		} finally {
			format.mockRestore();
		}
	});
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
