import { type ClassificationIds, projectCatalogs } from '@Api/projects/catalogs';
import { type ProjectDetail, projects } from '@Api/projects/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Heading, HStack, VStack } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Feedback, ServiceState } from '../../components/UI';
import { ClassificationFields } from './ClassificationFields';
import { SearchSelect } from './SearchSelect';

export function ClassificationEditor({
	project,
	onClose,
}: {
	project: ProjectDetail;
	onClose: () => void;
}) {
	const [value, setValue] = useState<ClassificationIds>(project);
	const [departmentId, setDepartmentId] = useState(project.department?.id ?? null);
	const client = useQueryClient();
	const catalogs = useQuery({ queryKey: ['project-catalogs'], queryFn: projectCatalogs.list });
	const departments = useQuery({
		queryKey: ['project-departments', 'campus'],
		queryFn: () => projects.departments('campus'),
	});
	const save = useMutation({
		mutationFn: () =>
			projects.updateClassification(project.id, {
				researchLineId: value.researchLineId,
				knowledgeAreaId: value.knowledgeAreaId,
				researchGroupId: value.researchGroupId,
				fundingAgencyId: value.fundingAgencyId,
				callNameId: value.callNameId,
				natureId: value.natureId,
				researchTypeId: value.researchTypeId,
				departmentId,
				version: project.version,
			}),
		onSuccess: async () => {
			await Promise.all([
				client.invalidateQueries({ queryKey: ['project', project.id] }),
				client.invalidateQueries({ queryKey: ['projects'] }),
			]);
			onClose();
		},
	});
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
						Editar classificação
					</Heading>
					<ServiceState query={departments}>
						<SearchSelect
							label='Unidade'
							value={departmentId}
							onChange={setDepartmentId}
							options={departments.data ?? []}
						/>
					</ServiceState>
					<ServiceState query={catalogs}>
						<ClassificationFields
							entries={catalogs.data ?? []}
							value={value}
							onChange={setValue}
							previous={project}
							kind={project.kind}
							disabled={save.isPending}
						/>
					</ServiceState>
					<Feedback error={save.error} />
					<HStack>
						<BaseButton
							type='submit'
							disabled={
								save.isPending ||
								catalogs.isPending ||
								catalogs.isError ||
								departments.isPending ||
								departments.isError
							}
						>
							Salvar classificação
						</BaseButton>
						<BaseButton
							type='button'
							variant='secondary'
							onClick={onClose}
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
