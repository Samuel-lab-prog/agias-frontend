import { BaseButton, EmptyStateCard, ErrorStateCard } from '@BaseComponents';
import { Grid } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { BookX } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';
import {
	SubjectActivities,
	SubjectDetailsSkeleton,
	SubjectHeader,
	SubjectSchedule,
} from './components';
import { useSubjectDetails } from './hooks/useSubjectDetails';

function BackToDashboardButton() {
	return (
		<BaseButton asChild size='sm' variant='secondary'>
			<NavLink to='/student'>Voltar ao início</NavLink>
		</BaseButton>
	);
}

export function StudentSubjectDetailsPage() {
	const { details, isLoading, isError, isInvalidId, isNotFound, refetch } = useSubjectDetails();

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			{isLoading ? <SubjectDetailsSkeleton /> : null}
			{isError ? (
				<ErrorStateCard
					eyebrow='DISCIPLINA'
					title='Não foi possível carregar os detalhes'
					description='Verifique sua conexão e tente novamente.'
					actionLabel='Tentar novamente'
					onAction={() => void refetch()}
				/>
			) : null}
			{!isLoading && !isError && (isInvalidId || isNotFound) ? (
				<EmptyStateCard
					eyebrow='DISCIPLINA'
					eyebrowIcon={BookX}
					title='Disciplina não encontrada'
					description='Esta matrícula não existe ou não está vinculada ao seu perfil.'
					action={<BackToDashboardButton />}
				/>
			) : null}
			{details ? (
				<>
					<SubjectHeader details={details} />
					<Grid
						templateColumns={{ base: '1fr', lg: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' }}
						gap={4}
						alignItems='start'
					>
						<SubjectSchedule sessions={details.sessions} />
						<SubjectActivities activities={details.activities} />
					</Grid>
				</>
			) : null}
		</NavigationPageShell>
	);
}
