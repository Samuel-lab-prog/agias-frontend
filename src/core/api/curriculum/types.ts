export type AcademicPeriod = {
	id: number;
	code: string;
	year: number;
	term: number;
	startsAt: string;
	endsAt: string;
};
export type ClassOffering = {
	id: number;
	courseId: number;
	academicPeriodId: number;
	shift: 'morning' | 'afternoon' | 'evening' | 'integral';
	term: string;
	year: number;
	code: string;
	title: string;
};
export type CreateAcademicPeriodBody = Record<string, unknown>;
export type CreateClassOfferingBody = Omit<ClassOffering, 'id'>;

export type CourseOption = { id: number; name: string; code: string };
export type ProfessorOption = { id: number; name: string };
export type StudentOption = {
	id: number;
	name: string;
	academicId: string;
	courseId: number | null;
};
export type StaffClass = ClassOffering & {
	course: CourseOption;
	academicPeriod: AcademicPeriod;
	activeEnrollments: number;
	professors: ProfessorOption[];
};
export type EnrollmentStatus = 'active' | 'completed' | 'cancelled' | 'inactive';
export type StaffEnrollment = {
	id: number;
	studentProfileId: number;
	classOfferingId: number;
	status: EnrollmentStatus;
	student: StudentOption;
};
export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };
export type ClassFilters = {
	page: number;
	q: string;
	academicPeriodId?: number;
	courseId?: number;
};
