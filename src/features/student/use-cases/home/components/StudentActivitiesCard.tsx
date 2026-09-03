import type {
	StudentDashboardActivity,
	StudentDashboardSubmission,
	StudentEnrollment,
} from '@Api/academic/types';
import { BaseButton } from '@BaseComponents';
import { Badge, Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { CalendarDays } from 'lucide-react';

import { StudentCard, StudentCardHeader } from './StudentCard';

type StudentActivitiesCardProps = {
	enrollments: StudentEnrollment[];
	submissions: StudentDashboardSubmission[];
};

function getActivityStatus(
	activity: StudentDashboardActivity & { classOfferingId: number },
	submissions: StudentDashboardSubmission[],
) {
	const submission = submissions.find((item) => item.activityId === activity.id);
	const dueDate = activity.dueAt ? new Date(activity.dueAt).getTime() : null;
	const isOverdue = Boolean(!submission && dueDate !== null && dueDate < Date.now());

	if (!submission) {
		if (isOverdue) {
			return {
				label: 'Atrasada',
				bg: 'status.errorSubtle',
				color: 'status.error',
				description: 'Prazo expirado',
			};
		}

		return {
			label: 'Pendente',
			bg: 'action.primarySubtle',
			color: 'status.warning',
			description: 'Ainda não enviada',
		};
	}

	if (submission.grade !== null) {
		return {
			label: 'Avaliada',
			bg: 'action.primarySubtle',
			color: 'action.primary',
			subtitle: submission.submittedAt,
			description: '',
		};
	}

	return {
		label: 'Entregue',
		bg: 'action.primarySubtle',
		color: 'action.primaryStrong',
		subtitle: submission.submittedAt,
		description: '',
	};
}

function getTimeRemaining(dueAt: string) {
	const dueDate = new Date(dueAt).getTime();
	const now = Date.now();
	const diffMs = dueDate - now;

	if (diffMs < 0) {
		return 'Atrasada';
	}

	if (diffMs === 0) {
		return 'Entrega hoje';
	}

	const totalMinutes = Math.ceil(diffMs / (1000 * 60));
	const days = Math.floor(totalMinutes / (60 * 24));
	const remainingAfterDays = totalMinutes % (60 * 24);
	const hours = Math.floor(remainingAfterDays / 60);
	const minutes = remainingAfterDays % 60;

	const parts: string[] = [];

	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);

	if (parts.length === 0) {
		return 'Agora';
	}

	return `Em ${parts.join(' ')}`;
}

function getOverdueTime(dueAt: string) {
	const dueDate = new Date(dueAt).getTime();
	const now = Date.now();
	const diffMs = now - dueDate;

	if (diffMs <= 0) {
		return 'Vence hoje';
	}

	const totalMinutes = Math.ceil(diffMs / (1000 * 60));
	const days = Math.floor(totalMinutes / (60 * 24));
	const remainingAfterDays = totalMinutes % (60 * 24);
	const hours = Math.floor(remainingAfterDays / 60);
	const minutes = remainingAfterDays % 60;

	const parts: string[] = [];

	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);

	return parts.length > 0 ? `Atrasada há ${parts.join(' ')}` : 'Atrasada há poucos instantes';
}

function isPendingActivity(
	activity: StudentDashboardActivity & { classOfferingId: number },
	submissions: StudentDashboardSubmission[],
) {
	return !submissions.some((item) => item.activityId === activity.id);
}

export function StudentActivitiesCard({ enrollments, submissions }: StudentActivitiesCardProps) {
	const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
	const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
	const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
	const activities = enrollments
		.flatMap((enrollment) =>
			enrollment.activities.map((activity) => ({
				...activity,
				classTitle: enrollment.classOffering.title,
				classOfferingId: enrollment.classOffering.id,
			})),
		)
		.sort((a, b) => {
			const left = a.dueAt ? new Date(a.dueAt).getTime() : Number.POSITIVE_INFINITY;
			const right = b.dueAt ? new Date(b.dueAt).getTime() : Number.POSITIVE_INFINITY;
			return left - right;
		})
		.slice(0, 4);

	return (
		<StudentCard>
			<StudentCardHeader
				icon={<CalendarDays size={18} />}
				title='Minhas atividades'
				action={
					<BaseButton size='sm' variant='secondary' color='fg.muted'>
						Ver todas as atividades
					</BaseButton>
				}
			/>

			<VStack align='stretch' gap={0}>
				{activities.length === 0 ? (
					<Box px={2} py={3}>
						<Text
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							color='fg.muted'
							_dark={{ color: 'fg.muted' }}
						>
							Nenhuma atividade disponível no momento.
						</Text>
					</Box>
				) : (
					activities.map((activity, index) =>
						// Read once so TypeScript can narrow the optional subtitle cleanly.
						(() => {
							const activityStatus = getActivityStatus(activity, submissions);
							const subtitle = activityStatus.subtitle;

							return (
								<Flex
									key={`${activity.classOfferingId}-${activity.id}`}
									px={3}
									py={3}
									align='start'
									justify='space-between'
									direction={{ base: 'column', md: 'row' }}
									borderRadius='lg'
									bg={index % 2 === 0 ? 'bg.muted' : 'transparent'}
									transition='background-color 0.18s ease, transform 0.18s ease'
									cursor='pointer'
									_hover={{ bg: 'action.primarySubtle', transform: 'translateX(2px)' }}
								>
									<HStack align='start' gap={3} flex='1' minW={0} w='full'>
										<Box minW={0}>
											<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='bold'>
												{activity.title} - {activity.classTitle}
											</Text>
											<Text
												fontSize='0.8125rem'
												lineHeight='1.25rem'
												color='fg.muted'
												_dark={{ color: 'fg.muted' }}
											>
												Postada em {dateFormatter.format(new Date(activity.createdAt))} às{' '}
												{timeFormatter.format(new Date(activity.createdAt))}
											</Text>
											{activity.dueAt ? (
												<Text
													fontSize='0.8125rem'
													lineHeight='1.25rem'
													color='fg.muted'
													mt={1}
													_dark={{ color: 'fg.muted' }}
												>
													Entregar em {dateFormatter.format(new Date(activity.dueAt))} às{' '}
													{timeFormatter.format(new Date(activity.dueAt))}
												</Text>
											) : (
												<Text
													fontSize='0.8125rem'
													lineHeight='1.25rem'
													color='fg.muted'
													mt={1}
													_dark={{ color: 'fg.muted' }}
												>
													Sem prazo definido
												</Text>
											)}
										</Box>
									</HStack>

									<VStack
										align={{ base: 'start', md: 'end' }}
										gap={1}
										flexShrink={0}
										w={{ base: 'full', md: 'auto' }}
										mt={{ base: 2, md: 0 }}
									>
										<Badge
											bg={activityStatus.bg}
											color={activityStatus.color}
											borderRadius='full'
											px={3}
											py={1}
										>
											{activityStatus.label}
										</Badge>
										{isPendingActivity(activity, submissions) && activity.dueAt ? (
											<Text
												fontSize='0.8125rem'
												lineHeight='1.25rem'
												color='fg.muted'
												_dark={{ color: 'fg.muted' }}
												textAlign={{ base: 'left', md: 'right' }}
											>
												{getTimeRemaining(activity.dueAt) !== 'Atrasada'
													? getTimeRemaining(activity.dueAt)
													: null}
											</Text>
										) : null}
										{activityStatus.label === 'Atrasada' && activity.dueAt ? (
											<Text
												fontSize='0.8125rem'
												lineHeight='1.25rem'
												color='status.error'
												_dark={{ color: 'status.error' }}
												textAlign={{ base: 'left', md: 'right' }}
											>
												{getOverdueTime(activity.dueAt)}
											</Text>
										) : null}
										{subtitle ? (
											<Text
												fontSize='0.8125rem'
												lineHeight='1.25rem'
												color='fg.muted'
												_dark={{ color: 'fg.muted' }}
												textAlign={{ base: 'left', md: 'right' }}
											>
												{activityStatus.label === 'Avaliada' ? 'Avaliada em' : 'Entregue em'}{' '}
												{dateTimeFormatter.format(new Date(subtitle))}
											</Text>
										) : null}
									</VStack>
								</Flex>
							);
						})(),
					)
				)}
			</VStack>
		</StudentCard>
	);
}
