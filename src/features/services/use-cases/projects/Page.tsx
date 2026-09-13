import { type ProjectBody, type ProjectKind, projects } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
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
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { ServicesShell } from '../../components/Shell';
import {
	EmptyPanel,
	Feedback,
	FormField,
	ServiceHeader,
	ServiceLink,
	ServiceState,
} from '../../components/UI';
import { dateLabel, finalReportLabels, kindLabels, originLabels, statusLabels } from '../../utils';

/* eslint-disable max-lines, max-lines-per-function -- the catalog combines the list and its filter form. */
function NewProject() {
	const navigate = useNavigate();
	const [kind, setKind] = useState<ProjectKind>('research');
	const [origin, setOrigin] = useState<'internal' | 'external'>('internal');
	const mutation = useMutation({
		mutationFn: projects.create,
		onSuccess: (p) => navigate('/projects/' + p.id),
	});
	return (
		<VStack align='stretch' gap={5}>
			<ServiceHeader
				title='Novo projeto'
				description='Descreva a proposta antes de encaminhá-la para avaliação.'
				action={<ServiceLink to='/projects'>Voltar aos projetos</ServiceLink>}
			/>
			<Surface variant='panel'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const form = new FormData(e.currentTarget);
						const optional = (name: string) => {
							const value = String(form.get(name) ?? '').trim();
							return value || undefined;
						};
						const body: ProjectBody = {
							title: String(form.get('title')),
							objectives: String(form.get('objectives')),
							kind,
							origin,
							...(optional('departmentId')
								? { departmentId: Number(optional('departmentId')) }
								: {}),
							researchLine: optional('researchLine'),
							knowledgeArea: optional('knowledgeArea'),
							researchGroup: optional('researchGroup'),
							fundingAgency: optional('fundingAgency'),
							callName: optional('callName'),
							nature: optional('nature'),
							researchType: optional('researchType'),
							startsAt: new Date(String(form.get('startsAt')) + 'T00:00:00-03:00').toISOString(),
							endsAt: new Date(String(form.get('endsAt')) + 'T23:59:59-03:00').toISOString(),
						};
						mutation.mutate(body);
					}}
				>
					<VStack align='stretch' gap={5}>
						<FormField label='Título' required>
							<Input name='title' required minLength={3} maxLength={200} />
						</FormField>
						<FormField label='Modalidade' required>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={kind}
									onChange={(e) => setKind(e.target.value as ProjectKind)}
								>
									{Object.entries(kindLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Origem' required>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={origin}
									onChange={(e) => setOrigin(e.target.value as typeof origin)}
								>
									{Object.entries(originLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Objetivos' required>
							<Textarea name='objectives' required minLength={10} maxLength={10000} rows={5} />
						</FormField>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<FormField label='Início' required>
								<Input type='date' name='startsAt' required />
							</FormField>
							<FormField label='Término' required>
								<Input type='date' name='endsAt' required />
							</FormField>
						</SimpleGrid>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<FormField label='Linha de pesquisa'>
								<Input name='researchLine' maxLength={200} />
							</FormField>
							<FormField label='Área do conhecimento'>
								<Input name='knowledgeArea' maxLength={200} />
							</FormField>
							<FormField label='Grupo de pesquisa'>
								<Input name='researchGroup' maxLength={200} />
							</FormField>
							<FormField label='Agência financiadora'>
								<Input name='fundingAgency' maxLength={200} />
							</FormField>
							<FormField label='Edital'>
								<Input name='callName' maxLength={200} />
							</FormField>
							<FormField label='Natureza'>
								<Input name='nature' maxLength={100} placeholder='Ex.: Pesquisa aplicada' />
							</FormField>
							<FormField label='Tipo específico'>
								<Input
									name='researchType'
									maxLength={100}
									placeholder='Ex.: Iniciação científica'
								/>
							</FormField>
						</SimpleGrid>
						<Text color='fg.muted' fontSize='sm'>
							Você será a pessoa responsável pela coordenação. O projeto será salvo como rascunho.
						</Text>
						<Feedback error={mutation.error} />
						<BaseButton type='submit' disabled={mutation.isPending} w='fit-content'>
							Salvar projeto
						</BaseButton>
					</VStack>
				</form>
			</Surface>
		</VStack>
	);
}
function ProjectList() {
	const role = useAuthClientStore((s) => s.authClient?.role),
		[params, setParams] = useSearchParams();
	const manager = role === 'staff' || role === 'admin';
	const searchMode = params.get('view') === 'search';
	const ownership = searchMode ? 'all' : 'mine';
	const page = Math.max(1, Number(params.get('page')) || 1),
		kind = params.get('kind') || '',
		q = params.get('q') || '',
		code = params.get('code') || '',
		year = params.get('year') || '',
		researcher = params.get('researcher') || '',
		departmentId = params.get('departmentId') || '',
		origin = params.get('origin') || '',
		status = params.get('status') || '',
		finalReport = params.get('finalReport') || '',
		scope =
			searchMode && params.get('scope') === 'institution' && manager ? 'institution' : 'campus',
		researchLine = params.get('researchLine') || '',
		knowledgeArea = params.get('knowledgeArea') || '',
		fundingAgency = params.get('fundingAgency') || '',
		researchGroup = params.get('researchGroup') || '',
		callName = params.get('callName') || '',
		nature = params.get('nature') || '',
		researchType = params.get('researchType') || '';
	const departments = useQuery({
		queryKey: ['project-departments', scope, searchMode],
		queryFn: () => projects.departments(scope),
		enabled: searchMode,
	});
	const query = useQuery({
		queryKey: [
			'projects',
			{
				page,
				ownership,
				kind,
				q,
				code,
				year,
				researcher,
				departmentId,
				origin,
				status,
				finalReport,
				scope,
				researchLine,
				knowledgeArea,
				fundingAgency,
				researchGroup,
				callName,
				nature,
				researchType,
			},
		],
		queryFn: () =>
			projects.list({
				page,
				ownership,
				q: q || undefined,
				code: code || undefined,
				year: year ? Number(year) : undefined,
				researcher: researcher || undefined,
				departmentId: departmentId ? Number(departmentId) : undefined,
				kind: kind || undefined,
				origin: origin || undefined,
				status: status || undefined,
				finalReport: finalReport || undefined,
				scope,
				researchLine: researchLine || undefined,
				knowledgeArea: knowledgeArea || undefined,
				fundingAgency: fundingAgency || undefined,
				researchGroup: researchGroup || undefined,
				callName: callName || undefined,
				nature: nature || undefined,
				researchType: researchType || undefined,
			}),
	});
	function filter(key: string, value: string) {
		setParams((current) => {
			const next = new URLSearchParams(current);
			if (value) next.set(key, value);
			else next.delete(key);
			next.delete('page');
			return next;
		});
	}
	function switchView(view: 'mine' | 'search') {
		setParams(view === 'search' ? { view: 'search' } : {});
	}
	return (
		<VStack align='stretch' gap={6}>
			<ServiceHeader
				title={searchMode ? 'Busca de projetos' : 'Meus projetos'}
				description={
					searchMode
						? 'Encontre projetos por código, pesquisador, unidade, situação e classificação.'
						: 'Projetos que você coordena ou dos quais participa.'
				}
				action={
					<HStack>
						{manager && searchMode && (
							<BaseButton asChild variant='secondary' size='sm'>
								<a
									href={projects.reportUrl({
										...Object.fromEntries(params),
										scope,
										ownership: 'all',
									})}
									download
								>
									Gerar relatório
								</a>
							</BaseButton>
						)}
						{role !== 'student' && <ServiceLink to='/projects/new'>Novo projeto</ServiceLink>}
					</HStack>
				}
			/>
			<Surface variant='panel'>
				<HStack gap={3} flexWrap='wrap'>
					<BaseButton
						variant={searchMode ? 'secondary' : undefined}
						onClick={() => switchView('mine')}
					>
						Meus projetos
					</BaseButton>
					<BaseButton
						variant={searchMode ? undefined : 'secondary'}
						onClick={() => switchView('search')}
					>
						Busca de projetos
					</BaseButton>
				</HStack>
			</Surface>
			{searchMode && (
				<Surface variant='panel'>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								filter('q', String(new FormData(e.currentTarget).get('search') ?? ''));
							}}
						>
							<FormField label='Buscar projeto'>
								<HStack>
									<Input
										key={q}
										name='search'
										defaultValue={q}
										placeholder='Título do projeto'
										maxLength={100}
									/>
									<BaseButton type='submit' variant='secondary'>
										Buscar
									</BaseButton>
								</HStack>
							</FormField>
						</form>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								filter('code', String(new FormData(e.currentTarget).get('code') ?? ''));
							}}
						>
							<FormField label='Código'>
								<Input
									key={code}
									name='code'
									defaultValue={code}
									placeholder='Ex.: 2026-0001'
									maxLength={50}
								/>
							</FormField>
						</form>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								filter('researcher', String(new FormData(e.currentTarget).get('researcher') ?? ''));
							}}
						>
							<FormField label='Pesquisador'>
								<Input
									key={researcher}
									name='researcher'
									defaultValue={researcher}
									placeholder='Nome do pesquisador'
									maxLength={100}
								/>
							</FormField>
						</form>
						<FormField label='Modalidade'>
							<NativeSelect.Root>
								<NativeSelect.Field value={kind} onChange={(e) => filter('kind', e.target.value)}>
									<option value=''>Todas</option>
									{Object.entries(kindLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Origem'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={origin}
									onChange={(e) => filter('origin', e.target.value)}
								>
									<option value=''>Internos e externos</option>
									{Object.entries(originLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Situação'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={status}
									onChange={(e) => filter('status', e.target.value)}
								>
									<option value=''>Todas</option>
									{Object.entries(statusLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Relatório final'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={finalReport}
									onChange={(e) => filter('finalReport', e.target.value)}
								>
									<option value=''>Todos</option>
									{Object.entries(finalReportLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Ano'>
							<Input
								key={year}
								value={year}
								type='number'
								min={2000}
								max={2200}
								onChange={(e) => filter('year', e.target.value)}
							/>
						</FormField>
						<FormField label='Unidade'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={departmentId}
									onChange={(e) => filter('departmentId', e.target.value)}
								>
									<option value=''>Todas as unidades</option>
									{departments.data?.map((department) => (
										<option key={department.id} value={department.id}>
											{department.name}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						{manager && (
							<FormField label='Abrangência'>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={scope}
										onChange={(e) => filter('scope', e.target.value)}
									>
										<option value='campus'>Somente meu campus</option>
										<option value='institution'>Todos os campi da instituição</option>
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
						)}
					</SimpleGrid>
					<details>
						<summary>Filtros de pesquisa e financiamento</summary>
						<SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={4}>
							{[
								['researchLine', 'Linha de pesquisa', researchLine],
								['knowledgeArea', 'Área do conhecimento', knowledgeArea],
								['researchGroup', 'Grupo de pesquisa', researchGroup],
								['fundingAgency', 'Agência financiadora', fundingAgency],
								['callName', 'Edital', callName],
								['nature', 'Natureza', nature],
								['researchType', 'Tipo de pesquisa', researchType],
							].map(([key, label, value]) => (
								<form
									key={key}
									onSubmit={(e) => {
										e.preventDefault();
										filter(key, String(new FormData(e.currentTarget).get(key) ?? ''));
									}}
								>
									<FormField label={label}>
										<Input name={key} defaultValue={value} maxLength={100} />
									</FormField>
								</form>
							))}
						</SimpleGrid>
					</details>
				</Surface>
			)}
			<ServiceState query={query}>
				{query.data?.items.length === 0 ? (
					<EmptyPanel>
						<Heading as='h2' fontSize='lg'>
							Nenhum projeto nesta seleção
						</Heading>
						<Text color='fg.muted'>
							{searchMode
								? 'Nenhum projeto corresponde aos filtros informados.'
								: 'Você ainda não coordena nem participa de projetos.'}
						</Text>
					</EmptyPanel>
				) : (
					<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
						{query.data?.items.map((p) => (
							<Surface variant='panel' key={p.id}>
								<VStack align='stretch' gap={3}>
									<HStack justify='space-between'>
										<Text color='action.primary' fontSize='sm'>
											{kindLabels[p.kind]} · {originLabels[p.origin]}
										</Text>
										<Text fontSize='sm'>{statusLabels[p.status]}</Text>
									</HStack>
									<Heading as='h2' fontSize='xl'>
										{p.title}
									</Heading>
									<Text color='fg.muted' fontSize='sm'>
										{p.code} · {p.year} · Relatório: {finalReportLabels[p.finalReportStatus]}
									</Text>
									{p.department && (
										<Text color='fg.muted' fontSize='sm'>
											Unidade: {p.department.name}
										</Text>
									)}
									<Text color='fg.muted' fontSize='sm'>
										Coordenação: {p.coordinator.name}
									</Text>
									<Text color='fg.muted' fontSize='sm'>
										{dateLabel(p.startsAt)} a {dateLabel(p.endsAt)} · {p._count.participants}{' '}
										participantes
									</Text>
									<BaseButton asChild variant='secondary' w='fit-content'>
										<Link to={'/projects/' + p.id}>Abrir projeto</Link>
									</BaseButton>
								</VStack>
							</Surface>
						))}
					</SimpleGrid>
				)}
				{query.data && query.data.total > 20 && (
					<HStack justify='space-between'>
						<Text>Página {page}</Text>
						<HStack>
							<BaseButton
								disabled={page <= 1}
								variant='secondary'
								onClick={() => setParams({ ...Object.fromEntries(params), page: String(page - 1) })}
							>
								Anterior
							</BaseButton>
							<BaseButton
								disabled={page * 20 >= query.data.total}
								variant='secondary'
								onClick={() => setParams({ ...Object.fromEntries(params), page: String(page + 1) })}
							>
								Próxima
							</BaseButton>
						</HStack>
					</HStack>
				)}
			</ServiceState>
		</VStack>
	);
}
export function ProjectsPage() {
	const { pathname } = useLocation();
	return (
		<ServicesShell>
			<Box>{pathname === '/projects/new' ? <NewProject /> : <ProjectList />}</Box>
		</ServicesShell>
	);
}
