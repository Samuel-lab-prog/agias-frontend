import { createHTTPRequest } from '@Utils';

import type {
	ClassFilters,
	ClassOffering,
	CourseOption,
	CreateClassOfferingBody,
	EnrollmentStatus,
	Paged,
	ProfessorOption,
	StaffClass,
	StaffEnrollment,
	StudentOption,
} from './types';

const base = '/curriculum';
const classPath = (id: number) => `${base}/class-offerings/${id}`;
export const staffCurriculumKeys = { all: ['curriculum', 'staff'] as const };
export const staffCurriculum = {
	classes: (query: ClassFilters) =>
		createHTTPRequest<Paged<StaffClass>>({ path: `${base}/class-offerings`, query }),
	classDetail: (id: number) => createHTTPRequest<StaffClass>({ path: classPath(id) }),
	courses: () => createHTTPRequest<CourseOption[]>({ path: `${base}/courses` }),
	create: (body: CreateClassOfferingBody) =>
		createHTTPRequest<ClassOffering, CreateClassOfferingBody>({
			path: `${base}/class-offerings`,
			method: 'POST',
			body,
		}),
	update: (id: number, body: Pick<ClassOffering, 'title' | 'code' | 'shift'>) =>
		createHTTPRequest<ClassOffering, typeof body>({ path: classPath(id), method: 'PUT', body }),
	students: (query: { q: string; page: number; courseId: number }) =>
		createHTTPRequest<Paged<StudentOption>>({ path: `${base}/students`, query }),
	professors: (query: { q: string; page: number }) =>
		createHTTPRequest<Paged<ProfessorOption>>({ path: `${base}/professors`, query }),
	roster: (id: number, query: { q: string; page: number }) =>
		createHTTPRequest<Paged<StaffEnrollment>>({ path: `${classPath(id)}/enrollments`, query }),
	enroll: (id: number, studentProfileId: number) =>
		createHTTPRequest<Omit<StaffEnrollment, 'student'>, { studentProfileId: number }>({
			path: `${classPath(id)}/enrollments`,
			method: 'POST',
			body: { studentProfileId },
		}),
	status: (classId: number, enrollmentId: number, status: EnrollmentStatus) =>
		createHTTPRequest<Omit<StaffEnrollment, 'student'>, { status: EnrollmentStatus }>({
			path: `${classPath(classId)}/enrollments/${enrollmentId}`,
			method: 'PATCH',
			body: { status },
		}),
	assign: (id: number, professorProfileId: number) =>
		createHTTPRequest<ProfessorOption, { professorProfileId: number }>({
			path: `${classPath(id)}/professors`,
			method: 'POST',
			body: { professorProfileId },
		}),
	unassign: (id: number, professorId: number) =>
		createHTTPRequest<{ success: boolean }>({
			path: `${classPath(id)}/professors/${professorId}`,
			method: 'DELETE',
		}),
};
