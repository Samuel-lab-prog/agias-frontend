import { Box, Text } from '@chakra-ui/react';
import { contentEntry, interactiveStyles } from '@core/themes/motion';

import { dateKey, formatAcademicDate } from '../../utils/academic-planning';
import { type CalendarEntry } from './calendar';
type CalendarMonthProps = {
	days: Date[];
	headingDate: Date;
	entriesByDay: Map<string, CalendarEntry[]>;
	selectedDay: string | null;
	setSelectedDay: (day: string | null) => void;
};
export function CalendarMonth({
	days,
	headingDate,
	entriesByDay,
	selectedDay,
	setSelectedDay,
}: CalendarMonthProps) {
	const today = dateKey(new Date());
	return (
		<Box mb={5} css={contentEntry}>
			<Text fontSize='sm' color='fg.muted' mb={3}>
				Selecione um dia para ver os detalhes. Clique novamente para ver todos.
			</Text>
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
					const items = entriesByDay.get(key) ?? [];
					return (
						<Box
							asChild
							{...interactiveStyles.day}
							key={key}
							minH={{ base: '64px', md: '104px' }}
							p={{ base: 1, md: 2 }}
							borderWidth='1px'
							borderColor={
								key === today || key === selectedDay ? 'action.primary' : 'border.default'
							}
							bg={key === selectedDay ? 'action.primarySubtle' : 'bg.surface'}
							borderRadius='md'
							opacity={day.getUTCMonth() === headingDate.getUTCMonth() ? 1 : 0.5}
							cursor='pointer'
							textAlign='left'
						>
							<button
								type='button'
								aria-pressed={key === selectedDay}
								aria-current={key === today ? 'date' : undefined}
								aria-label={`${formatAcademicDate(day, { month: 'long', year: 'numeric' })}: ${items.length} eventos`}
								onClick={() => setSelectedDay(key === selectedDay ? null : key)}
							>
								<Text
									fontSize='sm'
									fontWeight={key === today || key === selectedDay ? 'bold' : 'normal'}
									color={key === today ? 'action.primary' : 'fg.default'}
								>
									{day.getUTCDate()}
								</Text>
								{items.slice(0, 2).map((item) => (
									<Text
										key={item.id}
										fontSize='xs'
										truncate
										color={item.session?.status === 'cancelled' ? 'status.error' : 'fg.muted'}
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
	);
}
