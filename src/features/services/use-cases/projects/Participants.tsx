import { type ProjectDetail,projects } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import {
	Box,
	Heading,
	HStack,
	Input,
	NativeSelect,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Feedback, FormField } from '../../components/UI';
import { dateInputValue, dateLabel } from '../../utils';
export function Participants({
	project,
	editable,
	manager,
	userId,
}: {
	project: ProjectDetail;
	editable: boolean;
	manager: boolean;
	userId?: number;
}) {
	const client = useQueryClient(),
		[search, setSearch] = useState(''),
		[candidate, setCandidate] = useState('');
	const candidates = useQuery({
		queryKey: ['project-candidates', search],
		queryFn: () => projects.candidates(search),
		enabled: editable && search.length >= 2,
	});
	const refresh = () => client.invalidateQueries({ queryKey: ['project', project.id] });
	const add = useMutation({
		mutationFn: (body: Parameters<typeof projects.participant>[1]) =>
			projects.participant(project.id, body),
		onSuccess: () => {
			setCandidate('');
			return refresh();
		},
	});
	const hours = useMutation({
		mutationFn: (body: { id: number; hours: number }) =>
			projects.hours(project.id, body.id, body.hours),
		onSuccess: refresh,
	});
	return (
		<VStack align='stretch' gap={4}>
			<Heading as='h2' fontSize='xl'>
				Participantes e planos de trabalho
			</Heading>
			{project.participants.length === 0 && (
				<Text color='fg.muted'>Nenhum participante cadastrado.</Text>
			)}
			{project.participants.map((p) => (
				<Surface key={p.id} variant='panel'>
					<VStack align='stretch' gap={3}>
						<Box>
							<Heading as='h3' fontSize='lg'>
								{p.user.name}
							</Heading>
							<Text color='fg.muted' fontSize='sm'>
								{p.role} · {dateLabel(p.startsAt)} a {dateLabel(p.endsAt)}
							</Text>
						</Box>
						<Text whiteSpace='pre-wrap'>{p.workPlan}</Text>
						<Text fontWeight='semibold'>
							{p.approvedHours === null
								? 'Carga horária aguardando validação'
								: p.approvedHours + ' horas validadas'}
						</Text>
						{manager && project.status === 'active' && p.userId !== userId && (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									hours.mutate({
										id: p.id,
										hours: Number(new FormData(e.currentTarget).get('hours')),
									});
								}}
							>
								<HStack align='end'>
									<FormField label='Horas realizadas'>
										<Input
											name='hours'
											type='number'
											required
											min={0}
											max={10000}
											step={1}
											defaultValue={p.approvedHours ?? ''}
										/>
									</FormField>
									<BaseButton type='submit' disabled={hours.isPending} variant='secondary'>
										Validar horas
									</BaseButton>
								</HStack>
							</form>
						)}
					</VStack>
				</Surface>
			))}
			<Feedback error={hours.error} />
			{editable && (
				<Surface variant='panel'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const f = new FormData(e.currentTarget);
							add.mutate({
								userId: Number(candidate),
								role: String(f.get('role')),
								workPlan: String(f.get('plan')),
								startsAt: new Date(String(f.get('start')) + 'T00:00:00-03:00').toISOString(),
								endsAt: new Date(String(f.get('end')) + 'T23:59:59-03:00').toISOString(),
							});
						}}
					>
						<VStack align='stretch' gap={4}>
							<Heading as='h3' fontSize='lg'>
								Adicionar participante
							</Heading>
							<FormField label='Buscar pessoa pelo nome'>
								<Input
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setCandidate('');
									}}
									placeholder='Digite pelo menos duas letras'
									maxLength={100}
								/>
							</FormField>
							<FormField label='Pessoa' required>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={candidate}
										onChange={(e) => setCandidate(e.target.value)}
									>
										<option value=''>Selecione uma pessoa</option>
										{candidates.data?.map((p) => (
											<option value={p.id} key={p.id}>
												{p.name}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
							<Feedback error={candidates.error} />
							<FormField label='Função no projeto' required>
								<Input
									name='role'
									required
									minLength={2}
									maxLength={100}
									placeholder='Ex.: bolsista, voluntário, colaborador'
								/>
							</FormField>
							<FormField label='Plano de trabalho' required>
								<Textarea
									name='plan'
									required
									minLength={10}
									maxLength={10000}
									rows={4}
									placeholder='Objetivos, atividades e entregas da participação'
								/>
							</FormField>
							<HStack flexWrap='wrap'>
								<FormField label='Início da participação' required>
									<Input
										type='date'
										name='start'
										defaultValue={dateInputValue(project.startsAt)}
										required
									/>
								</FormField>
								<FormField label='Fim da participação' required>
									<Input
										type='date'
										name='end'
										defaultValue={dateInputValue(project.endsAt)}
										required
									/>
								</FormField>
							</HStack>
							<Feedback
								error={add.error}
								success={add.isSuccess ? 'Participante adicionado.' : undefined}
							/>
							<BaseButton type='submit' disabled={add.isPending || !candidate} w='fit-content'>
								Adicionar participante
							</BaseButton>
						</VStack>
					</form>
				</Surface>
			)}
		</VStack>
	);
}

