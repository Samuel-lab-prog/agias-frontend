import type { StudentDashboard } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Heading, Link, SimpleGrid, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import { activityState, formatAcademicDate } from '../utils/academic-planning';

export function StudentProgressSummary({ dashboard }: { dashboard: StudentDashboard }) {
	const now = new Date();
	const lessons = dashboard.enrollments.flatMap((item) =>
		item.sessions.map((session) => ({ ...session, offering: item.classOffering })),
	);
	const next = lessons
		.filter(
			(session) =>
				new Date(session.startsAt) >= now && (session.status ?? 'scheduled') === 'scheduled',
		)
		.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
	const recent = lessons
		.filter((session) => session.status === 'completed')
		.sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt))[0];
	const activities = dashboard.enrollments.flatMap((item) => item.activities);
	const pending = activities.filter(
		(item) =>
			item.kind !== 'assessment' &&
			['pending', 'overdue'].includes(activityState(item, dashboard.submissions, now).status),
	).length;
	const exams = activities
		.filter(
			(item) => item.kind === 'assessment' && item.appliesAt && new Date(item.appliesAt) >= now,
		)
		.sort((a, b) => Date.parse(a.appliesAt!) - Date.parse(b.appliesAt!));
	return (
		<SimpleGrid columns={{ base: 1, md: 2 }} gap={3} aria-label='Resumo acadêmico'>
			<Surface variant='soft'>
				<Heading as='h2' fontSize='md'>
					Próxima aula
				</Heading>
				{next ? (
					<>
						<Link asChild color='action.primary'>
							<NavLink to={`/student/classes/${next.offering.id}`}>{next.offering.title}</NavLink>
						</Link>
						<Text fontSize='sm'>
							{formatAcademicDate(next.startsAt, { hour: '2-digit', minute: '2-digit' })}
						</Text>
					</>
				) : (
					<Text fontSize='sm' color='fg.muted'>
						Nenhuma aula futura prevista.
					</Text>
				)}
			</Surface>
			<Surface variant='soft'>
				<Heading as='h2' fontSize='md'>
					Conteúdo recente
				</Heading>
				<Text fontSize='sm'>
					{recent?.deliveredContent ?? recent?.topic ?? 'Nenhum conteúdo realizado publicado.'}
				</Text>
			</Surface>
			<Surface variant='soft'>
				<Heading as='h2' fontSize='md'>
					Atividades pendentes
				</Heading>
				<Text fontSize='sm'>
					{pending} atividade{pending !== 1 ? 's' : ''} aguardando entrega
				</Text>
			</Surface>
			<Surface variant='soft'>
				<Heading as='h2' fontSize='md'>
					Próxima avaliação
				</Heading>
				<Text fontSize='sm'>
					{exams[0]
						? `${exams[0].title} · ${formatAcademicDate(exams[0].appliesAt!)}`
						: 'Nenhuma avaliação agendada.'}
				</Text>
			</Surface>
		</SimpleGrid>
	);
}
