import type { StudentDashboardActivity, StudentDashboardSession } from '@Api/academic/types';

import type { planProgress } from '../../utils/academic-planning';

export type SubjectSessionDetails = StudentDashboardSession & {
	date: string;
	time: string;
	topic: string;
};
export type SubjectActivityDetails = StudentDashboardActivity & {
	dueLabel: string;
	status: 'pending' | 'overdue' | 'submitted' | 'graded';
	statusLabel: string;
	grade: string | null;
};
export type SubjectDetails = {
	enrollmentId: number;
	classOfferingId: number;
	title: string;
	code: string;
	period: string;
	shift: string;
	status: string;
	professors: string;
	sessions: SubjectSessionDetails[];
	activities: SubjectActivityDetails[];
	plan: ReturnType<typeof planProgress>;
};
