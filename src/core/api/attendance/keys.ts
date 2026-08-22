import { createQueryKeys } from '@Api/utils';

export const attendanceKeys = createQueryKeys({
	byClassSession: (classSessionId: string) =>
		['attendance', 'class-sessions', classSessionId, 'records'] as const,
	byStudentProfile: (studentProfileId: string) =>
		['attendance', 'students', studentProfileId, 'records'] as const,
});
