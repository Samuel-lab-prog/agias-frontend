import { NavigationPageShell } from '@core/components/navigation';
import { useLocation } from 'react-router-dom';

import { PermissionsPage } from '../permissions/Page';
import { UserDetailsPage } from '../users/DetailsPage';
import { UsersPage } from '../users/Page';
import { Dashboard } from './Dashboard';
import { adminNavigationPreset } from './navigation';
import { PendingClasses } from './PendingClasses';
export function AdminHomePage() {
	const { pathname } = useLocation();
	const content =
		pathname === '/admin/team/new' ? (
			<UserDetailsPage create />
		) : /^\/admin\/users\/\d+$/.test(pathname) ? (
			<UserDetailsPage />
		) : pathname === '/admin/team' ? (
			<UsersPage team />
		) : pathname === '/admin/users' ? (
			<UsersPage />
		) : pathname === '/admin/permissions' ? (
			<PermissionsPage />
		) : pathname === '/admin/pending-classes' ? (
			<PendingClasses />
		) : (
			<Dashboard />
		);
	return <NavigationPageShell preset={adminNavigationPreset}>{content}</NavigationPageShell>;
}
