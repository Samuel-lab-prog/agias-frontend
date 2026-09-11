import { Surface } from '@BaseComponents';
import { Badge, Box, Heading, Progress, Text, VStack } from '@chakra-ui/react';

import { LessonStatusBadge } from '../../../components/LessonStatusBadge';
import { formatAcademicDate } from '../../../utils/academic-planning';
import type { SubjectDetails } from '../types';

const typeLabels: Record<string, string> = {
	content: 'Conteúdo',
	review: 'Revisão',
	activity: 'Atividade',
	assessment: 'Avaliação',
	project: 'Projeto',
};

export function SubjectPlan({ plan }: { plan: SubjectDetails['plan'] }) {
	return (
		<Surface variant='panel'>
			<Heading as='h2' fontSize='lg' mb={3}>
				Planejamento da disciplina
			</Heading>
			{!plan ? (
				<Text color='fg.muted' fontSize='sm'>
					Planejamento ainda não publicado.
				</Text>
			) : (
				<VStack align='stretch' gap={5}>
					{[
						['Ementa', plan.syllabus],
						['Objetivos', plan.generalObjectives],
						['Metodologia', plan.methodology],
						['Critérios de avaliação', plan.assessmentCriteria],
					].map(([label, value]) =>
						value ? (
							<Box key={label}>
								<Heading as='h3' fontSize='sm' mb={1}>
									{label}
								</Heading>
								<Text fontSize='sm' color='fg.muted'>
									{value}
								</Text>
							</Box>
						) : null,
					)}
					{plan.workloadMinutes ? (
						<Text fontSize='sm'>Carga horária: {plan.workloadMinutes / 60} horas</Text>
					) : null}
					<Box>
						<Text fontSize='sm' fontWeight='semibold' mb={2}>
							Progresso do planejamento: {plan.progress}% · {plan.completed}/{plan.total} tópicos
						</Text>
						<Progress.Root value={plan.progress} size='sm' colorPalette='blue'>
							<Progress.Track>
								<Progress.Range />
							</Progress.Track>
							<Progress.Label>Conteúdos realizados</Progress.Label>
						</Progress.Root>
						<Text fontSize='xs' color='fg.muted' mt={2}>
							Um tópico é concluído quando todas as aulas associadas, exceto canceladas ou
							remarcadas, estão registradas como realizadas.
						</Text>
					</Box>
					{!plan.units.length ? <Text color='fg.muted'>Nenhuma unidade publicada.</Text> : null}
					{plan.units.map((unit) => (
						<VStack key={unit.id} align='stretch' gap={3}>
							<Heading as='h3' fontSize='md'>
								{unit.title}
							</Heading>
							{unit.description ? <Text fontSize='sm'>{unit.description}</Text> : null}
							<Text fontSize='xs' color='fg.muted'>
								{unit.completedTopics}/{unit.topics.length} tópicos realizados
							</Text>
							{!unit.topics.length ? (
								<Text fontSize='sm' color='fg.muted'>
									Nenhum tópico publicado nesta unidade.
								</Text>
							) : null}
							{unit.topics.map((topic) => (
								<Box
									key={topic.id}
									borderLeftWidth='3px'
									borderColor={topic.completed ? 'status.success' : 'border.default'}
									pl={3}
									py={1}
								>
									<Badge colorPalette={topic.completed ? 'green' : 'blue'} mb={1}>
										{topic.statusLabel}
									</Badge>
									<Text fontWeight='semibold' fontSize='sm'>
										{topic.title}
									</Text>
									<Text fontSize='xs' color='fg.muted'>
										{typeLabels[topic.type] ?? topic.type}
									</Text>
									{topic.description ? <Text fontSize='sm'>{topic.description}</Text> : null}
									{!topic.sessions.length ? (
										<Text fontSize='xs' color='fg.muted'>
											Aula ainda não agendada.
										</Text>
									) : (
										topic.sessions.map((session) => (
											<Box key={session.id} mt={2}>
												<Text fontSize='xs'>{formatAcademicDate(session.startsAt)}</Text>
												<LessonStatusBadge session={session} />
											</Box>
										))
									)}
								</Box>
							))}
						</VStack>
					))}
				</VStack>
			)}
		</Surface>
	);
}
