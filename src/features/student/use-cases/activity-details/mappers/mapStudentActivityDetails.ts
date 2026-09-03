import type { StudentDashboardSubmission, StudentEnrollment } from '@Api/academic/types';

import type { StudentActivityDetails } from '../types';

export function mapStudentActivityDetails(
	enrollment: StudentEnrollment,
	activityId: number,
	submissions: StudentDashboardSubmission[],
	now = new Date(),
): StudentActivityDetails | null {
	const activity = enrollment.activities.find((item) => item.id === activityId);
	if (!activity) return null;

	const submission = submissions.find((item) => item.activityId === activity.id) ?? null;
	const status =
		submission?.grade !== null && submission?.grade !== undefined
			? 'graded'
			: submission
				? 'submitted'
				: activity.dueAt && Date.parse(activity.dueAt) < now.getTime()
					? 'overdue'
					: 'pending';
	const statusLabel = {
		pending: 'Pendente',
		overdue: 'Atrasada',
		submitted: 'Entregue',
		graded: 'Avaliada',
	}[status];
	const isOverdue = status === 'overdue' && activity.dueAt !== null;
	const overdueLabel = isOverdue
		? (() => {
				const elapsedMs = Math.max(0, now.getTime() - Date.parse(activity.dueAt!));
				const totalMinutes = Math.ceil(elapsedMs / (1000 * 60));
				const days = Math.floor(totalMinutes / (60 * 24));
				const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
				const minutes = totalMinutes % 60;
				const parts = [
					days > 0 ? `${days}d` : null,
					hours > 0 ? `${hours}h` : null,
					minutes > 0 ? `${minutes}m` : null,
				].filter((part): part is string => part !== null);
				return parts.length > 0 ? `Atrasada há ${parts.join(' ')}` : 'Atrasada há poucos instantes';
			})()
		: null;
	const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	return {
		activityId: activity.id,
		enrollmentId: enrollment.id,
		subjectTitle: enrollment.classOffering.title,
		subjectCode: enrollment.classOffering.code,
		title: activity.title,
		description: activity.description,
		createdLabel: dateTimeFormatter.format(new Date(activity.createdAt)),
		dueLabel: activity.dueAt
			? dateTimeFormatter.format(new Date(activity.dueAt))
			: 'Sem prazo definido',
		overdueLabel,
		allowLateSubmissions: activity.allowLateSubmissions !== false,
		status,
		statusLabel,
		submission: submission
			? {
					submittedLabel: submission.submittedAt
						? dateTimeFormatter.format(new Date(submission.submittedAt))
						: 'Data não informada',
					grade: submission.grade,
					feedback: submission.feedback,
					attachments: submission.attachments ?? [],
				}
			: null,
	};
}
