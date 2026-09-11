import type {
	AcademicCalendarEvent,
	StudentDashboardSession,
	StudentEnrollment,
} from '@Api/academic/types';

import { dateKey, periodLabel } from '../../utils/academic-planning';

export type CalendarKind = 'all' | 'classes' | 'activities' | 'assessments' | 'academicEvents';
export type CalendarEntry = {
	id: string;
	kind: Exclude<CalendarKind, 'all'>;
	title: string;
	startsAt: string;
	endsAt?: string | null;
	allDay?: boolean;
	description?: string | null;
	href?: string;
	session?: StudentDashboardSession;
};
export function dayDate(key: string) {
	return new Date(`${key}T12:00:00-03:00`);
}
export function addDays(date: Date, count: number) {
	const result = new Date(date);
	result.setUTCDate(result.getUTCDate() + count);
	return result;
}
export function calendarRange(anchor: Date, offset: number, view: 'week' | 'month') {
	const key = dateKey(anchor);
	const day = dayDate(key);
	if (view === 'week') {
		const weekday = day.getUTCDay();
		const start = addDays(day, -((weekday + 6) % 7) + offset * 7);
		return { headingDate: start, days: Array.from({ length: 7 }, (_, i) => addDays(start, i)) };
	}
	const month = new Date(
		Date.UTC(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1 + offset, 1, 15),
	);
	const start = addDays(month, -((month.getUTCDay() + 6) % 7));
	return { headingDate: month, days: Array.from({ length: 42 }, (_, i) => addDays(start, i)) };
}

export function buildCalendarEntries(
	enrollments: StudentEnrollment[],
	events: AcademicCalendarEvent[],
	filters: { period: string; classId: string; kind: CalendarKind },
) {
	const { period, classId, kind } = filters;
	const periodEnrollments = enrollments.filter(
		(item) => period === 'all' || periodLabel(item) === period,
	);
	const periodIds = new Set(periodEnrollments.map((item) => item.classOffering.academicPeriod?.id));
	const result: CalendarEntry[] = [];
	for (const enrollment of periodEnrollments.filter(
		(item) => classId === 'all' || String(item.classOffering.id) === classId,
	)) {
		const query = `?period=${encodeURIComponent(period)}`;
		const href = `/student/classes/${enrollment.classOffering.id}${query}`;
		for (const session of enrollment.sessions)
			result.push({
				id: `lesson-${session.id}`,
				kind: 'classes',
				title: enrollment.classOffering.title,
				startsAt: session.startsAt,
				endsAt: session.endsAt,
				description: session.deliveredContent ?? session.topic,
				href,
				session,
			});
		for (const activity of enrollment.activities) {
			const startsAt =
				activity.kind === 'assessment' ? (activity.appliesAt ?? activity.dueAt) : activity.dueAt;
			if (startsAt)
				result.push({
					id: `activity-${activity.id}`,
					kind: activity.kind === 'assessment' ? 'assessments' : 'activities',
					title: activity.title,
					startsAt,
					description: enrollment.classOffering.title,
					href:
						activity.kind === 'assessment'
							? `/student/classes/${enrollment.classOffering.id}/assessments${query}`
							: `/student/subjects/${enrollment.id}/activities/${activity.id}${query}`,
				});
		}
	}
	// Academic events apply to the student's period, including while a discipline filter is active.
	for (const event of events.filter(
		(event) => period === 'all' || periodIds.has(event.academicPeriodId),
	))
		result.push({ ...event, id: `event-${event.id}`, kind: 'academicEvents' });
	return result
		.filter((item) => kind === 'all' || item.kind === kind)
		.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
export function entriesForDay(entries: CalendarEntry[], key: string) {
	return entries.filter((entry) => {
		const start = entry.allDay ? entry.startsAt.slice(0, 10) : dateKey(entry.startsAt);
		const end = entry.endsAt
			? entry.allDay
				? entry.endsAt.slice(0, 10)
				: dateKey(entry.endsAt)
			: start;
		return start <= key && end >= key;
	});
}
