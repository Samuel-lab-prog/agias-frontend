import { NavigationPageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import type { ReactNode } from 'react';

import { adminNavigationPreset } from '../../admin/use-cases/home/navigation';
import { professorNavigationPreset } from '../../professor/use-cases/home/navigation';
import { staffNavigationPreset } from '../../staff/use-cases/home/navigation';
import { studentNavigationPreset } from '../../student/utils/navigation-routes';
export function ServicesShell({ children }: { children: ReactNode }) {
	const role = useAuthClientStore((s) => s.authClient?.role);
	const preset =
		role === 'admin'
			? adminNavigationPreset
			: role === 'staff'
				? staffNavigationPreset
				: role === 'professor'
					? professorNavigationPreset
					: studentNavigationPreset;
	return <NavigationPageShell preset={preset}>{children}</NavigationPageShell>;
}
