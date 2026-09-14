import {
	type CatalogBody,
	type CatalogEntry,
	catalogFields,
	catalogLabels,
	type CatalogType,
	parentFields,
	projectCatalogs,
} from '@Api/projects/catalogs';
import { BaseButton, Surface } from '@BaseComponents';
import {
	Badge,
	Heading,
	HStack,
	Input,
	NativeSelect,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ServicesShell } from '../../components/Shell';
import { Feedback, FormField, ServiceHeader, ServiceLink, ServiceState } from '../../components/UI';
import { kindLabels } from '../../utils';
import { optionLabel } from './search-options';
import { SearchSelect } from './SearchSelect';

function CatalogEditor({
	type,
	current,
	entries,
	onDone,
	onSaved,
}: {
	type: CatalogType;
	current?: CatalogEntry;
	entries: CatalogEntry[];
	onDone: () => void;
	onSaved: () => void;
}) {
	const client = useQueryClient();
	const [body, setBody] = useState<CatalogBody>(() =>
		current
			? {
					type: current.type,
					name: current.name,
					code: current.code,
					kind: current.kind,
					parentId: current.parentId,
					active: current.active,
				}
			: { type, name: '', code: null, kind: null, parentId: null, active: true },
	);
	const save = useMutation({
		mutationFn: () =>
			current
				? projectCatalogs.update(current.id, { ...body, version: current.version })
				: projectCatalogs.create(body),
		onSuccess: async () => {
			await Promise.all([
				client.invalidateQueries({ queryKey: ['project-catalogs'] }),
				client.invalidateQueries({ queryKey: ['projects'] }),
				client.invalidateQueries({ queryKey: ['project'] }),
			]);
			onSaved();
		},
	});
	const parent = parentFields[type];
	return (
		<Surface variant='panel'>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					save.mutate();
				}}
			>
				<VStack align='stretch' gap={4}>
					<Heading as='h2' fontSize='lg'>
						{current ? 'Editar opção' : 'Nova opção'} — {catalogLabels[type]}
					</Heading>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<FormField label='Nome da opção' required>
							<Input
								required
								minLength={2}
								maxLength={200}
								value={body.name}
								onChange={(event) => setBody({ ...body, name: event.target.value })}
							/>
						</FormField>
						<FormField label='Sigla ou código'>
							<Input
								maxLength={100}
								value={body.code ?? ''}
								onChange={(event) => setBody({ ...body, code: event.target.value || null })}
							/>
						</FormField>
						<FormField label='Modalidade aplicável'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={body.kind ?? ''}
									onChange={(event) =>
										setBody({
											...body,
											kind: (event.target.value as CatalogBody['kind']) || null,
											parentId: null,
										})
									}
								>
									<option value=''>Todas as modalidades</option>
									{Object.entries(kindLabels).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Disponibilidade'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={body.active ? 'active' : 'inactive'}
									onChange={(event) =>
										setBody({ ...body, active: event.target.value === 'active' })
									}
								>
									<option value='active'>Ativa para novos cadastros</option>
									<option value='inactive'>Inativa — somente histórico</option>
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						{parent && (
							<SearchSelect
								label={`${catalogLabels[parent]} vinculada`}
								value={body.parentId}
								onChange={(parentId) => setBody({ ...body, parentId })}
								options={entries.filter(
									(entry) =>
										entry.type === parent &&
										(entry.active || entry.id === current?.parentId) &&
										(!entry.kind || entry.kind === body.kind),
								)}
								placeholder='Sem vínculo obrigatório'
							/>
						)}
					</SimpleGrid>
					<Text fontSize='sm' color='fg.muted'>
						Desativar preserva os projetos existentes. Modalidade e vínculo ficam protegidos depois
						que a opção é utilizada. Para editais, inclua a identificação e o ano no nome ou código.
					</Text>
					<Feedback error={save.error} />
					<HStack>
						<BaseButton type='submit' disabled={save.isPending}>
							Salvar opção
						</BaseButton>
						<BaseButton
							type='button'
							variant='secondary'
							onClick={onDone}
							disabled={save.isPending}
						>
							Cancelar
						</BaseButton>
					</HStack>
				</VStack>
			</form>
		</Surface>
	);
}

export function ProjectCatalogsPage() {
	const [type, setType] = useState<CatalogType>('knowledgeArea');
	const [search, setSearch] = useState('');
	const [editing, setEditing] = useState<CatalogEntry | 'new' | null>(null);
	const [saved, setSaved] = useState(false);
	const query = useQuery({ queryKey: ['project-catalogs'], queryFn: projectCatalogs.list });
	const entries = query.data ?? [];
	const normalize = (value: string) =>
		value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');
	const filtered = entries.filter(
		(entry) => entry.type === type && normalize(optionLabel(entry)).includes(normalize(search)),
	);
	return (
		<ServicesShell>
			<VStack align='stretch' gap={5}>
				<ServiceHeader
					title='Catálogos de projetos'
					description='Cadastre as opções oficiais compartilhadas pelos campi da instituição. Cadastro e busca de projetos usam estes mesmos registros.'
					action={<ServiceLink to='/projects'>Voltar aos projetos</ServiceLink>}
				/>
				<Surface variant='panel'>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<FormField label='Catálogo'>
							<NativeSelect.Root>
								<NativeSelect.Field
									value={type}
									onChange={(event) => {
										setType(event.target.value as CatalogType);
										setEditing(null);
										setSearch('');
										setSaved(false);
									}}
								>
									{catalogFields.map((field) => (
										<option key={field} value={field}>
											{catalogLabels[field]}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FormField>
						<FormField label='Buscar opção'>
							<Input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder='Nome, sigla ou código'
							/>
						</FormField>
					</SimpleGrid>
				</Surface>
				<ServiceState query={query}>
					{editing ? (
						<CatalogEditor
							key={editing === 'new' ? `new-${type}` : `${editing.id}-${editing.version}`}
							type={type}
							current={editing === 'new' ? undefined : editing}
							entries={entries}
							onDone={() => {
								setEditing(null);
							}}
							onSaved={() => {
								setEditing(null);
								setSaved(true);
							}}
						/>
					) : (
						<BaseButton
							w='fit-content'
							onClick={() => {
								setEditing('new');
								setSaved(false);
							}}
						>
							Nova opção
						</BaseButton>
					)}
					{saved && <Text role='status'>Catálogo atualizado.</Text>}
					{filtered.length === 0 ? (
						<Surface variant='panel'>
							<Text>
								{entries.some((entry) => entry.type === type)
									? 'Nenhuma opção corresponde à busca.'
									: 'Este catálogo ainda não tem opções. Cadastre os registros oficiais da instituição para disponibilizá-los nos projetos.'}
							</Text>
						</Surface>
					) : (
						filtered.map((entry) => (
							<Surface variant='panel' key={entry.id}>
								<HStack justify='space-between' align='start' flexWrap='wrap'>
									<VStack align='start' gap={2}>
										<Heading as='h2' fontSize='md'>
											{entry.code ? `${entry.code} — ` : ''}
											{entry.name}
										</Heading>
										<HStack>
											<Badge colorPalette={entry.active ? 'green' : 'gray'}>
												{entry.active ? 'Ativa' : 'Inativa'}
											</Badge>
											<Text fontSize='sm'>
												{entry.kind ? kindLabels[entry.kind] : 'Todas as modalidades'}
											</Text>
										</HStack>
										{entry.parentId && (
											<Text fontSize='sm' color='fg.muted'>
												Vínculo: {entries.find((parent) => parent.id === entry.parentId)?.name}
											</Text>
										)}
									</VStack>
									<BaseButton
										variant='secondary'
										onClick={() => {
											setEditing(entry);
											setSaved(false);
										}}
										aria-label={`Editar ${entry.name}`}
									>
										Editar
									</BaseButton>
								</HStack>
							</Surface>
						))
					)}
				</ServiceState>
			</VStack>
		</ServicesShell>
	);
}
