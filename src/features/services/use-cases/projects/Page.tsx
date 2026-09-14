import { type FinalReportStatus, projects, type ProjectStatus } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { ServicesShell } from '../../components/Shell';
import { EmptyPanel, ServiceHeader, ServiceLink, ServiceState } from '../../components/UI';
import { dateLabel, finalReportLabels, kindLabels, originLabels, statusLabels } from '../../utils';
import { NewProject } from './NewProject';
import { classificationFromParams, searchKeys } from './search-params';
import { SearchFilters } from './SearchFilters';
const projectStatusColors: Record<ProjectStatus, string> = {
	draft: 'gray',
	submitted: 'yellow',
	active: 'blue',
	completed: 'green',
	cancelled: 'red',
};
const finalReportColors: Record<FinalReportStatus, string> = {
	not_submitted: 'gray',
	submitted: 'yellow',
	approved: 'green',
};
function ProjectList() {
	const role = useAuthClientStore((s) => s.authClient?.role);
	const [params, setParams] = useSearchParams();
	const manager = role === 'staff' || role === 'admin';
	const searchMode = params.get('view') === 'search';
	const hasSearched =
		!searchMode ||
		params.get('searched') === '1' ||
		searchKeys.some((key) => Boolean(params.get(key)));
	const page = Math.max(1, Number(params.get('page')) || 1);
	const scope =
		searchMode && manager && params.get('scope') === 'institution' ? 'institution' : 'campus';
	const queryParams = {
		...Object.fromEntries(
			searchKeys.filter((key) => params.get(key)).map((key) => [key, params.get(key)!]),
		),
		...classificationFromParams(params),
		page,
		scope,
		ownership: searchMode ? 'all' : 'mine',
		year: params.get('year') ? Number(params.get('year')) : undefined,
		departmentId: params.get('departmentId') ? Number(params.get('departmentId')) : undefined,
	};
	const query = useQuery({
		queryKey: ['projects', queryParams],
		enabled: hasSearched,
		queryFn: () => projects.list(queryParams),
	});
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
					<HStack flexWrap='wrap'>
						{manager && <ServiceLink to='/projects/catalogs'>Catálogos de projetos</ServiceLink>}
						{manager && searchMode && hasSearched && (
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
					<BaseButton variant={searchMode ? 'secondary' : undefined} onClick={() => setParams({})}>
						Meus projetos
					</BaseButton>
					<BaseButton
						variant={searchMode ? undefined : 'secondary'}
						onClick={() => setParams({ view: 'search' })}
					>
						Busca de projetos
					</BaseButton>
				</HStack>
			</Surface>
			{searchMode && (
				<SearchFilters
					key={params.toString()}
					params={params}
					manager={manager}
					onSearch={setParams}
					onClear={() => setParams({ view: 'search' })}
				/>
			)}
			{searchMode && !hasSearched ? (
				<EmptyPanel>
					<Heading as='h2' fontSize='lg'>
						Pesquise para ver projetos
					</Heading>
					<Text color='fg.muted'>
						Use o botão Buscar ou aplique um filtro para consultar os projetos.
					</Text>
				</EmptyPanel>
			) : (
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
											<Badge variant='subtle' colorPalette={projectStatusColors[p.status]}>
												{statusLabels[p.status]}
											</Badge>
										</HStack>
										<Heading as='h2' fontSize='xl'>
											{p.title}
										</Heading>
										<Text color='fg.muted' fontSize='sm'>
											{p.code} · {p.year} · Relatório:{' '}
											<Badge
												as='span'
												variant='subtle'
												colorPalette={finalReportColors[p.finalReportStatus]}
											>
												{finalReportLabels[p.finalReportStatus]}
											</Badge>
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
									onClick={() =>
										setParams({ ...Object.fromEntries(params), page: String(page - 1) })
									}
								>
									Anterior
								</BaseButton>
								<BaseButton
									disabled={page * 20 >= query.data.total}
									variant='secondary'
									onClick={() =>
										setParams({ ...Object.fromEntries(params), page: String(page + 1) })
									}
								>
									Próxima
								</BaseButton>
							</HStack>
						</HStack>
					)}
				</ServiceState>
			)}
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
