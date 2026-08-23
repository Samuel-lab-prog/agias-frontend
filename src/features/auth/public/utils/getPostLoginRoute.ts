import type { AuthClient } from '@Api/auth/types';

export function getPostLoginRoute(authClient: Pick<AuthClient, 'role'> | null | undefined): string {
	const role = authClient?.role;

	if (role === 'staff') return '/staff';
	if (role === 'admin') return '/admin';
	if (role === 'professor') return '/professor';
	if (role === 'student') return '/student';

	return '/login';
}
