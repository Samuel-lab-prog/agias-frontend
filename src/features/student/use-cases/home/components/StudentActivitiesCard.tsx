import type {
	StudentDashboardActivity,
	StudentDashboardSubmission,
	StudentEnrollment,
} from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { CalendarDays } from 'lucide-react';

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
				bg: 'rgba(239, 68, 68, 0.16)',
				color: 'error',
				description: 'Prazo expirado',
			};
		}

		return {
			label: 'Pendente',
			bg: 'rgba(234, 179, 8, 0.16)',
			color: 'warning',
			description: 'Ainda não enviada',
		};
	}

	if (submission.grade !== null) {
		return {
			label: 'Avaliada',
			bg: 'rgba(34, 197, 94, 0.14)',
			color: 'accent',
			subtitle: submission.submittedAt,
			description: '',
		};
	}

	return {
		label: 'Entregue',
		bg: 'rgba(37, 99, 235, 0.16)',
		color: 'accentStrong',
		subtitle: submission.submittedAt,
		description: '',
	};
}

function getTimeRemaining(dueAt: string) {
	const dueDate = new Date(dueAt).getTime();
	const now = Date.now();
	const diffMs = dueDate - now;

	if (diffMs <= 0) {
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

	const getDaysLeft = (dueAt: string) => {
		const dueDate = new Date(dueAt);
		const today = new Date();
		const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const startOfDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
		const diffMs = startOfDueDate.getTime() - startOfToday.getTime();
		const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays <= 0) return 'Entrega hoje';
		if (diffDays === 1) return 'Falta 1 dia';
		return `Faltam ${diffDays} dias`;
	};

	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
				<HStack gap={2}>
					<CalendarDays size={18} />
					<Heading as='h3' textStyle='h6'>
						Minhas atividades
					</Heading>
				</HStack>

				<Button
					size='sm'
					variant='outline'
					color='textMuted'
					borderColor='border'
					bg='transparent'
					_hover={{ bg: 'surface', borderColor: 'borderHover', color: 'text' }}
				>
					Ver todas as atividades
				</Button>
			</Flex>

			<VStack align='stretch' gap={0}>
				{activities.length === 0 ? (
					<Box px={2} py={3}>
						<Text textStyle='smaller' color='textMuted'>
							Nenhuma atividade disponível no momento.
						</Text>
					</Box>
				) : (
					activities.map((activity, index) => (
						<Flex
							key={`${activity.classOfferingId}-${activity.id}`}
							px={3}
							py={3}
							align='start'
							justify='space-between'
							direction={{ base: 'column', md: 'row' }}
							borderRadius='lg'
							bg={index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
							transition='background-color 0.18s ease, transform 0.18s ease'
							cursor='pointer'
							_hover={{ bg: 'rgba(37, 99, 235, 0.08)', transform: 'translateX(2px)' }}
						>
							<HStack align='start' gap={3} flex='1' minW={0} w='full'>
								<Box minW={0}>
									<Text textStyle='smaller' fontWeight='bold'>
										{activity.title} - {activity.classTitle}
									</Text>
									<Text textStyle='smaller' color='textMuted'>
										Postada em {dateFormatter.format(new Date(activity.createdAt))} às{' '}
										{timeFormatter.format(new Date(activity.createdAt))}
									</Text>
									{activity.dueAt ? (
										<Text textStyle='smaller' color='textMuted' mt={1}>
											Entregar em {dateFormatter.format(new Date(activity.dueAt))} às{' '}
											{timeFormatter.format(new Date(activity.dueAt))}
										</Text>
									) : (
										<Text textStyle='smaller' color='textMuted' mt={1}>
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
									bg={getActivityStatus(activity, submissions).bg}
									color={getActivityStatus(activity, submissions).color}
									borderRadius='full'
									px={3}
									py={1}
								>
									{getActivityStatus(activity, submissions).label}
								</Badge>
								{isPendingActivity(activity, submissions) && activity.dueAt ? (
									<Text textStyle='smaller' color='textMuted' textAlign={{ base: 'left', md: 'right' }}>
										{getTimeRemaining(activity.dueAt)}
									</Text>
								) : null}
								{getActivityStatus(activity, submissions).label === 'Atrasada' && activity.dueAt ? (
									<Text textStyle='smaller' color='error' textAlign={{ base: 'left', md: 'right' }}>
										{getOverdueTime(activity.dueAt)}
									</Text>
								) : null}
								{getActivityStatus(activity, submissions).subtitle ? (
									<Text
										textStyle='smaller'
										color='textMuted'
										textAlign={{ base: 'left', md: 'right' }}
									>
										{getActivityStatus(activity, submissions).label === 'Avaliada'
											? 'Avaliada em'
											: 'Entregue em'}{' '}
										{dateTimeFormatter.format(
											new Date(getActivityStatus(activity, submissions).subtitle),
										)}
									</Text>
								) : null}
							</VStack>
						</Flex>
					))
				)}
			</VStack>
		</Surface>
	);
}
