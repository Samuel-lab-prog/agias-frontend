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

	if (!submission) {
		return {
			label: 'Pendente',
			colorPalette: 'gray',
			description: 'Ainda não enviada',
		};
	}

	if (submission.grade !== null) {
		return {
			label: 'Avaliada',
			colorPalette: 'gray',
			description: '',
		};
	}

	return {
		label: 'Entregue',
		colorPalette: 'gray',
		description: '',
	};
}

export function StudentActivitiesCard({ enrollments, submissions }: StudentActivitiesCardProps) {
	const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' });
	const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
							px={2}
							py={3}
							align='start'
							justify='space-between'
							direction={{ base: 'column', md: 'row' }}
							borderTop={index === 0 ? '0' : '1px solid'}
							borderColor='border'
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'surface', transform: 'translateX(2px)' }}
						>
							<HStack align='start' gap={3} flex='1' minW={0} w='full'>
								<Box minW={0}>
									<Text textStyle='smaller' fontWeight='bold'>
										{activity.title} - {activity.classTitle}
									</Text>
									<Text textStyle='smaller' color='textMuted'>
										Postada em {dateFormatter.format(new Date(activity.createdAt))}
									</Text>
									
								</Box>
							</HStack>

							<VStack align={{ base: 'start', md: 'end' }} gap={1} flexShrink={0} w={{ base: 'full', md: 'auto' }} mt={{ base: 2, md: 0 }}>
								<Badge colorPalette={getActivityStatus(activity, submissions).colorPalette}>
									{getActivityStatus(activity, submissions).label}
								</Badge>
								{activity.dueAt ? (
									<Text textStyle='smaller' color='textMuted' textAlign={{ base: 'left', md: 'right' }}>
										Entrega em {dateFormatter.format(new Date(activity.dueAt))} às{' '}
										{timeFormatter.format(new Date(activity.dueAt))}
										<br />
										{getDaysLeft(activity.dueAt)}
									</Text>
								) : (
									<Text textStyle='smaller' color='textMuted'>
										Sem prazo definido
									</Text>
								)}
							</VStack>
						</Flex>
					))
				)}
			</VStack>
		</Surface>
	);
}
