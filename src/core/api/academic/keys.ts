import { createQueryKeys } from '@Api/utils';

export const academicKeys = createQueryKeys({
	myStudentProfile: () => ['academic', 'students', 'profile', 'me'] as const,
	myProfessorProfile: () => ['academic', 'professors', 'profile', 'me'] as const,
	myStaffProfile: () => ['academic', 'staff', 'profile', 'me'] as const,
	studentProfileByUserId: (userId: string) => ['academic', 'students', 'profile', userId] as const,
	activitiesByClassOffering: (classOfferingId: string) =>
		['academic', 'activities', classOfferingId] as const,
	submissionsByStudentProfile: (studentProfileId: string) =>
		['academic', 'submissions', studentProfileId] as const,
	attendanceByClassSession: (classSessionId: string) =>
		['academic', 'attendance', 'class-sessions', classSessionId] as const,
	attendanceByStudentProfile: (studentProfileId: string) =>
		['academic', 'attendance', 'students', studentProfileId] as const,
	classSessionsByClassOffering: (classOfferingId: string) =>
		['academic', 'class-sessions', classOfferingId] as const,
});
