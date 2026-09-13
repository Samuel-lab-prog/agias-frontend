import { type ProjectDetail, projects, type ProjectStatus } from '@Api/projects/endpoints';
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
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ServicesShell } from '../../components/Shell';
import { Feedback, FormField, ServiceHeader, ServiceLink, ServiceState } from '../../components/UI';
import { dateLabel, finalReportLabels, kindLabels, originLabels, statusLabels } from '../../utils';
import { Participants } from './Participants';
function ProjectContent({ project }: { project: ProjectDetail }) {
	const user = useAuthClientStore((s) => s.authClient),
		client = useQueryClient();
	const manager = ['staff', 'admin'].includes(user?.role ?? ''),
		editable =
			!['completed', 'cancelled'].includes(project.status) &&
			(manager || project.coordinatorId === user?.id);
	const [target, setTarget] = useState<ProjectStatus | ''>('');
	const refresh = () =>
		Promise.all([
			client.invalidateQueries({ queryKey: ['project', project.id] }),
			client.invalidateQueries({ queryKey: ['projects'] }),
		]);
	const transition = useMutation({
		mutationFn: (note: string) =>
			projects.transition(project.id, {
				status: target as ProjectStatus,
				version: project.version,
				note,
			}),
		onSuccess: () => {
			setTarget('');
			return refresh();
		},
		onError: () => void refresh(),
	});
	const report = useMutation({
		mutationFn: (body: { title: string; body: string }) => projects.report(project.id, body),
		onSuccess: refresh,
	});
	const approve = useMutation({
		mutationFn: (id: number) => projects.approveReport(project.id, id),
		onSuccess: refresh,
	});
	const options: ProjectStatus[] =
		project.status === 'draft'
			? ['submitted', 'cancelled']
			: project.status === 'submitted'
				? manager
					? [
							'draft',
							...(project.coordinatorId !== user?.id ? ['active' as const] : []),
							'cancelled',
						]
					: ['cancelled']
				: project.status === 'active'
					? manager
						? ['completed', 'cancelled']
						: ['cancelled']
					: [];
	return (
		<VStack align='stretch' gap={6}>
			<ServiceHeader
				title={project.title}
				description={kindLabels[project.kind] + ' · ' + statusLabels[project.status]}
				action={<ServiceLink to='/projects'>Voltar à lista</ServiceLink>}
			/>
			<Surface variant='panel'>
				<VStack align='stretch' gap={3}>
					<Text fontWeight='semibold'>Coordenação: {project.coordinator.name}</Text>
					<Text color='fg.muted'>
						Código {project.code} · {originLabels[project.origin]} · Ano {project.year}
					</Text>
					<Text color='fg.muted'>
						{dateLabel(project.startsAt)} a {dateLabel(project.endsAt)} · Relatório final:{' '}
						{finalReportLabels[project.finalReportStatus]}
					</Text>
					{project.department && <Text color='fg.muted'>Unidade: {project.department.name}</Text>}
					{(project.researchLine || project.knowledgeArea || project.researchGroup) && (
						<Text color='fg.muted'>
							{[project.researchLine, project.knowledgeArea, project.researchGroup]
								.filter(Boolean)
								.join(' · ')}
						</Text>
					)}
					{(project.fundingAgency ||
						project.callName ||
						project.nature ||
						project.researchType) && (
						<Text color='fg.muted'>
							{[project.fundingAgency, project.callName, project.nature, project.researchType]
								.filter(Boolean)
								.join(' · ')}
						</Text>
					)}
					<Text whiteSpace='pre-wrap'>{project.objectives}</Text>
				</VStack>
			</Surface>
			{editable && options.length > 0 && (
				<Surface variant='panel'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							transition.mutate(String(new FormData(e.currentTarget).get('note')));
						}}
					>
						<VStack align='stretch' gap={4}>
							<Heading as='h2' fontSize='lg'>
								Acompanhamento da proposta
							</Heading>
							<FormField label='Próxima situação' required>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={target}
										onChange={(e) => setTarget(e.target.value as ProjectStatus)}
									>
										<option value=''>Selecione uma ação</option>
										{options.map((s) => (
											<option value={s} key={s}>
												{statusLabels[s]}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
							<FormField label='Parecer ou justificativa' required>
								<Textarea name='note' required minLength={3} maxLength={2000} />
							</FormField>
							<Text color='fg.muted' fontSize='sm'>
								A aprovação depende de outra pessoa da gestão. Para concluir, todos os participantes
								precisam ter horas validadas e o projeto precisa de um relatório aprovado.
							</Text>
							<Feedback error={transition.error} />
							<BaseButton type='submit' disabled={!target || transition.isPending} w='fit-content'>
								Registrar mudança
							</BaseButton>
						</VStack>
					</form>
				</Surface>
			)}
			<Participants project={project} editable={editable} manager={manager} userId={user?.id} />
			<Heading as='h2' fontSize='xl'>
				Relatórios
			</Heading>
			{project.reports.length === 0 && <Text color='fg.muted'>Nenhum relatório enviado.</Text>}
			{project.reports.map((r) => (
				<Surface variant='panel' key={r.id}>
					<VStack align='stretch' gap={3}>
						<HStack justify='space-between' flexWrap='wrap'>
							<Heading as='h3' fontSize='lg'>
								{r.title}
							</Heading>
							<Text color={r.approved ? 'status.success' : 'fg.muted'}>
								{r.approved ? 'Aprovado' : 'Aguardando avaliação'}
							</Text>
						</HStack>
						<Text whiteSpace='pre-wrap'>{r.body}</Text>
						<Text color='fg.muted' fontSize='sm'>
							{dateLabel(r.createdAt)}
						</Text>
						{manager && project.status === 'active' && !r.approved && r.authorId !== user?.id && (
							<BaseButton
								onClick={() => approve.mutate(r.id)}
								disabled={approve.isPending}
								w='fit-content'
								variant='secondary'
							>
								Aprovar relatório
							</BaseButton>
						)}
					</VStack>
				</Surface>
			))}
			<Feedback error={approve.error} />
			{project.status === 'active' && (
				<Surface variant='panel'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const f = new FormData(e.currentTarget);
							report.mutate({ title: String(f.get('title')), body: String(f.get('body')) });
						}}
					>
						<VStack align='stretch' gap={4}>
							<Heading as='h3' fontSize='lg'>
								Enviar relatório
							</Heading>
							<FormField label='Título do relatório' required>
								<Input name='title' required minLength={3} maxLength={200} />
							</FormField>
							<FormField label='Atividades e resultados' required>
								<Textarea name='body' rows={5} required minLength={10} maxLength={20000} />
							</FormField>
							<Feedback
								error={report.error}
								success={report.isSuccess ? 'Relatório enviado para avaliação.' : undefined}
							/>
							<BaseButton type='submit' disabled={report.isPending} w='fit-content'>
								Enviar relatório
							</BaseButton>
						</VStack>
					</form>
				</Surface>
			)}
			<Box>
				<Heading as='h2' fontSize='xl' mb={4}>
					Registro de acompanhamento
				</Heading>
				<VStack align='stretch' gap={3}>
					{project.events.map((event) => (
						<Box borderLeftWidth='2px' borderColor='border.default' pl={4} key={event.id}>
							<Text fontSize='sm'>{event.note}</Text>
							<Text fontSize='xs' color='fg.muted'>
								{dateLabel(event.createdAt)}
							</Text>
						</Box>
					))}
				</VStack>
			</Box>
		</VStack>
	);
}
export function ProjectDetailsPage() {
	const id = Number(useParams().id);
	const query = useQuery({ queryKey: ['project', id], queryFn: () => projects.detail(id) });
	return (
		<ServicesShell>
			<ServiceState query={query}>
				{query.data && <ProjectContent project={query.data} />}
			</ServiceState>
		</ServicesShell>
	);
}
