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
			colorPalette: 'orange',
			description: 'Não entregue',
		};
	}

	if (submission.grade !== null) {
		return {
			label: 'Avaliada',
			colorPalette: 'green',
			description: '',
		};
	}

	return {
		label: 'Entregue',
		colorPalette: 'blue',
		description: '',
	};
}

export function StudentActivitiesCard({ enrollments, submissions }: StudentActivitiesCardProps) {
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
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
				<HStack gap={2}>
					<CalendarDays size={18} />
					<Heading as='h3' textStyle='h6'>
						Minhas atividades
					</Heading>
				</HStack>

				<Button size='sm' variant='ghost' color='pink.100'>
					Ver todas as atividades
				</Button>
			</Flex>

			<VStack align='stretch' gap={0}>
				{activities.length === 0 ? (
					<Box px={2} py={3}>
						<Text textStyle='smaller' color='pink.100'>
							Nenhuma atividade encontrada para suas turmas.
						</Text>
					</Box>
				) : (
					activities.map((activity, index) => (
						<Flex
							key={`${activity.classOfferingId}-${activity.id}`}
							px={2}
							py={3}
							align='center'
							justify='space-between'
							borderTop={index === 0 ? '0' : '1px solid'}
							borderColor='border'
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'rgba(255,255,255,0.03)', transform: 'translateX(2px)' }}
						>
							<HStack align='start' gap={3} flex='1' minW={0}>
								<Box minW={0}>
									<Text textStyle='smaller' fontWeight='bold'>
										{activity.title} - {activity.classTitle}
									</Text>
									<Text textStyle='smaller' color='pink.100'>
										
									</Text>
									<Text textStyle='smaller' color='pink.100'>
										Postada em {new Intl.DateTimeFormat('pt-BR').format(new Date(activity.createdAt))}
									</Text>
									
								</Box>
							</HStack>

							<VStack align='end' gap={1} flexShrink={0}>
								<Badge colorPalette={getActivityStatus(activity, submissions).colorPalette}>
									{getActivityStatus(activity, submissions).label}
								</Badge>
								<Text textStyle='smaller' color='pink.100'>
										Entrega em {activity.dueAt ? new Intl.DateTimeFormat('pt-BR').format(new Date(activity.dueAt)) : 'sem prazo'}
									</Text>
							</VStack>
						</Flex>
					))
				)}
			</VStack>
		</Surface>
	);
}
