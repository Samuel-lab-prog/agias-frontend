import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { SearchInput } from '@core/components/forms/search-input/SearchInput';
import { useState } from 'react';

import { ActivityCard } from '../../components/ActivityCard';
import { LessonCard } from '../../components/LessonCard';
import { Pagination, QueryState, SectionHeading, StatusPill } from '../../components/TeachingUI';
import { usePagedSearch, useTeachingQuery } from '../../hooks';
import { initials } from '../../utils';
import { ActivityForm } from './ActivityForm';
import { LessonForm } from './LessonForm';

export function ClassLessons({ classId }: { classId: number }) {
	const [page, setPage] = useState(1);
	const query = useTeachingQuery(['lessons', classId, page], () =>
		teaching.lessons({ classId, page }),
	);
	return (
		<VStack align='stretch' gap={6}>
			<LessonForm classId={classId} />
			<Box>
				<SectionHeading
					title='Aulas registradas'
					description='Histórico da turma, a partir das datas mais recentes.'
				/>
				<QueryState
					query={query}
					empty={
						query.data?.items.length === 0 && {
							title: 'A primeira aula começa aqui',
							description: 'Use o formulário acima para organizar a programação da turma.',
						}
					}
				>
					<VStack align='stretch' gap={3}>
						{query.data?.items.map((lesson) => (
							<LessonCard key={lesson.id} lesson={lesson} inClass />
						))}
					</VStack>
					{query.data && <Pagination {...query.data} onChange={setPage} />}
				</QueryState>
			</Box>
		</VStack>
	);
}

export function ClassActivities({ classId }: { classId: number }) {
	const { search, setSearch, filters, applySearch, setPage } = usePagedSearch();
	const query = useTeachingQuery(['activities', classId, filters], () =>
		teaching.activities({ ...filters, classId }),
	);
	return (
		<VStack align='stretch' gap={6}>
			<ActivityForm classId={classId} />
			<Box>
				<SectionHeading
					title='Atividades da turma'
					description='Propostas cadastradas e quantidade de entregas registradas.'
				/>
				<Box mb={4} maxW='480px'>
					<SearchInput
						label='Buscar nesta turma'
						value={search}
						onValueChange={setSearch}
						onDebouncedChange={applySearch}
						placeholder='Digite o título da atividade'
					/>
				</Box>
				<QueryState
					query={query}
					empty={
						query.data?.items.length === 0 && {
							title: filters.q ? 'Nenhuma atividade encontrada' : 'Nenhuma proposta cadastrada',
							description: filters.q
								? 'Experimente outro título ou limpe a busca.'
								: 'Crie uma atividade ou avaliação usando o formulário acima.',
							action: filters.q ? (
								<BaseButton
									variant='secondary'
									onClick={() => {
										setSearch('');
										applySearch('');
									}}
								>
									Limpar busca
								</BaseButton>
							) : undefined,
						}
					}
				>
					<VStack align='stretch' gap={3}>
						{query.data?.items.map((activity) => (
							<ActivityCard key={activity.id} activity={activity} inClass />
						))}
					</VStack>
					{query.data && <Pagination {...query.data} onChange={setPage} />}
				</QueryState>
			</Box>
		</VStack>
	);
}

export function ClassRoster({ classId }: { classId: number }) {
	const { search, setSearch, filters, applySearch, setPage } = usePagedSearch();
	const query = useTeachingQuery(['roster', classId, filters], () =>
		teaching.roster(classId, filters),
	);
	return (
		<Surface variant='panel'>
			<SectionHeading
				title='Alunos matriculados'
				description='Alunos com matrícula ativa nesta turma.'
			/>
			<Box mb={5} maxW='480px'>
				<SearchInput
					label='Buscar alunos'
					value={search}
					onValueChange={setSearch}
					onDebouncedChange={applySearch}
					placeholder='Digite o nome do aluno'
				/>
			</Box>
			<QueryState
				query={query}
				empty={
					query.data?.items.length === 0 && {
						title: filters.q ? 'Nenhum aluno encontrado' : 'Nenhum aluno matriculado',
						description: filters.q
							? 'Tente outro nome ou limpe a busca.'
							: 'As matrículas ativas aparecerão aqui quando forem registradas.',
						action: filters.q ? (
							<BaseButton
								variant='secondary'
								onClick={() => {
									setSearch('');
									applySearch('');
								}}
							>
								Limpar busca
							</BaseButton>
						) : undefined,
					}
				}
			>
				<VStack align='stretch' gap={0}>
					{query.data?.items.map((student) => (
						<HStack
							key={student.id}
							py={4}
							gap={3}
							borderBottomWidth='1px'
							borderColor='border.muted'
							flexWrap='wrap'
						>
							<Box
								boxSize={10}
								flexShrink={0}
								display='grid'
								placeItems='center'
								borderRadius='full'
								bg='bg.muted'
								color='action.primary'
								fontSize='sm'
								fontWeight='semibold'
								aria-hidden='true'
							>
								{initials(student.name)}
							</Box>
							<Box flex='1' minW='150px'>
								<Text fontWeight='semibold' fontSize='sm' overflowWrap='anywhere'>
									{student.name}
								</Text>
								<Text fontSize='xs' color='fg.muted' mt={1}>
									Matrícula {student.academicId}
								</Text>
							</Box>
							<StatusPill tone='success'>Matrícula ativa</StatusPill>
						</HStack>
					))}
				</VStack>
				{query.data && <Pagination {...query.data} onChange={setPage} />}
			</QueryState>
		</Surface>
	);
}
