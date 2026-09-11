import { staffCurriculum } from '@Api/curriculum/staff';
import { BaseButton, EmptyStateCard, Surface } from '@BaseComponents';
import {
	Box,
	Heading,
	HStack,
	Input,
	NativeSelect,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { interactiveStyles } from '@core/themes/motion';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { staffNavigationPreset } from '../home/navigation';
import { FieldLabel, Pagination, RequestError } from './components';
import { useClassOptions, useSearch, useStaffQuery } from './hooks';

export function StaffClassesPage() {
	const search = useSearch();
	const [page, setPage] = useState(1);
	const [academicPeriodId, setPeriod] = useState('');
	const [courseId, setCourse] = useState('');
	const options = useClassOptions();
	const filters = {
		page,
		q: search.query,
		academicPeriodId: Number(academicPeriodId) || undefined,
		courseId: Number(courseId) || undefined,
	};
	const query = useStaffQuery(['classes', filters], () => staffCurriculum.classes(filters));
	return (
		<NavigationPageShell preset={staffNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<HStack justify='space-between' flexWrap='wrap' gap={3}>
					<Box>
						<Heading as='h1' fontSize='2xl'>
							Turmas e matrículas
						</Heading>
						<Text color='fg.muted' mt={1}>
							Organize as turmas, os professores e os alunos de cada período.
						</Text>
					</Box>
					<BaseButton asChild>
						<NavLink to='/staff/classes/new'>
							<Plus size={18} />
							Nova turma
						</NavLink>
					</BaseButton>
				</HStack>
				<Surface variant='panel'>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
						<FieldLabel label='Buscar turma'>
							<Input
								{...interactiveStyles.field}
								value={search.text}
								placeholder='Nome ou código'
								onChange={(event) => {
									search.setText(event.target.value);
									setPage(1);
								}}
							/>
						</FieldLabel>
						<FieldLabel label='Filtrar por período'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={academicPeriodId}
									onChange={(event) => {
										setPeriod(event.target.value);
										setPage(1);
									}}
								>
									<option value=''>Todos os períodos</option>
									{options.periods.data?.map((period) => (
										<option value={period.id} key={period.id}>
											{period.code}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FieldLabel>
						<FieldLabel label='Filtrar por curso'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={courseId}
									onChange={(event) => {
										setCourse(event.target.value);
										setPage(1);
									}}
								>
									<option value=''>Todos os cursos</option>
									{options.courses.data?.map((course) => (
										<option value={course.id} key={course.id}>
											{course.name}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FieldLabel>
					</SimpleGrid>
					{search.text || academicPeriodId || courseId ? (
						<BaseButton
							variant='subtle'
							size='sm'
							mt={3}
							onClick={() => {
								search.setText('');
								setPeriod('');
								setCourse('');
								setPage(1);
							}}
						>
							Limpar filtros
						</BaseButton>
					) : null}
				</Surface>
				<RequestError
					error={options.courses.error || options.periods.error}
					retry={() => {
						void options.courses.refetch();
						void options.periods.refetch();
					}}
				/>
				{query.isPending ? (
					<Text role='status'>Carregando turmas…</Text>
				) : query.isError ? (
					<RequestError error={query.error} retry={() => void query.refetch()} />
				) : (
					<>
						{query.data.items.length ? (
							<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
								{query.data.items.map((item) => (
									<Surface key={item.id} variant='panel' interactive asChild>
										<NavLink
											to={`/staff/classes/${item.id}`}
											aria-label={`Gerenciar ${item.title}`}
										>
											<VStack align='stretch' gap={3}>
												<HStack justify='space-between'>
													<Text fontSize='xs' color='fg.muted'>
														{item.code}
													</Text>
													<Text fontSize='sm' fontWeight='semibold' color='action.primary'>
														{item.academicPeriod.code}
													</Text>
												</HStack>
												<Heading as='h2' fontSize='lg'>
													{item.title}
												</Heading>
												<Text color='fg.muted' fontSize='sm'>
													{item.course.name}
												</Text>
												<Text fontSize='sm'>
													{item.professors.map((professor) => professor.name).join(', ') ||
														'Professor ainda não vinculado'}
												</Text>
												<HStack borderTopWidth='1px' borderColor='border.default' pt={3}>
													<Users size={16} />
													<Text fontSize='sm'>
														{item.activeEnrollments} matrícula
														{item.activeEnrollments === 1 ? '' : 's'} ativa
														{item.activeEnrollments === 1 ? '' : 's'}
													</Text>
												</HStack>
												<Text color='action.primary' fontWeight='semibold' fontSize='sm'>
													Gerenciar turma →
												</Text>
											</VStack>
										</NavLink>
									</Surface>
								))}
							</SimpleGrid>
						) : (
							<EmptyStateCard
								eyebrow='TURMAS'
								title='Nenhuma turma encontrada'
								description='Ajuste os filtros ou cadastre uma nova turma para começar.'
							/>
						)}
						<Pagination {...query.data} onChange={setPage} disabled={query.isFetching} />
					</>
				)}
			</VStack>
		</NavigationPageShell>
	);
}
