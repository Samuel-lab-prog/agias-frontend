import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { academicKeys } from './keys';
import type {
	AcademicActivity,
	AcademicActivitySubmission,
	CreateAcademicActivityAttachmentUploadUrlBody,
	CreateAcademicActivityAttachmentUploadUrlResponse,
	CreateProfessorProfileBody,
	CreateStaffProfileBody,
	CreateStudentProfileBody,
	LinkProfessorToDepartmentBody,
	LinkStudentToCourseBody,
	ProfessorProfile,
	StaffProfile,
	StudentProfile,
	UnlinkProfessorFromDepartmentBody,
	UnlinkStudentFromCourseBody,
	UpdateProfessorProfileBody,
	UpdateStaffProfileBody,
	UpdateStudentProfileBody,
} from './types';

const getMyStudentProfile = createQueryEndpoint<[], StudentProfile>({
	key: academicKeys.myStudentProfile,
	fn: () => createHTTPRequest<StudentProfile>({ method: 'GET', path: '/academic/students/profile/me' }),
});

const getMyProfessorProfile = createQueryEndpoint<[], ProfessorProfile>({
	key: academicKeys.myProfessorProfile,
	fn: () =>
		createHTTPRequest<ProfessorProfile>({ method: 'GET', path: '/academic/professors/profile/me' }),
});

const getMyStaffProfile = createQueryEndpoint<[], StaffProfile>({
	key: academicKeys.myStaffProfile,
	fn: () => createHTTPRequest<StaffProfile>({ method: 'GET', path: '/academic/staff/profile/me' }),
});

const getStudentProfileByUserId = createQueryEndpoint<[string], StudentProfile>({
	key: academicKeys.studentProfileByUserId,
	fn: (userId) =>
		createHTTPRequest<StudentProfile>({
			method: 'GET',
			path: `/academic/students/profile/${userId}`,
		}),
});

const getActivitiesByClassOffering = createQueryEndpoint<[string], AcademicActivity[]>({
	key: academicKeys.activitiesByClassOffering,
	fn: (classOfferingId) =>
		createHTTPRequest<AcademicActivity[]>({
			method: 'GET',
			path: `/activities/class-offerings/${classOfferingId}`,
		}),
});

const getSubmissionsByStudentProfile = createQueryEndpoint<[string], AcademicActivitySubmission[]>({
	key: academicKeys.submissionsByStudentProfile,
	fn: (studentProfileId) =>
		createHTTPRequest<AcademicActivitySubmission[]>({
			method: 'GET',
			path: `/activities/students/${studentProfileId}/submissions`,
		}),
});

const getAttendanceByClassSession = createQueryEndpoint<[string], unknown[]>({
	key: academicKeys.attendanceByClassSession,
	fn: (classSessionId) =>
		createHTTPRequest<unknown[]>({
			method: 'GET',
			path: `/attendance/class-sessions/${classSessionId}/records`,
		}),
});

const getAttendanceByStudentProfile = createQueryEndpoint<[string], unknown[]>({
	key: academicKeys.attendanceByStudentProfile,
	fn: (studentProfileId) =>
		createHTTPRequest<unknown[]>({
			method: 'GET',
			path: `/attendance/students/${studentProfileId}/records`,
		}),
});

const getClassSessionsByClassOffering = createQueryEndpoint<[string], unknown[]>({
	key: academicKeys.classSessionsByClassOffering,
	fn: (classOfferingId) =>
		createHTTPRequest<unknown[]>({
			method: 'GET',
			path: `/schedule/class-offerings/${classOfferingId}/sessions`,
		}),
});

const createStudentProfile = createMutationEndpoint<CreateStudentProfileBody, StudentProfile>({
	fn: (data) =>
		createHTTPRequest<StudentProfile, CreateStudentProfileBody>({
			method: 'POST',
			path: '/academic/students/profile',
			body: data,
		}),
});

const createProfessorProfile = createMutationEndpoint<CreateProfessorProfileBody, ProfessorProfile>({
	fn: (data) =>
		createHTTPRequest<ProfessorProfile, CreateProfessorProfileBody>({
			method: 'POST',
			path: '/academic/professors/profile',
			body: data,
		}),
});

const createStaffProfile = createMutationEndpoint<CreateStaffProfileBody, StaffProfile>({
	fn: (data) =>
		createHTTPRequest<StaffProfile, CreateStaffProfileBody>({
			method: 'POST',
			path: '/academic/staff/profile',
			body: data,
		}),
});

const updateStudentProfile = createMutationEndpoint<UpdateStudentProfileBody, StudentProfile>({
	fn: (data) =>
		createHTTPRequest<StudentProfile, UpdateStudentProfileBody>({
			method: 'PUT',
			path: '/academic/students/profile/me',
			body: data,
		}),
});

const updateProfessorProfile = createMutationEndpoint<UpdateProfessorProfileBody, ProfessorProfile>({
	fn: (data) =>
		createHTTPRequest<ProfessorProfile, UpdateProfessorProfileBody>({
			method: 'PUT',
			path: '/academic/professors/profile/me',
			body: data,
		}),
});

const updateStaffProfile = createMutationEndpoint<UpdateStaffProfileBody, StaffProfile>({
	fn: (data) =>
		createHTTPRequest<StaffProfile, UpdateStaffProfileBody>({
			method: 'PUT',
			path: '/academic/staff/profile/me',
			body: data,
		}),
});

const linkStudentToCourse = createMutationEndpoint<LinkStudentToCourseBody, StudentProfile>({
	fn: (data) =>
		createHTTPRequest<StudentProfile, LinkStudentToCourseBody>({
			method: 'PUT',
			path: '/academic/students/profile/me/course',
			body: data,
		}),
});

const linkProfessorToDepartment = createMutationEndpoint<
	LinkProfessorToDepartmentBody,
	ProfessorProfile
>({
	fn: (data) =>
		createHTTPRequest<ProfessorProfile, LinkProfessorToDepartmentBody>({
			method: 'PUT',
			path: '/academic/professors/profile/me/department',
			body: data,
		}),
});

const unlinkStudentFromCourse = createMutationEndpoint<UnlinkStudentFromCourseBody, StudentProfile>({
	fn: () =>
		createHTTPRequest<StudentProfile>({
			method: 'PUT',
			path: '/academic/students/profile/me/course/unlink',
		}),
});

const unlinkProfessorFromDepartment = createMutationEndpoint<
	UnlinkProfessorFromDepartmentBody,
	ProfessorProfile
>({
	fn: () =>
		createHTTPRequest<ProfessorProfile>({
			method: 'PUT',
			path: '/academic/professors/profile/me/department/unlink',
		}),
});

const createAcademicActivityAttachmentUploadUrl = createMutationEndpoint<
	CreateAcademicActivityAttachmentUploadUrlBody,
	CreateAcademicActivityAttachmentUploadUrlResponse
>({
	fn: (data) =>
		createHTTPRequest<
			CreateAcademicActivityAttachmentUploadUrlResponse,
			CreateAcademicActivityAttachmentUploadUrlBody
		>({
			method: 'POST',
			path: '/academic/activities/:activityId/attachments/upload-url',
			body: data,
		}),
});

export const academic = {
	getMyStudentProfile,
	getMyProfessorProfile,
	getMyStaffProfile,
	getStudentProfileByUserId,
	getActivitiesByClassOffering,
	getSubmissionsByStudentProfile,
	getAttendanceByClassSession,
	getAttendanceByStudentProfile,
	getClassSessionsByClassOffering,
	createStudentProfile,
	createProfessorProfile,
	createStaffProfile,
	updateStudentProfile,
	updateProfessorProfile,
	updateStaffProfile,
	linkStudentToCourse,
	linkProfessorToDepartment,
	unlinkStudentFromCourse,
	unlinkProfessorFromDepartment,
	createAcademicActivityAttachmentUploadUrl,
};
