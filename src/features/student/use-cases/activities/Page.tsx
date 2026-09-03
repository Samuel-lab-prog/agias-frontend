import { BaseButton } from '@BaseComponents';
import { NavigationPageShell } from '@core/components/navigation';
import { ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';
import { StudentActivitiesCard } from '../home/components/StudentActivitiesCard';
import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';

export function StudentActivitiesPage() {
	const { dashboard } = useMyStudentDashboard();

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<BaseButton asChild size='sm' variant='secondary' alignSelf='flex-start' mb={4}>
				<NavLink to='/student'>
					<ArrowLeft size={16} />
					Voltar ao início
				</NavLink>
			</BaseButton>
			<StudentActivitiesCard
				enrollments={dashboard?.enrollments ?? []}
				submissions={dashboard?.submissions ?? []}
				limit={null}
				title='Todas as atividades'
				showAllAction={false}
			/>
		</NavigationPageShell>
	);
}
