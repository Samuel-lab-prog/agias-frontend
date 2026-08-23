import { Grid, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';

import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';
import {
	StudentActivitiesCard,
	StudentAlertsCard,
	StudentClassesCard,
	StudentInstitutionCard,
	StudentProfileCard,
} from './components';
import { studentNavigationPreset } from './navigation';

export function StudentHomePage() {
	const { dashboard } = useMyStudentDashboard();

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<Grid templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 390px' }} gap={4} alignItems='start'>
				<VStack align='stretch' gap={4}>
					<StudentAlertsCard />
					<StudentClassesCard enrollments={dashboard?.enrollments ?? []} />
					<StudentActivitiesCard enrollments={dashboard?.enrollments ?? []} submissions={dashboard?.submissions ?? []} />
				</VStack>

				<VStack align='stretch' gap={4}>
					<StudentProfileCard profile={dashboard?.profile} />
					<StudentInstitutionCard profile={dashboard?.profile} />
				</VStack>
			</Grid>
		</NavigationPageShell>
	);
}
