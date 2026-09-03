import { BaseButton } from '@BaseComponents';
import { NavigationPageShell } from '@core/components/navigation';
import { ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';
import { StudentAlertsCard } from '../home/components/StudentAlertsCard';

export function StudentAnnouncementsPage() {
	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<BaseButton asChild size='sm' variant='secondary' alignSelf='flex-start' mb={4}>
				<NavLink to='/student'>
					<ArrowLeft size={16} />
					Voltar ao início
				</NavLink>
			</BaseButton>
			<StudentAlertsCard limit={null} showAllAction={false} title='Todos os comunicados' />
		</NavigationPageShell>
	);
}
