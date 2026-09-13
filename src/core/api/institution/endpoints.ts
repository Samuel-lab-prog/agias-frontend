import { createHTTPRequest } from '@Utils';
export type InstitutionContext = {
	id: number;
	name: string;
	email: string;
	avatarUrl: string | null;
	role: 'admin' | 'staff' | 'professor' | 'student';
	campusId: number;
	campus: {
		id: number;
		institutionId: number;
		name: string;
		city: string;
		state: string;
		address: string;
		institution: { id: number; name: string; acronym: string; configured: boolean };
	};
	staffProfile: { id: number; department: { name: string; code: string } | null } | null;
};
export type IdentityBody = {
	institutionName: string;
	acronym: string;
	campusName: string;
	city: string;
	state: string;
	address: string;
};
export const institution = {
	context: () => createHTTPRequest<InstitutionContext>({ path: '/institution/context' }),
	saveIdentity: (body: IdentityBody) =>
		createHTTPRequest<{ success: boolean }, IdentityBody>({
			path: '/institution/identity',
			method: 'PUT',
			body,
		}),
};
