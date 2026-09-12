import { createHTTPRequest } from '@Utils';
import type { AdminOverview, AdminPage, AdminProfileBody, AdminRole, AdminStatus, AdminUser, PermissionRow, TeamBody, UnassignedClass } from './types';

export const administration = {
	overview: () => createHTTPRequest<AdminOverview>({ path: '/admin/overview' }),
	users: (query: Record<string, string | number | undefined>) => createHTTPRequest<AdminPage<AdminUser>>({ path: '/admin/users', query }),
	user: (id: number) => createHTTPRequest<AdminUser>({ path: `/admin/users/${id}` }),
	departments: () => createHTTPRequest<Array<{ id: number; name: string; code: string }>>({ path: '/admin/departments' }),
	permissions: () => createHTTPRequest<PermissionRow[]>({ path: '/admin/permissions' }),
	unassignedClasses: () => createHTTPRequest<UnassignedClass[]>({ path: '/admin/unassigned-classes' }),
	createTeam: (body: TeamBody) => createHTTPRequest<AdminUser, TeamBody>({ path: '/admin/team', method: 'POST', body }),
	saveProfile: (id: number, body: AdminProfileBody) => createHTTPRequest<AdminUser, AdminProfileBody>({ path: `/admin/users/${id}/profile`, method: 'PUT', body }),
	saveAccess: (id: number, body: { role: AdminRole; status: Exclude<AdminStatus, 'pending'> }) => createHTTPRequest<AdminUser, typeof body>({ path: `/admin/users/${id}/access`, method: 'PUT', body }),
};
