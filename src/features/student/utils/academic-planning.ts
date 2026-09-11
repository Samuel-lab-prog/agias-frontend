import type {
	StudentDashboardActivity,
	StudentDashboardSession,
	StudentDashboardSubmission,
	StudentEnrollment,
} from '@Api/academic/types';

export const ACADEMIC_TIME_ZONE = 'America/Sao_Paulo';
export const shiftLabels = {
	morning: 'Matutino',
	afternoon: 'Vespertino',
	evening: 'Noturno',
	integral: 'Integral',
};
export const enrollmentLabels: Record<string, string> = {
	active: 'Ativa',
	completed: 'Concluída',
	inactive: 'Inativa',
	cancelled: 'Cancelada',
};

export function periodLabel(enrollment: StudentEnrollment) {
	return (
		enrollment.classOffering.academicPeriod?.code ??
		`${enrollment.classOffering.year}.${enrollment.classOffering.term}`
	);
}
export function dateKey(value: string | Date) {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: ACADEMIC_TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date(value));
}
export function formatAcademicDate(value: string | Date, options: Intl.DateTimeFormatOptions = {}) {
	return new Intl.DateTimeFormat('pt-BR', {
		timeZone: ACADEMIC_TIME_ZONE,
		day: '2-digit',
		month: 'short',
		...options,
	}).format(new Date(value));
}
export function lessonState(session: StudentDashboardSession, now = new Date()) {
	const labels = {
		scheduled: 'Prevista',
		completed: 'Realizada',
		cancelled: 'Cancelada',
		rescheduled: 'Remarcada',
		missed: 'Não realizada',
	};
	const status = session.status ?? 'scheduled';
	const unconfirmed = status === 'scheduled' && new Date(session.endsAt ?? session.startsAt) < now;
	return {
		status,
		label: unconfirmed ? 'Realização não informada' : labels[status],
		isReplacement: Boolean(session.replacesSessionId),
		completed: status === 'completed',
	};
}

export function planProgress(enrollment: StudentEnrollment) {
	const plan = enrollment.plan;
	if (!plan || plan.status !== 'published') return null;
	const units = [...plan.units]
		.sort((a, b) => a.position - b.position)
		.map((unit) => {
			const topics = [...unit.topics]
				.sort((a, b) => a.position - b.position)
				.map((topic) => {
					const sessions = enrollment.sessions.filter(
						(session) => session.coursePlanTopicId === topic.id,
					);
					const relevant = sessions.filter(
						(session) => !['cancelled', 'rescheduled'].includes(session.status ?? 'scheduled'),
					);
					const completed =
						relevant.length > 0 && relevant.every((session) => session.status === 'completed');
					const started = relevant.some((session) => session.status === 'completed');
					return {
						...topic,
						sessions,
						completed,
						statusLabel: completed ? 'Realizado' : started ? 'Em andamento' : 'Planejado',
					};
				});
			const completedTopics = topics.filter((topic) => topic.completed).length;
			return {
				...unit,
				topics,
				completedTopics,
				progress: topics.length ? Math.round((completedTopics / topics.length) * 100) : 0,
			};
		});
	const total = units.reduce((sum, unit) => sum + unit.topics.length, 0);
	const completed = units.reduce((sum, unit) => sum + unit.completedTopics, 0);
	return {
		...plan,
		units,
		total,
		completed,
		progress: total ? Math.round((completed / total) * 100) : 0,
	};
}

export function activityState(
	activity: Pick<StudentDashboardActivity, 'id' | 'dueAt' | 'kind'>,
	submissions: StudentDashboardSubmission[],
	now = new Date(),
) {
	const submission = submissions.find((item) => item.activityId === activity.id);
	if (submission?.grade !== null && submission?.grade !== undefined)
		return { status: 'graded' as const, statusLabel: 'Avaliada', grade: submission.grade };
	if (submission?.submittedAt)
		return { status: 'submitted' as const, statusLabel: 'Entregue', grade: null };
	if (activity.kind === 'assessment')
		return { status: 'pending' as const, statusLabel: 'Nota não publicada', grade: null };
	if (activity.dueAt && new Date(activity.dueAt) < now)
		return { status: 'overdue' as const, statusLabel: 'Atrasada', grade: null };
	return { status: 'pending' as const, statusLabel: 'Pendente', grade: null };
}

export function isSafeMaterialUrl(url: string) {
	try {
		return ['https:', 'http:'].includes(new URL(url).protocol);
	} catch {
		return false;
	}
}
