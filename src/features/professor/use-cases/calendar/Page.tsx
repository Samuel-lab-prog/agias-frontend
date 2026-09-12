import { teaching } from '@Api/teaching/endpoints';
import type { Lesson } from '@Api/teaching/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { LessonCard } from '../../components/LessonCard';
import { IconTile, PageHeader, Pagination, QueryState } from '../../components/TeachingUI';
import { useTeachingQuery } from '../../hooks';
import { formatDate, localDay, monthRange } from '../../utils';

export function CalendarPage() {
	const [month, setMonth] = useState(
		() => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
	);
	const [page, setPage] = useState(1);
	const range = monthRange(month);
	const query = useTeachingQuery(['lessons', range, page], () =>
		teaching.lessons({ ...range, page }),
	);
	const groups = new Map<string, Lesson[]>();
	for (const lesson of query.data?.items ?? []) {
		const day = localDay(lesson.startsAt);
		groups.set(day, [...(groups.get(day) ?? []), lesson]);
	}
	function navigateMonth(delta: number) {
		setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
		setPage(1);
	}
	return (
		<VStack align='stretch' gap={5}>
			<PageHeader
				title='Calendário docente'
				description='Organize seu mês com os horários, locais e situações das aulas.'
			/>
			<Surface variant='panel' py={4}>
				<HStack justify='space-between' flexWrap='wrap' gap={4}>
					<HStack gap={3}>
						<IconTile icon={CalendarDays} />
						<Box>
							<Text fontSize='xs' color='fg.muted' mb={1}>
								Agenda mensal
							</Text>
							<Heading
								as='h2'
								fontSize='xl'
								css={{ '&::first-letter': { textTransform: 'uppercase' } }}
								aria-live='polite'
							>
								{formatDate(month.toISOString(), { month: 'long', year: 'numeric' })}
							</Heading>
						</Box>
					</HStack>
					<HStack gap={2}>
						<BaseButton
							variant='secondary'
							size='sm'
							aria-label='Mês anterior'
							onClick={() => navigateMonth(-1)}
						>
							<ChevronLeft size={17} />
						</BaseButton>
						<BaseButton
							variant='secondary'
							size='sm'
							onClick={() => {
								setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
								setPage(1);
							}}
						>
							Hoje
						</BaseButton>
						<BaseButton
							variant='secondary'
							size='sm'
							aria-label='Próximo mês'
							onClick={() => navigateMonth(1)}
						>
							<ChevronRight size={17} />
						</BaseButton>
					</HStack>
				</HStack>
			</Surface>
			<QueryState
				query={query}
				empty={
					query.data?.items.length === 0 && {
						title: 'Nenhuma aula neste mês',
						description: 'Navegue entre os meses ou registre novas aulas dentro de uma turma.',
					}
				}
			>
				<VStack align='stretch' gap={6}>
					{Array.from(groups, ([day, lessons]) => (
						<Box key={day}>
							<HStack mb={3} gap={3}>
								<Heading
									as='h3'
									fontSize='sm'
									css={{ '&::first-letter': { textTransform: 'uppercase' } }}
								>
									{formatDate(lessons[0].startsAt, {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
									})}
								</Heading>
								{day === localDay(new Date().toISOString()) && (
									<Text color='action.primary' fontSize='xs' fontWeight='bold'>
										Hoje
									</Text>
								)}
								<Box flex='1' h='1px' bg='border.muted' />
							</HStack>
							<VStack align='stretch' gap={3}>
								{lessons.map((lesson) => (
									<LessonCard key={lesson.id} lesson={lesson} />
								))}
							</VStack>
						</Box>
					))}
				</VStack>
				{query.data && <Pagination {...query.data} onChange={setPage} />}
			</QueryState>
		</VStack>
	);
}
