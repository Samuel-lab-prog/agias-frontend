/* eslint-disable max-lines, max-lines-per-function -- schedule page composes filters, calendar navigation, and event rendering. */
import { BaseButton, EmptyStateCard, ErrorStateCard, Surface } from '@BaseComponents';
import { Box, Flex, Heading, HStack, NativeSelect, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Clock, Flag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { studentNavigationPreset } from '../../utils/navigation-routes';
import { useMyAcademicCalendarEvents } from '../hooks/useMyAcademicCalendarEvents';
import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';

function startOfWeek(date: Date) {
	const result = new Date(date);
	result.setHours(0, 0, 0, 0);
	const day = result.getDay();
	result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
	return result;
}

function addDays(date: Date, amount: number) {
	const result = new Date(date);
	result.setDate(result.getDate() + amount);
	return result;
}

function startOfMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
	return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function startOfCalendarGrid(date: Date) {
	const firstDay = startOfMonth(date);
	const mondayOffset = (firstDay.getDay() + 6) % 7;
	return addDays(firstDay, -mondayOffset);
}

function getAcademicEventColors(type: string) {
	if (type === 'holiday' || type === 'break')
		return { bg: 'status.errorSubtle', marker: 'status.error' };
	if (type === 'instructional_saturday' || type === 'exam')
		return { bg: 'status.warning', marker: 'status.warning' };
	return { bg: 'action.primarySubtle', marker: 'action.primary' };
}

export function StudentSchedulePage() {
	const { dashboard, isLoading, isError, refetch } = useMyStudentDashboard();
	const enrollments = useMemo(() => dashboard?.enrollments ?? [], [dashboard?.enrollments]);
	const [periodOffset, setPeriodOffset] = useState(0);
	const [view, setView] = useState<'week' | 'month'>('week');
	const [filter, setFilter] = useState<'all' | 'classes' | 'activities' | 'academicEvents'>('all');
	const [disciplineId, setDisciplineId] = useState('all');
	const today = new Date();
	const todayKey = today.toISOString().slice(0, 10);
	const weekStart = addDays(startOfWeek(today), periodOffset * 7);
	const monthStart = addMonths(startOfMonth(today), periodOffset);
	const rangeStart = view === 'week' ? weekStart : monthStart;
	const rangeEnd = view === 'week' ? addDays(weekStart, 7) : addMonths(monthStart, 1);
	const {
		events: academicEvents,
		isLoading: isLoadingAcademicEvents,
		isError: isAcademicEventsError,
	} = useMyAcademicCalendarEvents(rangeStart, rangeEnd);
	const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
	});
	const rangeFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
	const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
	const sessions = useMemo(
		() =>
			enrollments
				.flatMap((enrollment) =>
					enrollment.sessions.map((session) => ({
						...session,
						classOfferingId: enrollment.classOffering.id,
						classTitle: enrollment.classOffering.title,
						classCode: enrollment.classOffering.code,
					})),
				)
				.filter((session) => {
					const startsAt = new Date(session.startsAt);
					return (
						startsAt >= rangeStart &&
						startsAt < rangeEnd &&
						(disciplineId === 'all' || String(session.classOfferingId) === disciplineId)
					);
				})
				.sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt)),
		[disciplineId, enrollments, rangeStart, rangeEnd],
	);
	const activities = useMemo(
		() =>
			enrollments
				.flatMap((enrollment) =>
					enrollment.activities
						.filter((activity) => activity.dueAt)
						.map((activity) => ({
							...activity,
							enrollmentId: enrollment.id,
							classOfferingId: enrollment.classOffering.id,
							classTitle: enrollment.classOffering.title,
						})),
				)
				.filter((activity) => {
					const dueAt = new Date(activity.dueAt!);
					return (
						dueAt >= rangeStart &&
						dueAt < rangeEnd &&
						(disciplineId === 'all' || String(activity.classOfferingId) === disciplineId)
					);
				})
				.sort((left, right) => Date.parse(left.dueAt!) - Date.parse(right.dueAt!)),
		[disciplineId, enrollments, rangeStart, rangeEnd],
	);
	const visibleSessions = useMemo(
		() => (filter === 'activities' || filter === 'academicEvents' ? [] : sessions),
		[filter, sessions],
	);
	const visibleActivities = useMemo(
		() => (filter === 'classes' || filter === 'academicEvents' ? [] : activities),
		[filter, activities],
	);
	const visibleAcademicEvents = useMemo(
		() => (filter === 'classes' || filter === 'activities' ? [] : academicEvents),
		[academicEvents, filter],
	);
	const grouped = useMemo(() => {
		const groups = new Map<
			string,
			{
				sessions: typeof sessions;
				activities: typeof activities;
				academicEvents: typeof academicEvents;
			}
		>();
		for (const session of visibleSessions) {
			const key = new Date(session.startsAt).toISOString().slice(0, 10);
			groups.set(key, {
				...(groups.get(key) ?? { sessions: [], activities: [], academicEvents: [] }),
				sessions: [...(groups.get(key)?.sessions ?? []), session],
			});
		}
		for (const activity of visibleActivities) {
			const key = new Date(activity.dueAt!).toISOString().slice(0, 10);
			groups.set(key, {
				...(groups.get(key) ?? { sessions: [], activities: [], academicEvents: [] }),
				activities: [...(groups.get(key)?.activities ?? []), activity],
			});
		}
		for (const event of visibleAcademicEvents) {
			const key = new Date(event.startsAt).toISOString().slice(0, 10);
			groups.set(key, {
				...(groups.get(key) ?? { sessions: [], activities: [], academicEvents: [] }),
				academicEvents: [...(groups.get(key)?.academicEvents ?? []), event],
			});
		}
		return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right));
	}, [visibleAcademicEvents, visibleActivities, visibleSessions]);
	const groupedByDate = useMemo(() => new Map(grouped), [grouped]);
	const monthDays = useMemo(
		() => Array.from({ length: 42 }, (_, index) => addDays(startOfCalendarGrid(monthStart), index)),
		[monthStart],
	);

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<Flex justify='space-between' align='start' gap={4} wrap='wrap' mb={5}>
				<Box flex='1' minW={0}>
					<HStack gap={2}>
						<CalendarDays size={20} />
						<Heading as='h1' fontSize={{ base: 'xl', md: '2xl' }}>
							Agenda de aulas
						</Heading>
					</HStack>
					<Text color='fg.muted' fontSize='sm' mt={1}>
						Aulas e prazos das suas atividades em um só lugar.
					</Text>
					<HStack gap={2} mt={3} flexWrap='wrap'>
						<NativeSelect.Root size='sm' width={{ base: 'full', sm: '220px' }}>
							<NativeSelect.Field
								value={disciplineId}
								onChange={(event) => setDisciplineId(event.target.value)}
								aria-label='Filtrar por disciplina'
							>
								<option value='all'>Todas as disciplinas</option>
								{enrollments.map((enrollment) => (
									<option key={enrollment.classOffering.id} value={enrollment.classOffering.id}>
										{enrollment.classOffering.title}
									</option>
								))}
							</NativeSelect.Field>
						</NativeSelect.Root>
						<BaseButton
							size='sm'
							variant={filter === 'all' ? 'primary' : 'secondary'}
							onClick={() => setFilter('all')}
						>
							Tudo
						</BaseButton>
						<BaseButton
							size='sm'
							variant={filter === 'classes' ? 'primary' : 'secondary'}
							onClick={() => setFilter('classes')}
						>
							<Clock size={14} />
							Aulas
						</BaseButton>
						<BaseButton
							size='sm'
							variant={filter === 'activities' ? 'primary' : 'secondary'}
							onClick={() => setFilter('activities')}
						>
							<ClipboardList size={14} />
							Atividades
						</BaseButton>
						<BaseButton
							size='sm'
							variant={filter === 'academicEvents' ? 'primary' : 'secondary'}
							onClick={() => setFilter('academicEvents')}
						>
							<Flag size={14} />
							Eventos
						</BaseButton>
					</HStack>
				</Box>
				<BaseButton asChild size='sm' variant='secondary'>
					<NavLink to='/student'>Voltar ao início</NavLink>
				</BaseButton>
			</Flex>
			<Surface variant='panel'>
				<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={5}>
					<Heading as='h2' fontSize='lg' textTransform='capitalize'>
						{view === 'week'
							? `${rangeFormatter.format(weekStart)} – ${rangeFormatter.format(addDays(weekStart, 6))}`
							: new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
									monthStart,
								)}
					</Heading>
					<HStack gap={2}>
						<BaseButton
							size='sm'
							variant={view === 'week' ? 'primary' : 'secondary'}
							onClick={() => {
								setView('week');
								setPeriodOffset(0);
							}}
						>
							Semana
						</BaseButton>
						<BaseButton
							size='sm'
							variant={view === 'month' ? 'primary' : 'secondary'}
							onClick={() => {
								setView('month');
								setPeriodOffset(0);
							}}
						>
							Mês
						</BaseButton>
						<BaseButton
							size='sm'
							variant='secondary'
							aria-label='Período anterior'
							onClick={() => setPeriodOffset((value) => value - 1)}
						>
							<ChevronLeft size={16} />
						</BaseButton>
						<BaseButton size='sm' variant='secondary' onClick={() => setPeriodOffset(0)}>
							Hoje
						</BaseButton>
						<BaseButton
							size='sm'
							variant='secondary'
							aria-label='Próximo período'
							onClick={() => setPeriodOffset((value) => value + 1)}
						>
							<ChevronRight size={16} />
						</BaseButton>
					</HStack>
				</Flex>
				{isLoading ? <Text color='fg.muted'>Carregando agenda...</Text> : null}
				{isLoadingAcademicEvents ? (
					<Text color='fg.muted'>Carregando eventos acadêmicos...</Text>
				) : null}
				{isError || isAcademicEventsError ? (
					<ErrorStateCard
						eyebrow='AGENDA'
						title='Não foi possível carregar a agenda'
						description='Verifique sua conexão e tente novamente.'
						actionLabel='Tentar novamente'
						onAction={() => {
							void refetch();
						}}
					/>
				) : null}
				{!isLoading && !isError && grouped.length === 0 ? (
					<EmptyStateCard
						eyebrow='AGENDA'
						title={
							filter === 'activities'
								? 'Nenhuma atividade neste período'
								: filter === 'classes'
									? 'Nenhuma aula neste período'
									: filter === 'academicEvents'
										? 'Nenhum evento acadêmico neste período'
										: 'Nenhum evento neste período'
						}
						description='Escolha outro período ou altere o filtro.'
					/>
				) : null}
				{view === 'month' ? (
					<Flex align='start' gap={4} direction={{ base: 'column', xl: 'row' }}>
						<Box flex='1' minW={0} w='full'>
							<Box>
								<Box display='grid' gridTemplateColumns='repeat(7, minmax(0, 1fr))' gap={1} mb={1}>
									{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((label) => (
										<Text
											key={label}
											textAlign='center'
											fontSize='xs'
											fontWeight='semibold'
											color='fg.muted'
											py={2}
										>
											{label}
										</Text>
									))}
								</Box>
								<HStack gap={3} flexWrap='wrap' mb={2} px={1}>
									{[
										{ label: 'Aulas', color: 'fg.muted' },
										{ label: 'Atividades', color: 'action.primary' },
										{ label: 'Datas importantes', color: 'status.warning' },
									].map((item) => (
										<HStack key={item.label} gap={1.5}>
											<Box w='6px' h='6px' borderRadius='full' bg={item.color} />
											<Text fontSize='xs' color='fg.muted'>
												{item.label}
											</Text>
										</HStack>
									))}
								</HStack>
								<Box display='grid' gridTemplateColumns='repeat(7, minmax(0, 1fr))' gap={1}>
									{monthDays.map((day) => {
										const key = day.toISOString().slice(0, 10);
										const group = groupedByDate.get(key);
										const isCurrentMonth = day.getMonth() === monthStart.getMonth();
										const items = [
											...(group?.academicEvents ?? []).map((event) => ({
												label: event.title,
												...getAcademicEventColors(event.type),
											})),
											...(group?.activities ?? []).map((activity) => ({
												label: activity.title,
												bg: 'action.primarySubtle',
												marker: 'action.primary',
											})),
											...(group?.sessions ?? []).map((session) => ({
												label: session.classTitle,
												bg: 'bg.muted',
												marker: 'fg.muted',
											})),
										];
										return (
											<Box
												key={key}
												minH={{ base: '64px', md: '112px' }}
												p={{ base: 1, md: 2 }}
												borderWidth='1px'
												borderColor={key === todayKey ? 'action.primary' : 'border.default'}
												borderRadius='md'
												bg={key === todayKey ? 'action.primarySubtle' : 'bg.surface'}
												opacity={isCurrentMonth ? 1 : 0.45}
											>
												<Text
													fontSize='sm'
													fontWeight={key === todayKey ? 'bold' : 'medium'}
													mb={1}
												>
													{day.getDate()}
												</Text>
												<VStack align='stretch' gap={1}>
													{items.slice(0, 3).map((item, index) => (
														<Box
															key={`${key}-${item.label}-${index}`}
															fontSize='xs'
															px={{ base: 0, md: 1 }}
															py={{ base: 0, md: 0.5 }}
															borderRadius='sm'
															bg={{ base: 'transparent', md: item.bg }}
															title={item.label}
														>
															<Box
																display={{ base: 'block', md: 'none' }}
																w='6px'
																h='6px'
																borderRadius='full'
																bg={item.marker}
															/>
															<Text display={{ base: 'none', md: 'block' }} truncate>
																{item.label}
															</Text>
														</Box>
													))}
													{items.length > 3 ? (
														<Text
															display={{ base: 'none', md: 'block' }}
															fontSize='10px'
															color='fg.muted'
														>
															+{items.length - 3} mais
														</Text>
													) : null}
												</VStack>
											</Box>
										);
									})}
								</Box>
							</Box>
						</Box>
						<Surface
							variant='panel'
							p={4}
							mt={{ base: 0, xl: '2.25rem' }}
							w={{ base: 'full', xl: '280px' }}
							flexShrink={0}
						>
							<Heading as='h3' fontSize='md' mb={3}>
								Datas importantes
							</Heading>
							{academicEvents.length ? (
								<VStack align='stretch' gap={3}>
									{academicEvents.map((event) => (
										<Box
											key={`important-${event.id}`}
											borderLeftWidth='3px'
											borderColor='action.primary'
											pl={3}
										>
											<Text fontSize='xs' color='fg.muted'>
												{new Intl.DateTimeFormat('pt-BR', {
													day: '2-digit',
													month: 'short',
												}).format(new Date(event.startsAt))}
											</Text>
											<Text fontSize='sm' fontWeight='semibold'>
												{event.title}
											</Text>
											{event.description ? (
												<Text fontSize='xs' color='fg.muted'>
													{event.description}
												</Text>
											) : null}
										</Box>
									))}
								</VStack>
							) : (
								<Text fontSize='sm' color='fg.muted'>
									Nenhuma data importante neste mês.
								</Text>
							)}
						</Surface>
					</Flex>
				) : grouped.length ? (
					<VStack align='stretch' gap={4}>
						{grouped.map(([key, day]) => (
							<Box
								key={key}
								p={key === todayKey ? 2 : 0}
								borderRadius='lg'
								borderWidth={key === todayKey ? '1px' : '0'}
								borderColor='action.primary'
								bg={key === todayKey ? 'action.primarySubtle' : 'transparent'}
							>
								<Text fontWeight='semibold' textTransform='capitalize' mb={2}>
									{dateFormatter.format(new Date(`${key}T12:00:00`))}
								</Text>
								<VStack align='stretch' gap={2}>
									{day.sessions.map((session) => (
										<Flex
											key={session.id}
											align='start'
											justify='space-between'
											gap={4}
											p={3}
											borderRadius='lg'
											bg='bg.muted'
											wrap='wrap'
										>
											<HStack align='start' gap={3}>
												<Clock size={17} />
												<Box>
													<Text fontWeight='semibold'>{session.classTitle}</Text>
													<Text color='fg.muted' fontSize='sm'>
														{session.classCode}
														{session.topic ? ` · ${session.topic}` : ''}
													</Text>
												</Box>
											</HStack>
											<Text fontSize='sm' fontWeight='medium' whiteSpace='nowrap'>
												{timeFormatter.format(new Date(session.startsAt))}
												{session.endsAt
													? ` – ${timeFormatter.format(new Date(session.endsAt))}`
													: ''}
											</Text>
										</Flex>
									))}
									{day.academicEvents.map((event) => (
										<Flex
											key={`academic-event-${event.id}`}
											align='start'
											justify='space-between'
											gap={4}
											p={3}
											borderRadius='lg'
											bg={
												event.type === 'holiday' || event.type === 'break'
													? 'bg.muted'
													: 'action.primarySubtle'
											}
											wrap='wrap'
										>
											<HStack align='start' gap={3}>
												<Flag size={17} />
												<Box>
													<Text fontWeight='semibold'>{event.title}</Text>
													<Text color='fg.muted' fontSize='sm'>
														{event.description ?? 'Evento acadêmico'}
													</Text>
												</Box>
											</HStack>
											<Text fontSize='sm' fontWeight='medium' whiteSpace='nowrap'>
												{event.allDay
													? 'Dia inteiro'
													: timeFormatter.format(new Date(event.startsAt))}
											</Text>
										</Flex>
									))}
									{day.activities.map((activity) => (
										<Flex
											asChild
											key={`activity-${activity.id}`}
											align='start'
											justify='space-between'
											gap={4}
											p={3}
											borderRadius='lg'
											bg='action.primarySubtle'
											wrap='wrap'
										>
											<NavLink
												to={`/student/subjects/${activity.enrollmentId}/activities/${activity.id}`}
											>
												<HStack align='start' gap={3}>
													<ClipboardList size={17} />
													<Box>
														<Text fontWeight='semibold'>{activity.title}</Text>
														<Text color='fg.muted' fontSize='sm'>
															Prazo · {activity.classTitle}
														</Text>
													</Box>
												</HStack>
												<Text fontSize='sm' fontWeight='medium' whiteSpace='nowrap'>
													{timeFormatter.format(new Date(activity.dueAt!))}
												</Text>
											</NavLink>
										</Flex>
									))}
								</VStack>
							</Box>
						))}
					</VStack>
				) : null}
			</Surface>
		</NavigationPageShell>
	);
}
