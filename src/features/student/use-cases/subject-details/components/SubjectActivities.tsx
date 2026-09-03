import { Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { ClipboardList } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import type { SubjectActivityDetails } from '../types';

const statusStyles: Record<SubjectActivityDetails['status'], { bg: string; color: string }> = {
	pending: { bg: 'status.warningSubtle', color: 'status.warning' },
	overdue: { bg: 'status.errorSubtle', color: 'status.error' },
	submitted: { bg: 'action.primarySubtle', color: 'action.primaryStrong' },
	graded: { bg: 'action.primarySubtle', color: 'action.primary' },
};

export function SubjectActivities({
	activities,
	enrollmentId,
}: {
	activities: SubjectActivityDetails[];
	enrollmentId: number;
}) {
	return (
		<Surface variant='panel'>
			<HStack gap={2} mb={4}>
				<ClipboardList size={18} />
				<Heading as='h2' fontSize='lg'>
					Atividades
				</Heading>
			</HStack>
			{activities.length === 0 ? (
				<Text color='fg.muted' fontSize='sm'>
					Nenhuma atividade cadastrada para esta disciplina.
				</Text>
			) : (
				<VStack align='stretch' gap={2}>
					{activities.map((activity) => {
						const styles = statusStyles[activity.status];
						return (
							<HStack
								asChild
								key={activity.id}
								align='start'
								justify='space-between'
								gap={4}
								p={3}
								borderRadius='lg'
								bg='bg.muted'
								cursor='pointer'
								transition='background-color 0.18s ease, transform 0.18s ease'
								_hover={{ bg: 'action.primarySubtle', transform: 'translateX(2px)' }}
							>
								<NavLink
									to={`/student/subjects/${enrollmentId}/activities/${activity.id}`}
									aria-label={`Ver detalhes de ${activity.title}`}
								>
									<Box minW={0}>
										<Text fontWeight='semibold' fontSize='sm'>
											{activity.title}
										</Text>
										{activity.description ? (
											<Text color='fg.muted' fontSize='sm' mt={1}>
												{activity.description}
											</Text>
										) : null}
										<Text color='fg.muted' fontSize='xs' mt={1}>
											Prazo: {activity.dueLabel}
										</Text>
									</Box>
									<VStack align='end' gap={1} flexShrink={0}>
										<Badge bg={styles.bg} color={styles.color}>
											{activity.statusLabel}
										</Badge>
										{activity.grade ? <Text fontSize='xs'>Nota: {activity.grade}</Text> : null}
									</VStack>
								</NavLink>
							</HStack>
						);
					})}
				</VStack>
			)}
		</Surface>
	);
}
