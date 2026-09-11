import type { StudentEnrollment } from '@Api/academic/types';
import {
	BaseButton,
	EmptyStateCard,
	ErrorStateCard,
	getStaggeredEntryAnimationStyle,
	Surface,
} from '@BaseComponents';
import {
	Badge,
	Box,
	Heading,
	HStack,
	Input,
	InputGroup,
	Progress,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { interactiveStyles } from '@core/themes/motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useState } from 'react';
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
	index,
}: {
	enrollment: StudentEnrollment;
	period: string;
	index: number;
}) {
	const subject = enrollment.classOffering;
	const progress = planProgress(enrollment);
	return (
		<Surface asChild variant='soft' p={5} interactive {...getStaggeredEntryAnimationStyle(index)}>
			<NavLink
				to={`/student/classes/${subject.id}?period=${encodeURIComponent(period)}`}
				aria-label={`Ver detalhes de ${subject.title}`}
			>
				<VStack align='stretch' gap={3} h='full'>
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
					{progress ? (
						<Progress.Root
							value={progress.progress}
							size='xs'
							colorPalette='blue'
							aria-label={`Progresso em ${subject.title}`}
						>
							<Progress.Track borderRadius='full'>
								<Progress.Range />
							</Progress.Track>
						</Progress.Root>
					) : null}
					<HStack
						justify='space-between'
						color='action.primary'
						fontSize='sm'
						fontWeight='semibold'
						mt='auto'
						pt={1}
					>
						<Text>Ver disciplina</Text>
						<ArrowUpRight size={18} aria-hidden='true' />
					</HStack>
				</VStack>
			</NavLink>
		</Surface>
	);
}

export function StudentSubjectsPage() {
	const { dashboard, isLoading, isError, refetch } = useMyStudentDashboard();
	const all = dashboard?.enrollments ?? [];
	const { periods, selectedPeriod, setSelectedPeriod } = useStudentPeriods(all);
	const [search, setSearch] = useState('');
	const normalize = (value: string) =>
		value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLocaleLowerCase('pt-BR');
	const query = normalize(search.trim());
	const enrollments = all.filter(
		(item) =>
			(selectedPeriod === 'all' || periodLabel(item) === selectedPeriod) &&
			normalize(
				[
					item.classOffering.title,
					item.classOffering.code,
					...(item.classOffering.professors?.map((professor) => professor.name) ?? []),
				].join(' '),
			).includes(query),
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
				<Box>
					<Text asChild display='block' fontSize='xs' fontWeight='bold' mb={1}>
						<label htmlFor='subject-search'>Buscar disciplina</label>
					</Text>
					<InputGroup startElement={<Search size={18} aria-hidden='true' />}>
						<Input
							id='subject-search'
							{...interactiveStyles.field}
							minH='44px'
							type='search'
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder='Nome, código ou professor'
						/>
					</InputGroup>
					<HStack justify='space-between' mt={2} minH='36px'>
						<Text color='fg.muted' fontSize='sm' role='status'>
							{!isLoading && !isError
								? `${enrollments.length} disciplina${enrollments.length === 1 ? '' : 's'}`
								: ''}
						</Text>
						{search || selectedPeriod !== 'all' ? (
							<BaseButton
								size='sm'
								variant='subtle'
								onClick={() => {
									setSearch('');
									setSelectedPeriod('all');
								}}
							>
								<X size={14} />
								Limpar filtros
							</BaseButton>
						) : null}
					</HStack>
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
						{enrollments.map((item, index) => (
							<ClassOfferingCard
								key={item.id}
								enrollment={item}
								period={selectedPeriod}
								index={index}
							/>
						))}
					</SimpleGrid>
				) : (
					<EmptyStateCard
						eyebrow='DISCIPLINAS'
						title={query ? 'Nenhuma disciplina encontrada' : 'Nenhuma disciplina neste período'}
						description={
							query
								? 'Tente outro nome, código ou professor, ou limpe os filtros para ver todas as disciplinas.'
								: 'Quando houver matrículas disponíveis, elas aparecerão aqui. Você também pode selecionar outro período.'
						}
					/>
				)}
			</VStack>
		</NavigationPageShell>
	);
}
