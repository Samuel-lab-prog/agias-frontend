import { Box, Grid, Link, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';

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
	const initials = dashboard?.userName
		?.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');
	const userName = dashboard?.userName ?? 'Perfil';

	return (
		<NavigationPageShell
			preset={studentNavigationPreset}
			rightContent={
				<Link
					href='#student-profile'
					display={{ base: 'inline-flex', xl: 'none' }}
					alignItems='center'
					gap={2}
					px={2.5}
					py={1.5}
					borderRadius='full'
					border='1px solid'
					borderColor='border'
					color='textMuted'
					_hover={{ bg: 'rgba(255,255,255,0.05)', color: 'accent', textDecoration: 'none' }}
				>
					<Box
						boxSize={7}
						borderRadius='full'
						display='grid'
						placeItems='center'
						bg='rgba(255,255,255,0.08)'
						fontSize='xs'
						fontWeight='bold'
					>
						{initials ?? 'U'}
					</Box>
					<Text textStyle='xs' fontWeight='semibold'>
						{userName}
					</Text>
				</Link>
			}
		>
			<Grid
				templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 390px' }}
				gap={4}
				alignItems='start'
			>
				<VStack align='stretch' gap={4}>
					<StudentAlertsCard />
					<StudentClassesCard enrollments={dashboard?.enrollments ?? []} />
					<StudentActivitiesCard
						enrollments={dashboard?.enrollments ?? []}
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
