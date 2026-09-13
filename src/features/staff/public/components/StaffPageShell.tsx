import { NavigationPageShell as PageShell } from '@core/components/navigation';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import type { ComponentProps } from 'react';

import { adminNavigationPreset } from '../../../admin/use-cases/home/navigation';
export function StaffPageShell(props: ComponentProps<typeof PageShell>) {
	const role = useAuthClientStore((s) => s.authClient?.role);
	return <PageShell {...props} preset={role === 'admin' ? adminNavigationPreset : props.preset} />;
}
