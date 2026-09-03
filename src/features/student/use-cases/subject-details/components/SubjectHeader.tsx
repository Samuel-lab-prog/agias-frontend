import { BaseButton, Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { ArrowLeft, BookOpen, CalendarRange, Clock3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import type { SubjectDetails } from '../types';

export function SubjectHeader({ details }: { details: SubjectDetails }) {
	return (
		<Surface variant='panel'>
			<VStack align='stretch' gap={5}>
				<HStack justify='space-between' align='start' gap={4} flexWrap='wrap'>
					<HStack align='start' gap={3} minW={0}>
						<Box color='action.primary' pt={1}>
							<BookOpen size={22} />
						</Box>
						<Box minW={0}>
							<Text color='fg.muted' fontSize='sm' mb={1}>
								{details.code}
							</Text>
							<Heading as='h1' fontSize={{ base: 'xl', md: '2xl' }} lineHeight='1.2'>
								{details.title}
							</Heading>
						</Box>
					</HStack>
					<BaseButton asChild variant='secondary' size='sm'>
						<NavLink to='/student'>
							<ArrowLeft size={16} /> Voltar
						</NavLink>
					</BaseButton>
				</HStack>

				<SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
					<HStack>
						<CalendarRange size={16} />
						<Text fontSize='sm'>{details.period}</Text>
					</HStack>
					<HStack>
						<Clock3 size={16} />
						<Text fontSize='sm'>{details.shift}</Text>
					</HStack>
					<Badge justifySelf={{ sm: 'end' }} variant='subtle'>
						{details.status}
					</Badge>
				</SimpleGrid>
			</VStack>
		</Surface>
	);
}
