export type StudentProfile = {
	id: number;
	userId: number;
	academicId: string;
	courseId: number | null;
	admissionYear: number | null;
	status: string;
	birthDate?: string | null;
	gender?: string | null;
	genderIdentity?: string | null;
	sexualOrientation?: string | null;
	race?: string | null;
	nationality?: string | null;
	birthplace?: string | null;
	birthCountry?: string | null;
	maritalStatus?: string | null;
	bloodType?: string | null;
	disability?: string | null;
	fatherName?: string | null;
	motherName?: string | null;
	postalCode?: string | null;
	street?: string | null;
	addressNumber?: string | null;
	addressComplement?: string | null;
	neighborhood?: string | null;
	state?: string | null;
	city?: string | null;
	phone?: string | null;
	mobilePhone?: string | null;
	familyIncome?: number | null;
	socioeconomicStatus?: string | null;
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
	allowLateSubmissions?: boolean;
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
	allowLateSubmissions?: boolean;
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
	comments?: StudentSubmissionComment[];
};

export type AcademicCalendarEvent = {
	id: number;
	academicPeriodId: number;
	type: 'holiday' | 'academic_event' | 'instructional_saturday' | 'exam' | 'break';
	title: string;
	description: string | null;
	startsAt: string;
	endsAt: string | null;
	allDay: boolean;
	isInstructionalDay: boolean;
};

export type StudentSubmissionComment = {
	id: number;
	submissionId: number;
	authorUserId: number;
	authorName: string;
	body: string;
	createdAt: string;
	updatedAt: string;
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
export type CreateStudentActivitySubmissionCommentBody = {
	submissionId: number;
	body: string;
};
