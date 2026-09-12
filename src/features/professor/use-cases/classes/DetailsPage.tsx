import { teaching } from '@Api/teaching/endpoints';
import type { Plan, TeachingClass } from '@Api/teaching/types';
import { BaseButton, ErrorStateCard, Surface } from '@BaseComponents';
import { Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import {
	ArrowLeft,
	ArrowUpRight,
	BookOpen,
	CalendarDays,
	ClipboardList,
	Users,
} from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import {
	PageHeader,
	QueryState,
	SectionHeading,
	StatCard,
	StatusPill,
} from '../../components/TeachingUI';
import { useTeachingQuery } from '../../hooks';
import { ClassActivities, ClassLessons, ClassRoster } from './ClassSections';
import { PlanEditor } from './PlanEditor';

const tabs = [
	['overview', 'Visão geral'],
	['plan', 'Plano de ensino'],
	['lessons', 'Aulas'],
	['activities', 'Atividades'],
	['roster', 'Alunos'],
] as const;

function ClassOverview({ item }: { item: TeachingClass & { coursePlan: Plan | null } }) {
	const shifts: Record<string, string> = {
		morning: 'Matutino',
		afternoon: 'Vespertino',
		evening: 'Noturno',
		night: 'Noturno',
		full_time: 'Integral',
		full: 'Integral',
	};
	return (
		<VStack align='stretch' gap={5}>
			<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
				<StatCard
					label='Matrículas'
					value={item._count.enrollments}
					icon={Users}
					hint='Total de vínculos na turma'
				/>
				<StatCard
					label='Aulas registradas'
					value={item._count.sessions}
					icon={BookOpen}
					hint='Programação e histórico da turma'
				/>
				<StatCard
					label='Atividades'
					value={item._count.activities}
					icon={ClipboardList}
					hint='Atividades e avaliações cadastradas'
				/>
			</SimpleGrid>
			<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
				<Surface variant='panel'>
					<SectionHeading title='Sobre a turma' />
					<VStack align='stretch' gap={4}>
						{[
							['Curso', item.course.name],
							['Período letivo', item.academicPeriod.code],
							['Turno', shifts[item.shift] ?? (item.shift || 'Não informado')],
							['Ano', String(item.year)],
						].map(([label, value]) => (
							<HStack key={label} justify='space-between' align='start' gap={4}>
								<Text fontSize='sm' color='fg.muted'>
									{label}
								</Text>
								<Text fontSize='sm' fontWeight='medium' textAlign='right'>
									{value}
								</Text>
							</HStack>
						))}
					</VStack>
				</Surface>
				<Surface variant='gradient'>
					<SectionHeading
						title='Planejamento da disciplina'
						action={
							<StatusPill tone={item.coursePlan?.status === 'published' ? 'success' : 'neutral'}>
								{item.coursePlan?.status === 'published'
									? 'Publicado'
									: item.coursePlan?.status === 'archived'
										? 'Arquivado'
										: 'Rascunho'}
							</StatusPill>
						}
					/>
					<Text color='fg.muted' fontSize='sm' lineClamp={4} whiteSpace='pre-wrap'>
						{item.coursePlan?.syllabus ||
							'Comece pela ementa e pelos objetivos. Um plano organizado ajuda a dar direção às próximas aulas.'}
					</Text>
					<BaseButton asChild variant='secondary' size='sm' mt={5}>
						<Link to='?tab=plan'>
							Abrir plano de ensino
							<ArrowUpRight size={16} aria-hidden='true' />
						</Link>
					</BaseButton>
				</Surface>
			</SimpleGrid>
			<Surface variant='panel'>
				<HStack justify='space-between' flexWrap='wrap' gap={4}>
					<Box>
						<Heading as='h2' fontSize='lg'>
							Prepare o próximo encontro
						</Heading>
						<Text mt={1} fontSize='sm' color='fg.muted'>
							Registre o tema, a data e o local da próxima aula.
						</Text>
					</Box>
					<BaseButton asChild variant='secondary'>
						<Link to='?tab=lessons'>
							<CalendarDays size={17} aria-hidden='true' />
							Organizar aulas
						</Link>
					</BaseButton>
				</HStack>
			</Surface>
		</VStack>
	);
}

export function ClassDetailsPage() {
	const { classId } = useParams();
	const id = Number(classId);
	const validId = Number.isSafeInteger(id) && id > 0;
	const [params] = useSearchParams();
	const selected = tabs.find(([key]) => key === params.get('tab'))?.[0] ?? 'overview';
	const query = useTeachingQuery(['class', id], () => teaching.detail(id), validId);
	const item = query.data;
	if (!validId)
		return (
			<ErrorStateCard
				eyebrow='Turma indisponível'
				title='Não foi possível encontrar esta turma'
				description='Acesse a lista de turmas para escolher um vínculo válido.'
				action={
					<BaseButton asChild variant='secondary'>
						<Link to='/professor/classes'>Voltar às turmas</Link>
					</BaseButton>
				}
			/>
		);
	return (
		<VStack align='stretch' gap={5}>
			<Box>
				<BaseButton asChild variant='subtle' size='sm'>
					<Link to='/professor/classes'>
						<ArrowLeft size={16} aria-hidden='true' />
						Voltar às turmas
					</Link>
				</BaseButton>
			</Box>
			<PageHeader
				title={item?.title ?? 'Espaço da turma'}
				eyebrow={item ? `${item.code} · ${item.academicPeriod.code}` : 'Minhas turmas'}
				description={item?.course.name ?? 'Planejamento, aulas e acompanhamento dos alunos.'}
			/>
			<QueryState query={query}>
				{item && (
					<>
						<Box as='nav' aria-label='Seções da turma' pb={2}>
							<HStack gap={2} flexWrap='wrap'>
								{tabs.map(([key, label]) => (
									<BaseButton
										key={key}
										asChild
										size='sm'
										variant={selected === key ? 'primary' : 'subtle'}
									>
										<Link to={`?tab=${key}`} aria-current={selected === key ? 'page' : undefined}>
											{label}
										</Link>
									</BaseButton>
								))}
							</HStack>
						</Box>
						<Box key={`${id}-${selected}`}>
							{selected === 'overview' && <ClassOverview item={item} />}
							{selected === 'plan' && <PlanEditor classId={id} plan={item.coursePlan} />}
							{selected === 'lessons' && <ClassLessons classId={id} />}
							{selected === 'activities' && <ClassActivities classId={id} />}
							{selected === 'roster' && <ClassRoster classId={id} />}
						</Box>
					</>
				)}
			</QueryState>
		</VStack>
	);
}
