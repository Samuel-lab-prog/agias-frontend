import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { SearchInput } from '@core/components/forms/search-input/SearchInput';
import { ArrowUpRight, BookOpen, CalendarDays, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
	IconTile,
	PageHeader,
	Pagination,
	QueryState,
	StatusPill,
} from '../../components/TeachingUI';
import { usePagedSearch, useTeachingQuery } from '../../hooks';

export function ClassesPage() {
	const { search, setSearch, filters, applySearch, setPage } = usePagedSearch();
	const query = useTeachingQuery(['classes', filters], () => teaching.classes(filters));
	return (
		<VStack align='stretch' gap={5}>
			<PageHeader
				title='Minhas turmas'
				description='Cada turma, seu planejamento e seus alunos em um só lugar.'
				action={
					<BaseButton asChild variant='secondary' size='sm'>
						<Link to='/professor/calendar'>
							<CalendarDays size={16} aria-hidden='true' />
							Ver agenda
						</Link>
					</BaseButton>
				}
			/>
			<Surface variant='panel' py={4}>
				<Box maxW='480px'>
					<SearchInput
						label='Buscar turmas'
						placeholder='Digite o nome da turma'
						value={search}
						onValueChange={setSearch}
						onDebouncedChange={applySearch}
					/>
				</Box>
			</Surface>
			<QueryState
				query={query}
				empty={
					query.data?.items.length === 0 && {
						title: filters.q ? 'Nenhuma turma encontrada' : 'Suas turmas aparecerão aqui',
						description: filters.q
							? 'Tente outro nome ou limpe a busca para ver todas as turmas.'
							: 'As turmas ficam disponíveis quando a secretaria as vincula ao seu perfil.',
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
				<SimpleGrid columns={{ base: 1, md: 2, '2xl': 3 }} gap={4}>
					{query.data?.items.map((item) => (
						<Surface key={item.id} variant='panel' interactive asChild>
							<Link to={`/professor/classes/${item.id}`} aria-label={`Abrir turma ${item.title}`}>
								<VStack align='stretch' gap={4} h='full'>
									<HStack justify='space-between'>
										<IconTile icon={GraduationCap} />
										<StatusPill tone='accent'>{item.academicPeriod.code}</StatusPill>
									</HStack>
									<Box flex='1'>
										<Text fontSize='xs' color='fg.muted' mb={1}>
											{item.code}
										</Text>
										<Heading as='h2' fontSize='xl' lineHeight='1.3' overflowWrap='anywhere'>
											{item.title}
										</Heading>
										<Text color='fg.muted' fontSize='sm' mt={2}>
											{item.course.name}
										</Text>
									</Box>
									<HStack gap={4} flexWrap='wrap' color='fg.muted' fontSize='sm'>
										<HStack gap={1.5}>
											<Users size={15} aria-hidden='true' />
											<Text>{item._count.enrollments} matrículas</Text>
										</HStack>
										<HStack gap={1.5}>
											<BookOpen size={15} aria-hidden='true' />
											<Text>{item._count.sessions} aulas</Text>
										</HStack>
									</HStack>
									<HStack
										justify='space-between'
										pt={4}
										borderTopWidth='1px'
										borderColor='border.muted'
										color='action.primary'
									>
										<Text fontSize='sm' fontWeight='semibold'>
											Acessar turma
										</Text>
										<ArrowUpRight size={17} aria-hidden='true' />
									</HStack>
								</VStack>
							</Link>
						</Surface>
					))}
				</SimpleGrid>
				{query.data && <Pagination {...query.data} onChange={setPage} />}
			</QueryState>
		</VStack>
	);
}
