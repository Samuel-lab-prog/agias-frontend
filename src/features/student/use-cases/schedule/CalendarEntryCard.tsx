import { Badge, Box, Link, Text } from '@chakra-ui/react';
import { focusRing, interactionTransition } from '@core/themes/motion';
import { ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { LessonStatusBadge } from '../../components/LessonStatusBadge';
import { formatAcademicDate } from '../../utils/academic-planning';
import type { CalendarEntry } from './calendar';

const labels = {
	classes: 'Aula',
	activities: 'Prazo de atividade',
	assessments: 'Avaliação',
	academicEvents: 'Evento acadêmico',
};
export function CalendarEntryCard({ entry }: { entry: CalendarEntry }) {
	return (
		<Box
			borderWidth='1px'
			borderColor='border.default'
			borderRadius='lg'
			p={3}
			transition={interactionTransition}
			_focusWithin={{ borderColor: 'action.primary', bg: 'action.primarySubtle' }}
		>
			<Badge
				colorPalette={
					entry.kind === 'assessments'
						? 'purple'
						: entry.kind === 'academicEvents'
							? 'orange'
							: 'blue'
				}
				mb={2}
			>
				{labels[entry.kind]}
			</Badge>
			{entry.href ? (
				<Link
					asChild
					display='flex'
					width='fit-content'
					gap={2}
					minH='36px'
					color='action.primary'
					fontWeight='semibold'
					_focusVisible={focusRing}
					_hover={{ color: 'action.primaryStrong', textDecoration: 'underline' }}
				>
					<NavLink to={entry.href}>
						{entry.title}
						<ArrowUpRight size={16} aria-hidden='true' style={{ flexShrink: 0 }} />
					</NavLink>
				</Link>
			) : (
				<Text fontWeight='semibold'>{entry.title}</Text>
			)}
			<Text fontSize='xs' color='fg.muted' mb={1}>
				{entry.allDay
					? 'Dia inteiro'
					: formatAcademicDate(entry.startsAt, {
							day: undefined,
							month: undefined,
							hour: '2-digit',
							minute: '2-digit',
						})}
			</Text>
			{entry.session ? <LessonStatusBadge session={entry.session} /> : null}
			{entry.description ? (
				<Text fontSize='sm' mt={1}>
					{entry.description}
				</Text>
			) : null}
			{entry.session?.publicNotes ? (
				<Text fontSize='sm' mt={1}>
					{entry.session.publicNotes}
				</Text>
			) : null}
		</Box>
	);
}
