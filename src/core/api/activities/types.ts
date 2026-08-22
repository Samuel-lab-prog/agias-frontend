export type AcademicActivity = {
	id: number;
	classOfferingId: number;
	title: string;
	description: string | null;
	dueAt: string | null;
};

export type AcademicActivitySubmission = {
	id: number;
	activityId: number;
	studentProfileId: number;
	submittedAt: string;
};

export type CreateAcademicActivityBody = Record<string, unknown>;
export type CreateAcademicActivitySubmissionBody = Record<string, unknown>;
