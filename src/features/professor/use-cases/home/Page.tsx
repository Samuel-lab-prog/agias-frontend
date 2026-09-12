import { NavigationPageShell } from '@core/components/navigation';
import { useLocation } from 'react-router-dom';

import { ActivitiesPage } from '../activities/Page';
import { CalendarPage } from '../calendar/Page';
import { ClassDetailsPage } from '../classes/DetailsPage';
import { ClassesPage } from '../classes/Page';
import { MaterialsPage } from '../materials/Page';
import { ProfilePage } from '../profile/Page';
import { Dashboard } from './Dashboard';
import { professorNavigationPreset } from './navigation';

export function ProfessorHomePage() {
	const { pathname } = useLocation();
	const pages = {
		'/professor': <Dashboard />,
		'/professor/classes': <ClassesPage />,
		'/professor/activities': <ActivitiesPage />,
		'/professor/calendar': <CalendarPage />,
		'/professor/materials': <MaterialsPage />,
		'/professor/profile': <ProfilePage />,
	};
	const content = pathname.startsWith('/professor/classes/') ? (
		<ClassDetailsPage />
	) : (
		pages[pathname as keyof typeof pages]
	);
	return <NavigationPageShell preset={professorNavigationPreset}>{content}</NavigationPageShell>;
}
