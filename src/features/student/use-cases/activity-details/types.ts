export type StudentActivityDetails = {
	activityId: number;
	enrollmentId: number;
	subjectTitle: string;
	subjectCode: string;
	title: string;
	description: string | null;
	createdLabel: string;
	dueLabel: string;
	dueAt: string | null;
	overdueLabel: string | null;
	allowLateSubmissions: boolean;
	submissionTiming: { label: string; tone: 'success' | 'error' } | null;
	status: 'pending' | 'overdue' | 'submitted' | 'graded';
	statusLabel: string;
	submission: {
		id: number;
		submittedLabel: string;
		grade: string | null;
		feedback: string | null;
		attachments: Array<{
			fileName: string;
			fileUrl: string;
			fileSize: number | null;
			contentType: string | null;
		}>;
		comments: Array<{
			id: number;
			body: string;
			createdAt: string;
			authorUserId: number;
			authorName: string;
		}>;
	} | null;
};
