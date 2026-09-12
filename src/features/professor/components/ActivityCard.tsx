import type { Activity } from '@Api/teaching/types';
import { Surface } from '@BaseComponents';
import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { CalendarDays, ClipboardList, FileCheck2 } from 'lucide-react';

import { formatDate } from '../utils';
import { ActionLink, IconTile, StatusPill } from './TeachingUI';

export function ActivityCard({
	activity,
	inClass = false,
}: {
	activity: Activity;
	inClass?: boolean;
}) {
	const pastDue = activity.dueAt && Date.parse(activity.dueAt) < Date.now();
	return (
		<Surface variant='panel'>
			<HStack align='start' gap={4}>
				<Box display={{ base: 'none', md: 'block' }}>
					<IconTile icon={ClipboardList} />
				</Box>
				<Box flex='1' minW={0}>
					<HStack gap={2} flexWrap='wrap' mb={2}>
						<StatusPill tone='accent'>
							{activity.kind === 'assessment' ? 'Avaliação' : 'Atividade'}
						</StatusPill>
						{pastDue && <StatusPill>Prazo encerrado</StatusPill>}
						<Text fontSize='xs' color='fg.muted'>
							{activity.classOffering.title}
						</Text>
					</HStack>
					<Heading as='h3' fontSize='lg' overflowWrap='anywhere'>
						{activity.title}
					</Heading>
					{activity.description && (
						<Text mt={2} fontSize='sm' color='fg.muted' whiteSpace='pre-wrap'>
							{activity.description}
						</Text>
					)}
					<HStack mt={4} gap={4} flexWrap='wrap' color='fg.muted' fontSize='sm'>
						<HStack gap={1.5}>
							<CalendarDays size={15} aria-hidden='true' />
							<Text>
								{activity.kind === 'assessment'
									? `Aplicação: ${formatDate(activity.appliesAt)}`
									: `Entrega: ${formatDate(activity.dueAt)}`}
							</Text>
						</HStack>
						<HStack gap={1.5}>
							<FileCheck2 size={15} aria-hidden='true' />
							<Text>{activity._count.submissions} entregas registradas</Text>
						</HStack>
					</HStack>
					{activity.kind === 'assessment' && activity.dueAt && (
						<Text mt={2} fontSize='sm' color='fg.muted'>
							Entrega: {formatDate(activity.dueAt)}
						</Text>
					)}
					<HStack
						mt={4}
						pt={3}
						borderTopWidth='1px'
						borderColor='border.muted'
						justify='space-between'
						gap={3}
						flexWrap='wrap'
					>
						<Text fontSize='sm' fontWeight='semibold'>
							{activity.maxGrade === null
								? 'Sem pontuação definida'
								: `${activity.maxGrade.toLocaleString('pt-BR')} pontos`}
						</Text>
						{inClass ? (
							<Text color='fg.muted' fontSize='xs'>
								{activity.allowLateSubmissions
									? 'Aceita entregas após o prazo'
									: 'Entregas até o prazo'}
							</Text>
						) : (
							<ActionLink to={`/professor/classes/${activity.classOfferingId}?tab=activities`}>
								Ver atividades da turma
							</ActionLink>
						)}
					</HStack>
				</Box>
			</HStack>
		</Surface>
	);
}
