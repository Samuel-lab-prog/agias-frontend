import { createMutationEndpoint, createQueryEndpoint } from '@Api/utils';
import { createHTTPRequest } from '@Utils';

import { attendanceKeys } from './keys';
import type { AttendanceRecord, MarkAttendanceBatchBody, MarkAttendanceBody } from './types';

const getByClassSession = createQueryEndpoint<[string], AttendanceRecord[]>({
	key: attendanceKeys.byClassSession,
	fn: (classSessionId) =>
		createHTTPRequest<AttendanceRecord[]>({
			method: 'GET',
			path: `/attendance/class-sessions/${classSessionId}/records`,
		}),
});

const getByStudentProfile = createQueryEndpoint<[string], AttendanceRecord[]>({
	key: attendanceKeys.byStudentProfile,
	fn: (studentProfileId) =>
		createHTTPRequest<AttendanceRecord[]>({
			method: 'GET',
			path: `/attendance/students/${studentProfileId}/records`,
		}),
});

const markAttendance = createMutationEndpoint<MarkAttendanceBody, AttendanceRecord>({
	fn: (data) =>
		createHTTPRequest<AttendanceRecord, MarkAttendanceBody>({
			method: 'POST',
			path: '/attendance/',
			body: data,
		}),
});

const markAttendanceBatch = createMutationEndpoint<MarkAttendanceBatchBody, AttendanceRecord[]>({
	fn: (data) =>
		createHTTPRequest<AttendanceRecord[], MarkAttendanceBatchBody>({
			method: 'POST',
			path: '/attendance/batch',
			body: data,
		}),
});

const deleteAttendance = createMutationEndpoint<Record<string, unknown>, AttendanceRecord>({
	fn: (data) =>
		createHTTPRequest<AttendanceRecord>({
			method: 'DELETE',
			path: `/attendance/${String((data as Record<string, unknown>).classSessionId ?? '')}/students/${String((data as Record<string, unknown>).studentProfileId ?? '')}`,
		}),
});

export const attendance = {
	getByClassSession,
	getByStudentProfile,
	markAttendance,
	markAttendanceBatch,
	deleteAttendance,
};
