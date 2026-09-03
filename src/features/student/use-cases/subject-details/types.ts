export type SubjectSessionDetails = {
	id: number;
	date: string;
	time: string;
	topic: string;
};

export type SubjectActivityDetails = {
	id: number;
	title: string;
	description: string | null;
	dueLabel: string;
	status: 'pending' | 'overdue' | 'submitted' | 'graded';
	statusLabel: string;
	grade: string | null;
};

export type SubjectDetails = {
	enrollmentId: number;
	title: string;
	code: string;
	period: string;
	shift: string;
	status: string;
	sessions: SubjectSessionDetails[];
	activities: SubjectActivityDetails[];
};
