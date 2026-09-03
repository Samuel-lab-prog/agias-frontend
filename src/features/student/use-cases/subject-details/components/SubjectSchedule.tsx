import { Surface } from '@BaseComponents';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { CalendarDays } from 'lucide-react';

import type { SubjectSessionDetails } from '../types';

export function SubjectSchedule({ sessions }: { sessions: SubjectSessionDetails[] }) {
	return (
		<Surface variant='panel'>
			<HStack gap={2} mb={4}>
				<CalendarDays size={18} />
				<Heading as='h2' fontSize='lg'>
					Aulas
				</Heading>
			</HStack>
			{sessions.length === 0 ? (
				<Text color='fg.muted' fontSize='sm'>
					Nenhuma aula cadastrada para esta disciplina.
				</Text>
			) : (
				<VStack align='stretch' gap={2}>
					{sessions.map((session) => (
						<HStack key={session.id} align='start' gap={4} p={3} borderRadius='lg' bg='bg.muted'>
							<Box minW='96px'>
								<Text fontWeight='semibold' fontSize='sm'>
									{session.date}
								</Text>
								<Text color='fg.muted' fontSize='xs'>
									{session.time}
								</Text>
							</Box>
							<Text fontSize='sm'>{session.topic}</Text>
						</HStack>
					))}
				</VStack>
			)}
		</Surface>
	);
}
