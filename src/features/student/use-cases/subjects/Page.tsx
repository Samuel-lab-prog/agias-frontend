import type { StudentEnrollment } from '@Api/academic/types';
import { EmptyStateCard, ErrorStateCard, Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { NavLink } from 'react-router-dom';

import { AcademicPeriodSelector } from '../../components/AcademicPeriodSelector';
import {
	enrollmentLabels,
	periodLabel,
	planProgress,
	shiftLabels,
} from '../../utils/academic-planning';
import { studentNavigationPreset } from '../../utils/navigation-routes';
import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';
import { useStudentPeriods } from '../hooks/useStudentPeriods';

function ClassOfferingCard({
	enrollment,
	period,
}: {
	enrollment: StudentEnrollment;
	period: string;
}) {
	const subject = enrollment.classOffering;
	const progress = planProgress(enrollment);
	return (
		<Surface
			asChild
			variant='soft'
			p={5}
			_hover={{ shadow: 'md' }}
			_focusVisible={{ outline: '2px solid', outlineColor: 'action.primary', outlineOffset: '3px' }}
		>
			<NavLink
				to={`/student/classes/${subject.id}?period=${encodeURIComponent(period)}`}
				aria-label={`Ver detalhes de ${subject.title}`}
			>
				<VStack align='stretch' gap={3}>
					<Box>
						<Text fontSize='xs' color='fg.muted'>
							{subject.code} · {periodLabel(enrollment)}
						</Text>
						<Heading as='h2' fontSize='lg' mt={1}>
							{subject.title}
						</Heading>
					</Box>
					<HStack flexWrap='wrap'>
						<Badge colorPalette='blue'>{shiftLabels[subject.shift]}</Badge>
						<Badge variant='outline'>
							{enrollmentLabels[enrollment.status] ?? enrollment.status}
						</Badge>
					</HStack>
					<Text fontSize='sm'>
						{subject.professors?.map((professor) => professor.name).join(', ') ||
							'Professor ainda não informado'}
					</Text>
					<Text fontSize='sm' color='fg.muted'>
						{progress
							? `${progress.completed} de ${progress.total} tópicos realizados · ${progress.progress}%`
							: 'Planejamento ainda não publicado'}
					</Text>
				</VStack>
			</NavLink>
		</Surface>
	);
}

export function StudentSubjectsPage() {
	const { dashboard, isLoading, isError, refetch } = useMyStudentDashboard();
	const all = dashboard?.enrollments ?? [];
	const { periods, selectedPeriod, setSelectedPeriod } = useStudentPeriods(all);
	const enrollments = all.filter(
		(item) => selectedPeriod === 'all' || periodLabel(item) === selectedPeriod,
	);
	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Box display='flex' justifyContent='space-between' alignItems='end' gap={4} flexWrap='wrap'>
					<Box>
						<Heading as='h1' size='xl'>
							Minhas disciplinas
						</Heading>
						<Text color='fg.muted' mt={1}>
							Planejamento, aulas, materiais e avaliações de cada turma.
						</Text>
					</Box>
					<AcademicPeriodSelector
						periods={periods}
						value={selectedPeriod}
						onChange={setSelectedPeriod}
					/>
				</Box>
				{isLoading ? (
					<Text role='status'>Carregando disciplinas…</Text>
				) : isError ? (
					<ErrorStateCard
						eyebrow='DISCIPLINAS'
						title='Não foi possível carregar suas disciplinas'
						description='Verifique sua conexão e tente novamente.'
						actionLabel='Tentar novamente'
						onAction={() => void refetch()}
					/>
				) : enrollments.length ? (
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						{enrollments.map((item) => (
							<ClassOfferingCard key={item.id} enrollment={item} period={selectedPeriod} />
						))}
					</SimpleGrid>
				) : (
					<EmptyStateCard
						eyebrow='DISCIPLINAS'
						title='Nenhuma disciplina neste período'
						description='Quando houver matrículas disponíveis, elas aparecerão aqui. Você também pode selecionar outro período.'
					/>
				)}
			</VStack>
		</NavigationPageShell>
	);
}
