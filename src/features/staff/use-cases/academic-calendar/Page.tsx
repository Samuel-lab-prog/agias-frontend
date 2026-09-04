/* eslint-disable max-lines-per-function -- this route composes the staff calendar form and event management workflow. */

import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { AcademicCalendarEvent } from '@Api/academic/types';
import { curriculum } from '@Api/curriculum/endpoints';
import { curriculumKeys } from '@Api/curriculum/keys';
import type { AcademicPeriod } from '@Api/curriculum/types';
import { BaseButton, Surface, toaster } from '@BaseComponents';
import {
	Box,
	Heading,
	HStack,
	Input,
	NativeSelect,
	SimpleGrid,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { NavigationPageShell } from '@core/components/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createHTTPRequest } from '@Utils';
import { CalendarPlus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { staffNavigationPreset } from '../home/navigation';

const types = [
	['holiday', 'Feriado'],
	['academic_event', 'Evento acadêmico'],
	['instructional_saturday', 'Sábado letivo'],
	['exam', 'Avaliação'],
	['break', 'Recesso'],
] as const;

export function StaffAcademicCalendarPage() {
	const client = useQueryClient();
	const [title, setTitle] = useState('');
	const [editingId, setEditingId] = useState<number | null>(null);
	const [academicPeriodId, setAcademicPeriodId] = useState('');
	const [description, setDescription] = useState('');
	const [type, setType] = useState<AcademicCalendarEvent['type']>('academic_event');
	const [startsAt, setStartsAt] = useState('');
	const [endsAt, setEndsAt] = useState('');
	const query = useQuery({
		queryKey: academicKeys.academicCalendarEvents(),
		queryFn: () =>
			academic.getAcademicCalendarEvents.query().queryFn() as Promise<AcademicCalendarEvent[]>,
	});
	const periodsQuery = useQuery({
		queryKey: curriculumKeys.academicPeriods(),
		queryFn: () => curriculum.getAcademicPeriods.query().queryFn() as Promise<AcademicPeriod[]>,
	});
	const create = useMutation({
		mutationFn: () =>
			createHTTPRequest<AcademicCalendarEvent, Record<string, unknown>>({
				method: 'POST',
				path: '/academic-calendar/events',
				body: {
					academicPeriodId: Number(academicPeriodId),
					type,
					title,
					description: description || null,
					startsAt: new Date(startsAt).toISOString(),
					endsAt: endsAt ? new Date(endsAt).toISOString() : null,
					allDay: !endsAt,
					isInstructionalDay: type === 'instructional_saturday' || type === 'exam',
				},
			}),
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: academicKeys.academicCalendarEvents() });
			toaster.create({
				title: 'Evento adicionado',
				description: 'A data foi incluída no calendário.',
				type: 'success',
			});
			setTitle('');
			setAcademicPeriodId('');
			setDescription('');
			setStartsAt('');
			setEndsAt('');
		},
		onError: (error) =>
			toaster.create({
				title: 'Não foi possível adicionar',
				description: error instanceof Error ? error.message : 'Tente novamente.',
				type: 'error',
			}),
	});
	const update = useMutation({
		mutationFn: () =>
			createHTTPRequest<AcademicCalendarEvent, Record<string, unknown>>({
				method: 'PUT',
				path: `/academic-calendar/events/${editingId}`,
				body: {
					academicPeriodId: Number(academicPeriodId),
					type,
					title,
					description: description || null,
					startsAt: new Date(startsAt).toISOString(),
					endsAt: endsAt ? new Date(endsAt).toISOString() : null,
					allDay: !endsAt,
					isInstructionalDay: type === 'instructional_saturday' || type === 'exam',
				},
			}),
		onSuccess: async () => {
			await client.invalidateQueries({ queryKey: academicKeys.academicCalendarEvents() });
			toaster.create({
				title: 'Evento atualizado',
				description: 'As alterações foram salvas.',
				type: 'success',
			});
			setEditingId(null);
			setTitle('');
			setAcademicPeriodId('');
			setDescription('');
			setStartsAt('');
			setEndsAt('');
		},
		onError: (error) =>
			toaster.create({
				title: 'Não foi possível atualizar',
				description: error instanceof Error ? error.message : 'Tente novamente.',
				type: 'error',
			}),
	});
	const remove = useMutation({
		mutationFn: (id: number) =>
			createHTTPRequest({ method: 'DELETE', path: `/academic-calendar/events/${id}` }),
		onSuccess: () => {
			toaster.create({
				title: 'Evento excluído',
				description: 'A data foi removida do calendário.',
				type: 'success',
			});
			return client.invalidateQueries({ queryKey: academicKeys.academicCalendarEvents() });
		},
		onError: (error) =>
			toaster.create({
				title: 'Não foi possível excluir',
				description: error instanceof Error ? error.message : 'Tente novamente.',
				type: 'error',
			}),
	});
	return (
		<NavigationPageShell preset={staffNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Box>
					<Heading fontSize='2xl'>Calendário acadêmico</Heading>
					<Text color='fg.muted'>Gerencie feriados, avaliações, recessos e sábados letivos.</Text>
				</Box>
				<SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
					<Surface variant='panel'>
						<VStack
							as='form'
							align='stretch'
							gap={3}
							onSubmit={(event) => {
								event.preventDefault();
								if (title && startsAt && academicPeriodId) {
									if (editingId) update.mutate();
									else create.mutate();
								}
							}}
						>
							<Box borderBottomWidth='1px' borderColor='border.default' pb={3}>
								<Heading fontSize='lg'>{editingId ? 'Editar evento' : 'Novo evento'}</Heading>
								<Text fontSize='sm' color='fg.muted' mt={1}>
									{editingId
										? 'Atualize os dados da data selecionada.'
										: 'Cadastre uma nova data no calendário acadêmico.'}
								</Text>
							</Box>
							{editingId ? (
								<Box
									px={3}
									py={2}
									borderRadius='md'
									bg='action.primarySubtle'
									color='action.primary'
								>
									<Text fontSize='sm' fontWeight='semibold'>
										Modo de edição ativo
									</Text>
								</Box>
							) : null}
							<Box>
								<Text fontSize='sm' fontWeight='semibold' mb={1}>
									Período acadêmico
								</Text>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={academicPeriodId}
										onChange={(e) => setAcademicPeriodId(e.target.value)}
										aria-label='Período acadêmico'
									>
										<option value=''>Selecione o período acadêmico</option>
										{periodsQuery.data?.map((period) => (
											<option key={period.id} value={period.id}>
												{period.code} —{' '}
												{new Intl.DateTimeFormat('pt-BR').format(new Date(period.startsAt))} a{' '}
												{new Intl.DateTimeFormat('pt-BR').format(new Date(period.endsAt))}
											</option>
										))}
									</NativeSelect.Field>
								</NativeSelect.Root>
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' mb={1}>
									Título do evento
								</Text>
								<Input
									placeholder='Ex.: Reunião pedagógica'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' mb={1}>
									Tipo de data
								</Text>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={type}
										onChange={(e) => setType(e.target.value as AcademicCalendarEvent['type'])}
										aria-label='Tipo de data'
									>
										{types.map(([value, label]) => (
											<option key={value} value={value}>
												{label}
											</option>
										))}
									</NativeSelect.Field>
								</NativeSelect.Root>
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' mb={1}>
									Descrição{' '}
									<Text as='span' fontWeight='normal' color='fg.muted'>
										(opcional)
									</Text>
								</Text>
								<Textarea
									placeholder='Inclua detalhes para os estudantes (opcional)'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' mb={1}>
									Início
								</Text>
								<Input
									type='datetime-local'
									value={startsAt}
									onChange={(e) => setStartsAt(e.target.value)}
									required
									aria-label='Data e hora de início'
								/>
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' mb={1}>
									Término{' '}
									<Text as='span' fontWeight='normal' color='fg.muted'>
										(opcional)
									</Text>
								</Text>
								<Input
									type='datetime-local'
									value={endsAt}
									onChange={(e) => setEndsAt(e.target.value)}
									aria-label='Data e hora de término'
								/>
								<Text fontSize='xs' color='fg.muted' mt={1}>
									Deixe vazio para um evento de dia inteiro.
								</Text>
							</Box>
							<BaseButton type='submit' disabled={create.isPending || update.isPending}>
								{editingId ? <Pencil size={15} /> : <CalendarPlus size={15} />}
								{create.isPending || update.isPending
									? 'Salvando...'
									: editingId
										? 'Salvar alterações'
										: 'Adicionar evento'}
							</BaseButton>
							{editingId ? (
								<BaseButton
									type='button'
									variant='secondary'
									onClick={() => {
										setEditingId(null);
										setTitle('');
										setAcademicPeriodId('');
										setDescription('');
										setStartsAt('');
										setEndsAt('');
									}}
								>
									Cancelar edição
								</BaseButton>
							) : null}
						</VStack>
					</Surface>
					<Surface variant='panel'>
						<Heading fontSize='lg' mb={3}>
							Eventos cadastrados
						</Heading>
						<VStack align='stretch' gap={3}>
							{query.data?.map((event) => (
								<Box
									key={event.id}
									p={3}
									borderWidth='1px'
									borderColor='border.default'
									borderRadius='md'
								>
									<Text fontWeight='semibold'>{event.title}</Text>
									<Text fontSize='sm' color='fg.muted'>
										{new Intl.DateTimeFormat('pt-BR', {
											dateStyle: 'medium',
											timeStyle: event.allDay ? undefined : 'short',
										}).format(new Date(event.startsAt))}
									</Text>
									<Text fontSize='xs' color='fg.muted'>
										{types.find(([value]) => value === event.type)?.[1]}
									</Text>
									<HStack mt={3} gap={2}>
										<BaseButton
											size='xs'
											variant='secondary'
											onClick={() => {
												setEditingId(event.id);
												setAcademicPeriodId(String(event.academicPeriodId));
												setTitle(event.title);
												setDescription(event.description ?? '');
												setType(event.type);
												setStartsAt(event.startsAt.slice(0, 16));
												setEndsAt(event.endsAt?.slice(0, 16) ?? '');
											}}
										>
											<Pencil size={13} />
											Editar
										</BaseButton>
										<BaseButton
											size='xs'
											variant='destructive'
											onClick={() => {
												if (window.confirm(`Excluir o evento “${event.title}”?`))
													remove.mutate(event.id);
											}}
										>
											<Trash2 size={13} />
											Excluir
										</BaseButton>
									</HStack>
								</Box>
							))}
						</VStack>
					</Surface>
				</SimpleGrid>
			</VStack>
		</NavigationPageShell>
	);
}
