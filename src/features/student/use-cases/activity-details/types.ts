export type StudentActivityDetails = {
	activityId: number;
	enrollmentId: number;
	subjectTitle: string;
	subjectCode: string;
	title: string;
	description: string | null;
	createdLabel: string;
	dueLabel: string;
	status: 'pending' | 'overdue' | 'submitted' | 'graded';
	statusLabel: string;
	submission: {
		submittedLabel: string;
		grade: string | null;
		feedback: string | null;
		attachments: Array<{ fileName: string; fileUrl: string; fileSize: number | null }>;
	} | null;
};
