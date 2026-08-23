import type { UserRole } from '@Api/users/types';
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthClientStore } from '../stores/useAuthClientStore';

type RoleGateProps = {
	allowedRoles: UserRole[];
	children: ReactNode;
};

function getDefaultRedirectRole(role: UserRole): string {
	return `/${role}`;
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
	const location = useLocation();
	const authClient = useAuthClientStore((state) => state.authClient);

	if (!authClient) {
		return <Navigate to='/login' replace state={{ from: location }} />;
	}

	if (!allowedRoles.includes(authClient.role)) {
		return <Navigate to={getDefaultRedirectRole(authClient.role)} replace />;
	}

	return <>{children}</>;
}
