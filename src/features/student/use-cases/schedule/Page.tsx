import { BaseButton, EmptyStateCard, ErrorStateCard, Surface } from '@BaseComponents';
import { Box, Flex, Heading, HStack, NativeSelect, Text, VStack } from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { AcademicPeriodSelector } from '../../components/AcademicPeriodSelector';
import { dateKey, formatAcademicDate, periodLabel } from '../../utils/academic-planning';
import { studentNavigationPreset } from '../../utils/navigation-routes';
import { useMyAcademicCalendarEvents } from '../hooks/useMyAcademicCalendarEvents';
import { useMyStudentDashboard } from '../hooks/useMyStudentDashboard';
import { useStudentPeriods } from '../hooks/useStudentPeriods';
import {
	addDays,
	buildCalendarEntries,
	type CalendarKind,
	calendarRange,
	dayDate,
	entriesForDay,
} from './calendar';
import { CalendarEntryCard } from './CalendarEntryCard';

const kinds: Array<[CalendarKind, string]> = [
	['all', 'Tudo'],
	['classes', 'Aulas'],
	['activities', 'Atividades'],
	['assessments', 'Avaliações'],
	['academicEvents', 'Eventos'],
];
export function StudentSchedulePage() {
	const dashboardQuery = useMyStudentDashboard();
	const enrollments = dashboardQuery.dashboard?.enrollments ?? [];
	const { periods, selectedPeriod, setSelectedPeriod, academicPeriods } =
		useStudentPeriods(enrollments);
	const [view, setView] = useState<'week' | 'month'>('month');
	const [offset, setOffset] = useState(0);
	const [classId, setClassId] = useState('all');
	const [kind, setKind] = useState<CalendarKind>('all');
	const [selectedDay, setSelectedDay] = useState<string | null>(null);
	const now = new Date();
	const period =
		academicPeriods.find((item) => item.code === selectedPeriod) ??
		enrollments.find((item) => periodLabel(item) === selectedPeriod)?.classOffering.academicPeriod;
	const anchor =
		period && (now < new Date(period.startsAt) || now > new Date(period.endsAt))
			? new Date(period.startsAt)
			: now;
	const { headingDate, days } = calendarRange(anchor, offset, view);
	const from = new Date(`${dateKey(days[0]!)}T00:00:00-03:00`);
	const to = new Date(`${dateKey(addDays(days.at(-1)!, 1))}T00:00:00-03:00`);
	const calendarQuery = useMyAcademicCalendarEvents(from, to);
	const entries = buildCalendarEntries(enrollments, calendarQuery.events, {
		period: selectedPeriod,
		classId,
		kind,
	});
	const visibleDays = days.filter(
		(day) =>
			(!selectedDay || dateKey(day) === selectedDay) && entriesForDay(entries, dateKey(day)).length,
	);
	const loading = dashboardQuery.isLoading || calendarQuery.isLoading;
	const error = dashboardQuery.isError || calendarQuery.isError;
	const changeRange = (amount: number) => {
		setOffset((value) => value + amount);
		setSelectedDay(null);
	};
	const choosePeriod = (value: string) => {
		setSelectedPeriod(value);
		setClassId('all');
		setOffset(0);
		setSelectedDay(null);
	};

	return (
		<NavigationPageShell preset={studentNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Box>
					<Heading as='h1' fontSize={{ base: 'xl', md: '2xl' }}>
						Agenda de aulas
					</Heading>
					<Text color='fg.muted' mt={1}>
						Aulas, avaliações, prazos e calendário acadêmico.
					</Text>
				</Box>
				<Flex gap={3} wrap='wrap' align='end'>
					<AcademicPeriodSelector
						periods={periods}
						value={selectedPeriod}
						onChange={choosePeriod}
					/>
					<NativeSelect.Root size='sm' width={{ base: 'full', sm: '240px' }}>
						<NativeSelect.Field
							aria-label='Filtrar por disciplina'
							value={classId}
							onChange={(event) => {
								setClassId(event.target.value);
								setSelectedDay(null);
							}}
						>
							<option value='all'>Todas as disciplinas</option>
							{enrollments
								.filter((item) => selectedPeriod === 'all' || periodLabel(item) === selectedPeriod)
								.map((item) => (
									<option key={item.id} value={item.classOffering.id}>
										{item.classOffering.title} · {periodLabel(item)}
									</option>
								))}
						</NativeSelect.Field>
					</NativeSelect.Root>
				</Flex>
				<HStack gap={2} flexWrap='wrap' aria-label='Tipos de evento'>
					{kinds.map(([value, label]) => (
						<BaseButton
							key={value}
							size='sm'
							variant={kind === value ? 'primary' : 'secondary'}
							aria-pressed={kind === value}
							onClick={() => {
								setKind(value);
								setSelectedDay(null);
							}}
						>
							{label}
						</BaseButton>
					))}
				</HStack>
				<Surface variant='panel'>
					<Flex justify='space-between' gap={3} wrap='wrap' align='center' mb={4}>
						<Heading as='h2' fontSize='lg' aria-live='polite'>
							{view === 'month'
								? formatAcademicDate(headingDate, {
										day: undefined,
										month: 'long',
										year: 'numeric',
									})
								: `${formatAcademicDate(days[0]!)} – ${formatAcademicDate(days.at(-1)!, { year: 'numeric' })}`}
						</Heading>
						<HStack gap={2} flexWrap='wrap'>
							<HStack gap={2}>
								{(['week', 'month'] as const).map((value) => (
									<BaseButton
										key={value}
										size='sm'
										variant={view === value ? 'primary' : 'secondary'}
										aria-pressed={view === value}
										onClick={() => {
											setView(value);
											setOffset(0);
											setSelectedDay(null);
										}}
									>
										{value === 'week' ? 'Semana' : 'Mês'}
									</BaseButton>
								))}
							</HStack>
							<HStack gap={2}>
								<BaseButton
									size='sm'
									variant='secondary'
									aria-label='Período anterior'
									onClick={() => changeRange(-1)}
								>
									<ChevronLeft size={16} />
								</BaseButton>
								<BaseButton size='sm' variant='secondary' onClick={() => choosePeriod('all')}>
									Hoje
								</BaseButton>
								<BaseButton
									size='sm'
									variant='secondary'
									aria-label='Próximo período'
									onClick={() => changeRange(1)}
								>
									<ChevronRight size={16} />
								</BaseButton>
							</HStack>
						</HStack>
					</Flex>
					{loading ? (
						<Text role='status'>Carregando agenda…</Text>
					) : error ? (
						<ErrorStateCard
							eyebrow='AGENDA'
							title='Não foi possível carregar a agenda'
							description='Verifique sua conexão e tente novamente.'
							actionLabel='Tentar novamente'
							onAction={() => {
								void dashboardQuery.refetch();
								void calendarQuery.refetch();
							}}
						/>
					) : (
						<>
							{view === 'month' ? (
								<Box mb={5}>
									<Box display='grid' gridTemplateColumns='repeat(7, minmax(0, 1fr))' gap={1}>
										{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
											<Text key={day} textAlign='center' fontSize='xs' py={2} aria-hidden='true'>
												{day}
											</Text>
										))}
									</Box>
									<Box display='grid' gridTemplateColumns='repeat(7, minmax(0, 1fr))' gap={1}>
										{days.map((day) => {
											const key = dateKey(day);
											const items = entriesForDay(entries, key);
											return (
												<Box
													asChild
													key={key}
													minH={{ base: '64px', md: '104px' }}
													p={{ base: 1, md: 2 }}
													borderWidth='1px'
													borderColor={
														key === dateKey(now) || key === selectedDay
															? 'action.primary'
															: 'border.default'
													}
													bg={key === selectedDay ? 'action.primarySubtle' : 'bg.surface'}
													borderRadius='md'
													opacity={day.getUTCMonth() === headingDate.getUTCMonth() ? 1 : 0.5}
													cursor='pointer'
													textAlign='left'
													_focusVisible={{ outline: '2px solid', outlineColor: 'action.primary' }}
												>
													<button
														type='button'
														aria-pressed={key === selectedDay}
														aria-label={`${formatAcademicDate(day, { month: 'long', year: 'numeric' })}: ${items.length} eventos`}
														onClick={() => setSelectedDay(key === selectedDay ? null : key)}
													>
														<Text fontSize='sm'>{day.getUTCDate()}</Text>
														{items.slice(0, 2).map((item) => (
															<Text
																key={item.id}
																fontSize='xs'
																truncate
																color={
																	item.session?.status === 'cancelled' ? 'status.error' : 'fg.muted'
																}
																display={{ base: 'none', md: 'block' }}
															>
																{item.session?.status === 'cancelled'
																	? 'Cancelada: '
																	: item.session?.replacesSessionId
																		? 'Reposição: '
																		: ''}
																{item.title}
															</Text>
														))}
														{items.length ? (
															<Text fontSize='xs' color='action.primary'>
																{items.length}{' '}
																<Box as='span' display={{ base: 'none', md: 'inline' }}>
																	evento{items.length === 1 ? '' : 's'}
																</Box>
															</Text>
														) : null}
													</button>
												</Box>
											);
										})}
									</Box>
								</Box>
							) : null}
							{selectedDay ? (
								<HStack mb={3} justify='space-between'>
									<Heading as='h3' fontSize='md'>
										{formatAcademicDate(dayDate(selectedDay), { month: 'long' })}
									</Heading>
									<BaseButton size='sm' variant='secondary' onClick={() => setSelectedDay(null)}>
										Ver todo o período
									</BaseButton>
								</HStack>
							) : null}
							{!visibleDays.length ? (
								<EmptyStateCard
									eyebrow='AGENDA'
									title='Nenhum evento neste período'
									description='Selecione outro período, dia ou disciplina para consultar a agenda.'
								/>
							) : (
								<VStack align='stretch' gap={5}>
									{visibleDays.map((day) => (
										<Box key={dateKey(day)}>
											<Heading as='h3' fontSize='sm' mb={2}>
												{formatAcademicDate(day, { weekday: 'long', month: 'long' })}
											</Heading>
											<VStack align='stretch' gap={2}>
												{entriesForDay(entries, dateKey(day)).map((entry) => (
													<CalendarEntryCard key={entry.id} entry={entry} />
												))}
											</VStack>
										</Box>
									))}
								</VStack>
							)}
						</>
					)}
				</Surface>
			</VStack>
		</NavigationPageShell>
	);
}
