import type { StudentDashboardSubmission, StudentEnrollment } from '@Api/academic/types';

import type { SubjectActivityDetails, SubjectDetails } from '../types';

const shiftLabels: Record<StudentEnrollment['classOffering']['shift'], string> = {
	morning: 'Matutino',
	afternoon: 'Vespertino',
	evening: 'Noturno',
	integral: 'Integral',
};

const enrollmentStatusLabels: Record<string, string> = {
	active: 'Ativa',
	inactive: 'Inativa',
	completed: 'Concluída',
	cancelled: 'Cancelada',
};

function mapActivityStatus(
	activityId: number,
	dueAt: string | null,
	submissions: StudentDashboardSubmission[],
	now: Date,
): Pick<SubjectActivityDetails, 'status' | 'statusLabel' | 'grade'> {
	const submission = submissions.find((item) => item.activityId === activityId);

	if (submission?.grade !== null && submission?.grade !== undefined) {
		return { status: 'graded', statusLabel: 'Avaliada', grade: submission.grade };
	}

	if (submission) {
		return { status: 'submitted', statusLabel: 'Entregue', grade: null };
	}

	if (dueAt && new Date(dueAt).getTime() < now.getTime()) {
		return { status: 'overdue', statusLabel: 'Atrasada', grade: null };
	}

	return { status: 'pending', statusLabel: 'Pendente', grade: null };
}

export function mapSubjectDetails(
	enrollment: StudentEnrollment,
	submissions: StudentDashboardSubmission[],
	now = new Date(),
): SubjectDetails {
	const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
	const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
	});
	const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	return {
		enrollmentId: enrollment.id,
		title: enrollment.classOffering.title,
		code: enrollment.classOffering.code,
		period: `${enrollment.classOffering.year} · ${enrollment.classOffering.term}`,
		shift: shiftLabels[enrollment.classOffering.shift],
		status: enrollmentStatusLabels[enrollment.status] ?? enrollment.status,
		sessions: [...enrollment.sessions]
			.sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt))
			.map((session) => ({
				id: session.id,
				date: dateFormatter.format(new Date(session.startsAt)),
				time: session.endsAt
					? `${timeFormatter.format(new Date(session.startsAt))}–${timeFormatter.format(new Date(session.endsAt))}`
					: timeFormatter.format(new Date(session.startsAt)),
				topic: session.topic ?? 'Conteúdo ainda não informado',
			})),
		activities: [...enrollment.activities]
			.sort((left, right) => {
				const leftDate = left.dueAt ? Date.parse(left.dueAt) : Number.POSITIVE_INFINITY;
				const rightDate = right.dueAt ? Date.parse(right.dueAt) : Number.POSITIVE_INFINITY;
				return leftDate - rightDate;
			})
			.map((activity) => ({
				id: activity.id,
				title: activity.title,
				description: activity.description,
				dueLabel: activity.dueAt
					? dateTimeFormatter.format(new Date(activity.dueAt))
					: 'Sem prazo definido',
				...mapActivityStatus(activity.id, activity.dueAt, submissions, now),
			})),
	};
}
