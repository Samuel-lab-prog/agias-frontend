import { Surface } from '@BaseComponents';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

import { LessonStatusBadge } from '../../../components/LessonStatusBadge';
import { MaterialLinks } from '../../../components/MaterialLinks';
import type { SubjectSessionDetails } from '../types';

export function SubjectSchedule({ sessions }: { sessions: SubjectSessionDetails[] }) {
	return (
		<Surface variant='panel'>
			<Heading as='h2' fontSize='lg' mb={4}>
				Aulas e conteúdos
			</Heading>
			{!sessions.length ? (
				<Text color='fg.muted' fontSize='sm'>
					Nenhuma aula cadastrada para esta disciplina.
				</Text>
			) : (
				<VStack align='stretch' gap={3}>
					{sessions.map((session) => (
						<Box key={session.id} p={3} borderRadius='lg' bg='bg.muted'>
							<Text fontWeight='semibold' fontSize='sm' mb={1}>
								{session.date} · {session.time}
							</Text>
							<LessonStatusBadge session={session} />
							<Text fontSize='sm' mt={2}>
								Planejado: {session.topic}
							</Text>
							{session.status === 'completed' ? (
								<Text fontSize='sm'>
									Ministrado: {session.deliveredContent ?? 'Conteúdo realizado ainda não informado'}
								</Text>
							) : null}
							<Text fontSize='xs' color='fg.muted' mt={1}>
								{session.room ?? 'Sala ainda não informada'}
							</Text>
							{session.publicNotes ? (
								<Text fontSize='sm' mt={1}>
									{session.publicNotes}
								</Text>
							) : null}
							<Box mt={2}>
								<MaterialLinks materials={session.materials ?? []} />
							</Box>
						</Box>
					))}
				</VStack>
			)}
		</Surface>
	);
}
