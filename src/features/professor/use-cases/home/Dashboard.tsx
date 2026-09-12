import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, EmptyStateCard, Surface } from '@BaseComponents';
import { Box, Grid, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import {
	ArrowUpRight,
	BookOpen,
	CalendarDays,
	ClipboardCheck,
	ClipboardList,
	GraduationCap,
	Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { LessonCard } from '../../components/LessonCard';
import {
	ActionLink,
	IconTile,
	PageHeader,
	QueryState,
	SectionHeading,
	StatCard,
	StatusPill,
} from '../../components/TeachingUI';
import { useTeachingQuery } from '../../hooks';
import { formatDate } from '../../utils';

const shortcuts = [
	{
		to: 'classes',
		icon: GraduationCap,
		title: 'Minhas turmas',
		description: 'Planeje aulas e acompanhe os alunos.',
	},
	{
		to: 'activities',
		icon: ClipboardList,
		title: 'Atividades e avaliações',
		description: 'Consulte prazos, pontuações e entregas.',
	},
	{
		to: 'materials',
		icon: BookOpen,
		title: 'Materiais de aula',
		description: 'Reúna as referências das suas turmas.',
	},
];

export function Dashboard() {
	const query = useTeachingQuery(['overview'], teaching.overview);
	const data = query.data;
	return (
		<VStack align='stretch' gap={6}>
			<PageHeader
				title={
					data ? `Olá, ${data.profile.user.name.trim().split(/\s+/)[0]}.` : 'Seu espaço docente'
				}
				description='Uma visão do seu dia para planejar, ensinar e acompanhar.'
				action={
					<StatusPill>
						{formatDate(new Date().toISOString(), {
							weekday: 'long',
							day: 'numeric',
							month: 'long',
						})}
					</StatusPill>
				}
			/>
			<QueryState query={query}>
				{data && (
					<>
						<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
							<StatCard
								label='Minhas turmas'
								value={data.classCount}
								icon={GraduationCap}
								hint='Turmas vinculadas ao seu perfil'
							/>
							<StatCard
								label='Alunos ativos'
								value={data.students}
								icon={Users}
								hint='Matrículas ativas nas suas turmas'
							/>
							<StatCard
								label='Aguardando revisão'
								value={data.pendingGrades}
								icon={ClipboardCheck}
								hint='Entregas realizadas que ainda não têm nota'
							/>
						</SimpleGrid>
						<Grid
							templateColumns={{
								base: 'minmax(0, 1fr)',
								xl: 'minmax(0, 1.6fr) minmax(280px, 1fr)',
							}}
							gap={6}
							alignItems='start'
						>
							<Box minW={0}>
								<SectionHeading
									title='Próximas aulas'
									description='Sua programação, em ordem de início.'
									action={<ActionLink to='/professor/calendar'>Ver agenda</ActionLink>}
								/>
								<VStack align='stretch' gap={3}>
									{data.lessons.length ? (
										data.lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
									) : (
										<EmptyStateCard
											title='Agenda livre por enquanto'
											description='As próximas aulas agendadas nas suas turmas aparecerão aqui.'
											action={<ActionLink to='/professor/classes'>Acessar turmas</ActionLink>}
										/>
									)}
								</VStack>
							</Box>
							<VStack align='stretch' gap={4}>
								<Surface variant='gradient'>
									<IconTile icon={ClipboardCheck} />
									<Heading as='h2' fontSize='xl' mt={4}>
										{data.pendingGrades ? 'Hora de acompanhar as entregas' : 'Revisões em dia'}
									</Heading>
									<Text color='fg.muted' fontSize='sm' mt={2} mb={5}>
										{data.pendingGrades
											? `${data.pendingGrades} ${data.pendingGrades === 1 ? 'entrega aguarda' : 'entregas aguardam'} lançamento de nota. Consulte as atividades para organizar a revisão.`
											: 'As entregas realizadas já têm nota. Aproveite para preparar suas próximas aulas.'}
									</Text>
									<BaseButton asChild variant='secondary' size='sm'>
										<Link to={data.pendingGrades ? '/professor/activities' : '/professor/classes'}>
											{data.pendingGrades ? 'Consultar atividades' : 'Planejar minhas turmas'}
											<ArrowUpRight size={16} aria-hidden='true' />
										</Link>
									</BaseButton>
								</Surface>
								<Surface variant='panel'>
									<HStack gap={3}>
										<IconTile icon={CalendarDays} />
										<Box>
											<Text fontSize='sm' fontWeight='semibold'>
												Seu planejamento em um só lugar
											</Text>
											<Text color='fg.muted' fontSize='sm' mt={1}>
												Acesse uma turma para organizar o plano de ensino e registrar aulas.
											</Text>
										</Box>
									</HStack>
								</Surface>
							</VStack>
						</Grid>
						<Box>
							<SectionHeading title='Acesso rápido' />
							<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
								{shortcuts.map((item) => (
									<Surface key={item.to} variant='panel' interactive asChild>
										<Link to={`/professor/${item.to}`}>
											<HStack justify='space-between'>
												<IconTile icon={item.icon} />
												<ArrowUpRight size={18} aria-hidden='true' />
											</HStack>
											<Heading as='h3' fontSize='md' mt={4}>
												{item.title}
											</Heading>
											<Text fontSize='sm' color='fg.muted' mt={2}>
												{item.description}
											</Text>
										</Link>
									</Surface>
								))}
							</SimpleGrid>
						</Box>
					</>
				)}
			</QueryState>
		</VStack>
	);
}
