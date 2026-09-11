import type { StudentDashboardSubmission, StudentEnrollment } from '@Api/academic/types';

import {
	activityState,
	enrollmentLabels,
	formatAcademicDate,
	periodLabel,
	planProgress,
	shiftLabels,
} from '../../../utils/academic-planning';
import type { SubjectDetails } from '../types';

export function mapSubjectDetails(
	enrollment: StudentEnrollment,
	submissions: StudentDashboardSubmission[],
	now = new Date(),
): SubjectDetails {
	return {
		enrollmentId: enrollment.id,
		classOfferingId: enrollment.classOffering.id,
		title: enrollment.classOffering.title,
		code: enrollment.classOffering.code,
		period: periodLabel(enrollment),
		shift: shiftLabels[enrollment.classOffering.shift],
		status: enrollmentLabels[enrollment.status] ?? enrollment.status,
		professors:
			enrollment.classOffering.professors?.map((professor) => professor.name).join(', ') ||
			'Professor ainda não informado',
		sessions: [...enrollment.sessions]
			.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
			.map((session) => ({
				...session,
				date: formatAcademicDate(session.startsAt, { year: 'numeric' }),
				time: [session.startsAt, session.endsAt]
					.filter((value): value is string => Boolean(value))
					.map((value) =>
						formatAcademicDate(value, {
							day: undefined,
							month: undefined,
							hour: '2-digit',
							minute: '2-digit',
						}),
					)
					.join('–'),
				topic: session.topic ?? 'Conteúdo ainda não informado',
			})),
		activities: [...enrollment.activities]
			.sort(
				(a, b) =>
					Date.parse(a.appliesAt ?? a.dueAt ?? '9999-01-01') -
					Date.parse(b.appliesAt ?? b.dueAt ?? '9999-01-01'),
			)
			.map((activity) => ({
				...activity,
				dueLabel:
					activity.appliesAt || activity.dueAt
						? formatAcademicDate((activity.appliesAt ?? activity.dueAt)!, {
								month: '2-digit',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})
						: 'Sem prazo definido',
				...activityState(activity, submissions, now),
			})),
		plan: planProgress(enrollment),
	};
}
