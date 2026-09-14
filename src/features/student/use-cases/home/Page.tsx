import { Box, Grid, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';

import { StudentProgressSummary } from '../../components/StudentProgressSummary';
import { studentNavigationPreset } from '../../utils/navigation-routes';
import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';
import {
	StudentActivitiesCard,
	StudentAlertsCard,
	StudentClassesCard,
	StudentInstitutionCard,
	StudentProfileCard,
} from './components';

export function StudentHomePage() {
	const { dashboard } = useMyStudentDashboard();

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 390px' }}
				gap={4}
				alignItems='start'
			>
				<VStack align='stretch' gap={4}>
					<StudentAlertsCard />
					{dashboard ? <StudentProgressSummary dashboard={dashboard} /> : null}
					<StudentClassesCard enrollments={dashboard?.enrollments ?? []} />
					<StudentActivitiesCard
						enrollments={(dashboard?.enrollments ?? []).filter((item) => item.status === 'active')}
						submissions={dashboard?.submissions ?? []}
					/>
				</VStack>

				<VStack align='stretch' gap={4}>
					<Box display={{ base: 'none', xl: 'block' }}>
						<StudentProfileCard profile={dashboard?.profile} userName={dashboard?.userName} />
					</Box>
					<StudentInstitutionCard
						profile={dashboard?.profile}
						courseLevel={dashboard?.courseLevel}
						attendanceSummary={dashboard?.attendanceSummary}
					/>
				</VStack>
			</Grid>
		</NavigationPageShell>
	);
}
