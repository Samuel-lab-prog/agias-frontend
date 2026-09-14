import { catalogFields, projectCatalogs } from '@Api/projects/catalogs';
import { type ProjectKind, projects } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, HStack, Input, NativeSelect, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { FormField, ServiceState } from '../../components/UI';
import { finalReportLabels, kindLabels, originLabels, statusLabels } from '../../utils';
import { ClassificationFields } from './ClassificationFields';
import { classificationFromParams } from './search-params';
import { SearchSelect } from './SearchSelect';

export function SearchFilters({
	params,
	manager,
	onSearch,
	onClear,
}: {
	params: URLSearchParams;
	manager: boolean;
	onSearch: (params: URLSearchParams) => void;
	onClear: () => void;
}) {
	const [draft, setDraft] = useState(() => Object.fromEntries(params));
	const [classification, setClassification] = useState(() => classificationFromParams(params));
	const [departmentId, setDepartmentId] = useState<number | null>(
		() => Number(params.get('departmentId')) || null,
	);
	const scope = manager && draft.scope === 'institution' ? 'institution' : 'campus';
	const catalogs = useQuery({ queryKey: ['project-catalogs'], queryFn: projectCatalogs.list });
	const departments = useQuery({
		queryKey: ['project-departments', scope],
		queryFn: () => projects.departments(scope),
	});
	const change = (key: string, value: string) =>
		setDraft((current) => ({ ...current, [key]: value }));
	return (
		<Surface variant='panel'>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					const next = new URLSearchParams({ view: 'search', searched: '1' });
					for (const key of [
						'q',
						'code',
						'year',
						'researcher',
						'kind',
						'origin',
						'status',
						'finalReport',
					]) {
						if (draft[key]?.trim()) next.set(key, draft[key].trim());
					}
					next.set('scope', scope);
					if (departmentId) next.set('departmentId', String(departmentId));
					for (const field of catalogFields)
						if (classification[`${field}Id`])
							next.set(`${field}Id`, String(classification[`${field}Id`]));
					onSearch(next);
				}}
			>
				<VStack align='stretch' gap={5}>
					<SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
						{[
							['q', 'Buscar projeto', 'Título, objetivos ou código'],
							['code', 'Código', 'Código do projeto'],
							['researcher', 'Pesquisador', 'Nome do pesquisador'],
						].map(([key, label, placeholder]) => (
							<FormField key={key} label={label}>
								<Input
									value={draft[key] || ''}
									onChange={(event) => change(key, event.target.value)}
									maxLength={key === 'code' ? 50 : 100}
									placeholder={placeholder}
								/>
							</FormField>
						))}
						{(
							[
								['kind', 'Modalidade', kindLabels],
								['origin', 'Origem', originLabels],
								['status', 'Situação', statusLabels],
								['finalReport', 'Relatório final', finalReportLabels],
							] as const
						).map(([key, label, labels]) => (
							<FormField key={key} label={label}>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={draft[key] || ''}
										onChange={(event) => {
											change(key, event.target.value);
											if (key === 'kind') setClassification({});
										}}
									>
										<option value=''>Todas as opções</option>
										{Object.entries(labels).map(([value, name]) => (
											<option key={value} value={value}>
												{name}
											</option>
										))}
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
						))}
						<FormField label='Ano'>
							<Input
								type='number'
								min={2000}
								max={2200}
								step={1}
								value={draft.year || ''}
								onChange={(event) => change('year', event.target.value)}
								placeholder='Ano do projeto'
							/>
						</FormField>
						<ServiceState query={departments}>
							<SearchSelect
								label='Unidade'
								value={departmentId}
								onChange={setDepartmentId}
								options={departments.data ?? []}
								placeholder='Todas as unidades'
							/>
						</ServiceState>
						{manager && (
							<FormField label='Abrangência'>
								<NativeSelect.Root>
									<NativeSelect.Field
										value={scope}
										onChange={(event) => {
											change('scope', event.target.value);
											setDepartmentId(null);
										}}
									>
										<option value='campus'>Meu campus</option>
										<option value='institution'>Toda a instituição</option>
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</FormField>
						)}
					</SimpleGrid>
					<Box asChild borderTop='1px solid' borderColor='border.default' pt={4}>
						<details
							open={catalogFields.some((field) => Boolean(params.get(`${field}Id`))) || undefined}
						>
							<Box as='summary' cursor='pointer' fontWeight='medium' mb={4}>
								Filtros de pesquisa e financiamento
							</Box>
							<ServiceState query={catalogs}>
								<ClassificationFields
									entries={catalogs.data ?? []}
									value={classification}
									onChange={setClassification}
									kind={draft.kind as ProjectKind | ''}
									historical
								/>
							</ServiceState>
						</details>
					</Box>
					<HStack>
						<BaseButton
							type='submit'
							disabled={
								departments.isPending ||
								departments.isError ||
								catalogs.isPending ||
								catalogs.isError
							}
						>
							Buscar
						</BaseButton>
						<BaseButton
							type='button'
							variant='secondary'
							onClick={() => {
								setDraft({});
								setClassification({});
								setDepartmentId(null);
								onClear();
							}}
						>
							Limpar filtros
						</BaseButton>
					</HStack>
					<Text fontSize='sm' color='fg.muted'>
						Prepare os filtros e clique em Buscar para aplicá-los juntos.
					</Text>
				</VStack>
			</form>
		</Surface>
	);
}
