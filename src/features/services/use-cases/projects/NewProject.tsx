import { type ClassificationIds, projectCatalogs } from '@Api/projects/catalogs';
import { type ProjectBody, type ProjectKind, projects } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Input, NativeSelect, SimpleGrid, Text, Textarea, VStack } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Feedback, FormField, ServiceHeader, ServiceLink, ServiceState } from '../../components/UI';
import { kindLabels, originLabels } from '../../utils';
import { ClassificationFields } from './ClassificationFields';
import { SearchSelect } from './SearchSelect';
export function NewProject() {
	const navigate = useNavigate();
	const [kind, setKind] = useState<ProjectKind>('research');
	const [classification, setClassification] = useState<ClassificationIds>({});
	const [departmentId, setDepartmentId] = useState<number | null>(null);
	const catalogs = useQuery({ queryKey: ['project-catalogs'], queryFn: projectCatalogs.list });
	const departments = useQuery({
		queryKey: ['project-departments', 'campus'],
		queryFn: () => projects.departments('campus'),
	});
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
						const body: ProjectBody = {
							title: String(form.get('title')),
							objectives: String(form.get('objectives')),
							kind,
							origin,
							...classification,
							...(departmentId ? { departmentId } : {}),
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
									onChange={(e) => {
										setKind(e.target.value as ProjectKind);
										setClassification({});
									}}
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
						<ServiceState query={departments}>
							<SearchSelect
								label='Unidade'
								value={departmentId}
								onChange={setDepartmentId}
								options={departments.data ?? []}
								placeholder='Selecione a unidade'
							/>
						</ServiceState>
						<ServiceState query={catalogs}>
							<ClassificationFields
								entries={catalogs.data ?? []}
								value={classification}
								onChange={setClassification}
								kind={kind}
							/>
						</ServiceState>
						<Text color='fg.muted' fontSize='sm'>
							Você será a pessoa responsável pela coordenação. O projeto será salvo como rascunho.
						</Text>
						<Feedback error={mutation.error} />
						<BaseButton
							type='submit'
							disabled={
								mutation.isPending ||
								catalogs.isPending ||
								catalogs.isError ||
								departments.isPending ||
								departments.isError
							}
							w='fit-content'
						>
							Salvar projeto
						</BaseButton>
					</VStack>
				</form>
			</Surface>
		</VStack>
	);
}
