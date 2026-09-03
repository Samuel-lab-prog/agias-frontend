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
	const submissionTiming =
		activity.dueAt && submission?.submittedAt
			? (() => {
					const differenceMs =
						Date.parse(activity.dueAt) - new Date(submission.submittedAt).getTime();
					const totalMinutes = Math.max(1, Math.ceil(Math.abs(differenceMs) / (1000 * 60)));
					if (differenceMs === 0) {
						return { label: 'Entregue no prazo', tone: 'success' as const };
					}
					const days = Math.floor(totalMinutes / (60 * 24));
					const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
					const minutes = totalMinutes % 60;
					const parts = [
						days > 0 ? `${days}d` : null,
						hours > 0 ? `${hours}h` : null,
						minutes > 0 ? `${minutes}m` : null,
					].filter((part): part is string => part !== null);
					const duration = parts.join(' ');
					return differenceMs >= 0
						? { label: `Entregue ${duration} antes do prazo`, tone: 'success' as const }
						: { label: `Entregue ${duration} após o prazo`, tone: 'error' as const };
				})()
			: null;

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
		dueAt: activity.dueAt,
		overdueLabel,
		allowLateSubmissions: activity.allowLateSubmissions !== false,
		submissionTiming,
		status,
		statusLabel,
		submission: submission
			? {
					id: submission.id,
					submittedLabel: submission.submittedAt
						? dateTimeFormatter.format(new Date(submission.submittedAt))
						: 'Data não informada',
					grade: submission.grade,
					feedback: submission.feedback,
					attachments: (submission.attachments ?? []).map((attachment) => ({
						fileName: attachment.fileName,
						fileUrl: attachment.fileUrl,
						fileSize: attachment.fileSize,
						contentType: attachment.contentType,
					})),
					comments: (submission.comments ?? []).map((comment) => ({
						id: comment.id,
						body: comment.body,
						createdAt: comment.createdAt,
						authorUserId: comment.authorUserId,
						authorName: comment.authorName,
					})),
				}
			: null,
	};
}
