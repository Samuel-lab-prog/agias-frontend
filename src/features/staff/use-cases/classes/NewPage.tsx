import { staffCurriculum } from '@Api/curriculum/staff';
import { Surface } from '@BaseComponents';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { StaffPageShell as NavigationPageShell } from '@features/staff/public/components/StaffPageShell';
import { useNavigate } from 'react-router-dom';

import { staffNavigationPreset } from '../home/navigation';
import { ClassForm } from './ClassForm';
import { RequestError } from './components';
import { useClassOptions, useStaffMutation } from './hooks';

export function StaffNewClassPage() {
	const navigate = useNavigate();
	const { courses, periods } = useClassOptions();
	const create = useStaffMutation(staffCurriculum.create, 'Turma criada', (result) =>
		navigate(`/staff/classes/${result.id}`),
	);
	return (
		<NavigationPageShell preset={staffNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<Heading as='h1' fontSize='2xl'>
					Nova turma
				</Heading>
				<Surface variant='panel'>
					{courses.isPending || periods.isPending ? (
						<Text role='status'>Carregando cursos e períodos…</Text>
					) : courses.isError || periods.isError ? (
						<RequestError
							error={courses.error || periods.error}
							retry={() => {
								void courses.refetch();
								void periods.refetch();
							}}
						/>
					) : (
						<>
							{!courses.data?.length || !periods.data?.length ? (
								<Text role='status' mb={4}>
									É necessário cadastrar um curso e um período letivo antes de criar turmas.
								</Text>
							) : null}
							<ClassForm
								courses={courses.data ?? []}
								periods={periods.data ?? []}
								pending={create.isPending}
								error={create.error}
								onSave={(input) => create.mutate(input)}
								onCancel={() => navigate('/staff/classes')}
							/>
						</>
					)}
				</Surface>
			</VStack>
		</NavigationPageShell>
	);
}
