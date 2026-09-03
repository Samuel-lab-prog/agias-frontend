export type StudentProfile = {
	id: number;
	userId: number;
	academicId: string;
	courseId: number | null;
	admissionYear: number | null;
	status: string;
};

export type ProfessorProfile = {
	id: number;
	userId: number;
	registryCode: string | null;
	departmentId: number | null;
	title: string | null;
	workload: number | null;
};

export type StaffProfile = {
	id: number;
	userId: number;
	departmentId: number | null;
};

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

export type StudentDashboard = {
	profile: StudentProfile;
	userName: string;
	courseLevel: string | null;
	attendanceSummary: StudentDashboardAttendanceSummary;
	enrollments: StudentEnrollment[];
	submissions: StudentDashboardSubmission[];
};

export type StudentDashboardAttendanceSummary = {
	totalRecords: number;
	presentRecords: number;
	percentage: number;
};

export type StudentEnrollment = {
	id: number;
	status: string;
	classOffering: StudentDashboardClassOffering;
	activities: StudentDashboardActivity[];
	sessions: StudentDashboardSession[];
};

export type StudentDashboardClassOffering = {
	id: number;
	title: string;
	code: string;
	year: number;
	term: string;
	shift: 'morning' | 'afternoon' | 'evening' | 'integral';
	courseId: number;
};

export type StudentDashboardActivity = {
	id: number;
	title: string;
	description: string | null;
	dueAt: string | null;
	createdAt: string;
};

export type StudentDashboardSession = {
	id: number;
	startsAt: string;
	endsAt: string | null;
	topic: string | null;
};

export type StudentDashboardSubmission = {
	id: number;
	activityId: number;
	submittedAt: string | null;
	grade: string | null;
	feedback: string | null;
	attachments?: StudentSubmissionAttachment[];
};

export type StudentSubmissionAttachment = {
	id: number;
	submissionId: number;
	fileName: string;
	fileUrl: string;
	fileKey?: string;
	contentType: string | null;
	fileSize: number | null;
};

export type CreateStudentProfileBody = Record<string, unknown>;
export type CreateProfessorProfileBody = Record<string, unknown>;
export type CreateStaffProfileBody = Record<string, unknown>;
export type UpdateStudentProfileBody = Record<string, unknown>;
export type UpdateProfessorProfileBody = Record<string, unknown>;
export type UpdateStaffProfileBody = Record<string, unknown>;
export type LinkStudentToCourseBody = Record<string, unknown>;
export type LinkProfessorToDepartmentBody = Record<string, unknown>;
export type UnlinkStudentFromCourseBody = Record<string, unknown>;
export type UnlinkProfessorFromDepartmentBody = Record<string, unknown>;
export type CreateAcademicActivityAttachmentUploadUrlBody = Record<string, unknown>;
export type CreateAcademicActivityAttachmentUploadUrlResponse = Record<string, unknown>;
export type CreateStudentActivitySubmissionUploadBody = {
	activityId: number;
	fileName: string;
	contentType?: string;
	contentLength?: number;
};
export type CreateStudentActivitySubmissionUploadResponse = {
	uploadUrl: string;
	fields: Record<string, string>;
	fileUrl: string;
};
export type CreateStudentActivitySubmissionBody = {
	activityId: number;
	studentProfileId: number;
	attachments?: Array<{
		fileName: string;
		fileUrl: string;
		fileKey?: string;
		contentType?: string;
		fileSize?: number;
	}>;
};
