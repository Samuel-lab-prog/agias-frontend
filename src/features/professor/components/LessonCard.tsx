import type { Lesson } from '@Api/teaching/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { Clock3, ExternalLink, MapPin } from 'lucide-react';

import { formatDate, safeMaterialUrl } from '../utils';
import { ActionLink, StatusPill } from './TeachingUI';

export function LessonCard({ lesson, inClass = false }: { lesson: Lesson; inClass?: boolean }) {
	const labels: Record<string, string> = {
		scheduled: 'Agendada',
		completed: 'Realizada',
		cancelled: 'Cancelada',
		missed: 'Não realizada',
		rescheduled: 'Remarcada',
	};
	return (
		<Surface variant='panel' id={`lesson-${lesson.id}`}>
			<HStack align='start' gap={4} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
				<Box
					minW='58px'
					textAlign='center'
					bg='action.primarySubtle'
					color='action.primary'
					borderRadius='lg'
					p={2.5}
				>
					<Text fontSize='2xl' fontWeight='bold' lineHeight='1.1'>
						{formatDate(lesson.startsAt, { day: '2-digit' })}
					</Text>
					<Text fontSize='xs' textTransform='uppercase' mt={1}>
						{formatDate(lesson.startsAt, { month: 'short' })}
					</Text>
				</Box>
				<VStack align='stretch' gap={2} flex='1' minW='180px'>
					<HStack flexWrap='wrap' gap={2}>
						<StatusPill
							tone={
								lesson.status === 'completed'
									? 'success'
									: lesson.status === 'scheduled'
										? 'accent'
										: 'neutral'
							}
						>
							{labels[lesson.status] ?? lesson.status}
						</StatusPill>
						<Text color='fg.muted' fontSize='xs'>
							{lesson.classOffering.title}
						</Text>
					</HStack>
					<Heading as='h3' fontSize='md' overflowWrap='anywhere'>
						{lesson.topic || 'Aula sem tema definido'}
					</Heading>
					<HStack flexWrap='wrap' gap={4} fontSize='sm' color='fg.muted'>
						<HStack gap={1.5}>
							<Clock3 size={14} aria-hidden='true' />
							<Text>
								{formatDate(lesson.startsAt, { hour: '2-digit', minute: '2-digit' })}
								{lesson.endsAt
									? ` – ${formatDate(lesson.endsAt, { hour: '2-digit', minute: '2-digit' })}`
									: ''}
							</Text>
						</HStack>
						<HStack gap={1.5}>
							<MapPin size={14} aria-hidden='true' />
							<Text>{lesson.room || 'Local não informado'}</Text>
						</HStack>
					</HStack>
				</VStack>
				{!inClass && (
					<ActionLink to={`/professor/classes/${lesson.classOfferingId}?tab=lessons`}>
						Ver turma
					</ActionLink>
				)}
			</HStack>
			{inClass && (lesson.deliveredContent || lesson.publicNotes) && (
				<Box mt={4} borderTopWidth='1px' borderColor='border.muted' pt={3}>
					<Text fontSize='sm' color='fg.muted' whiteSpace='pre-wrap'>
						{lesson.deliveredContent || lesson.publicNotes}
					</Text>
				</Box>
			)}
			{inClass && lesson.materials.length > 0 && (
				<HStack mt={4} gap={2} flexWrap='wrap'>
					{lesson.materials.map(
						(material) =>
							safeMaterialUrl(material.url) && (
								<BaseButton
									key={material.id}
									variant='secondary'
									size='sm'
									asChild
									whiteSpace='normal'
									h='auto'
									py={2}
								>
									<a href={material.url} target='_blank' rel='noreferrer'>
										{material.title}
										<ExternalLink size={14} aria-hidden='true' />
									</a>
								</BaseButton>
							),
					)}
				</HStack>
			)}
		</Surface>
	);
}
