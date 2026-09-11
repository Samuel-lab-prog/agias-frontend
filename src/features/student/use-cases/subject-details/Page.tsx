import { BaseButton, EmptyStateCard, ErrorStateCard } from '@BaseComponents';
import { Grid, HStack, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';
import {
	SubjectActivities,
	SubjectDetailsSkeleton,
	SubjectHeader,
	SubjectPlan,
	SubjectSchedule,
} from './components';
import { SubjectAssessments } from './components/SubjectAssessments';
import { useSubjectDetails } from './hooks/useSubjectDetails';

export function StudentSubjectDetailsPage() {
	const { details, isLoading, isError, isInvalidId, isNotFound, refetch } = useSubjectDetails();
	const { pathname } = useLocation();
	const [params] = useSearchParams();
	const section = pathname.endsWith('/plan')
		? 'plan'
		: pathname.endsWith('/activities')
			? 'activities'
			: pathname.endsWith('/assessments')
				? 'assessments'
				: 'overview';
	const period = params.get('period') ?? details?.period ?? 'all';
	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			{isLoading ? (
				<SubjectDetailsSkeleton />
			) : isError ? (
				<ErrorStateCard
					eyebrow='DISCIPLINA'
					title='Não foi possível carregar os detalhes'
					description='Verifique sua conexão e tente novamente.'
					actionLabel='Tentar novamente'
					onAction={() => void refetch()}
				/>
			) : isInvalidId || isNotFound ? (
				<EmptyStateCard
					eyebrow='DISCIPLINA'
					title='Disciplina não encontrada'
					description='Esta turma não existe ou não está vinculada ao seu perfil.'
					action={
						<BaseButton asChild variant='secondary'>
							<NavLink to='/student/classes'>Voltar às disciplinas</NavLink>
						</BaseButton>
					}
				/>
			) : details ? (
				<VStack align='stretch' gap={4}>
					<SubjectHeader details={details} period={period} />
					<HStack as='nav' aria-label='Seções da disciplina' flexWrap='wrap' gap={2}>
						{[
							['overview', '', 'Visão geral'],
							['plan', '/plan', 'Planejamento'],
							['activities', '/activities', 'Atividades'],
							['assessments', '/assessments', 'Avaliações'],
						].map(([value, path, label]) => (
							<BaseButton
								asChild
								key={value}
								size='sm'
								variant={section === value ? 'primary' : 'secondary'}
							>
								<NavLink
									end
									to={`/student/classes/${details.classOfferingId}${path}?period=${encodeURIComponent(period)}`}
								>
									{label}
								</NavLink>
							</BaseButton>
						))}
						<BaseButton asChild size='sm' variant='secondary'>
							<NavLink to={`/student/schedule?period=${encodeURIComponent(period)}`}>
								Ver agenda
							</NavLink>
						</BaseButton>
					</HStack>
					{section === 'plan' ? (
						<SubjectPlan plan={details.plan} />
					) : section === 'activities' ? (
						<SubjectActivities
							activities={details.activities.filter((item) => item.kind !== 'assessment')}
							enrollmentId={details.enrollmentId}
						/>
					) : section === 'assessments' ? (
						<SubjectAssessments
							assessments={details.activities.filter((item) => item.kind === 'assessment')}
						/>
					) : (
						<Grid
							templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }}
							gap={4}
							alignItems='start'
						>
							<VStack align='stretch' gap={4}>
								<SubjectPlan plan={details.plan} />
								<SubjectActivities
									activities={details.activities.filter((item) => item.kind !== 'assessment')}
									enrollmentId={details.enrollmentId}
								/>
								<SubjectAssessments
									assessments={details.activities.filter((item) => item.kind === 'assessment')}
								/>
							</VStack>
							<SubjectSchedule sessions={details.sessions} />
						</Grid>
					)}
				</VStack>
			) : null}
		</NavigationPageShell>
	);
}
