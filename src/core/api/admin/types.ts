export type AdminRole = 'admin' | 'staff' | 'professor' | 'student';
export type AdminStatus = 'active' | 'pending' | 'blocked' | 'suspended';
export type AdminUser = {
	id: number; name: string; email: string; nickname: string; role: AdminRole; status: AdminStatus; createdAt: string;
	professorProfile: { id: number; registryCode: string | null; title: string | null; workload: number | null; departmentId: number | null; department: { name: string } | null; _count: { teachingAssignments: number } } | null;
	staffProfile: { id: number; departmentId: number | null; department: { name: string } | null } | null;
	studentProfile: { id: number; academicId: string; course: { name: string } | null } | null;
};
export type AdminPage<T> = { items: T[]; total: number; page: number; pageSize: number };
export type AdminOverview = { roles: Partial<Record<AdminRole, number>>; statuses: Partial<Record<AdminStatus, number>>; incomplete: number; unassigned: number; classesWithoutProfessor: number };
export type ProfessionalBody = { departmentId: number | null; registryCode: string | null; title: string | null; workload: number | null };
export type AdminProfileBody = ProfessionalBody & { name: string; email: string };
export type TeamBody = AdminProfileBody & { nickname: string; password: string; cpf: string; rg: string; role: Exclude<AdminRole, 'student'>; avatarUrl: null };
export type PermissionRow = { title: string; description: string; roles: AdminRole[] };
export type UnassignedClass = { id: number; title: string; code: string; academicPeriod: { code: string } };
