import { staffCurriculum } from '@Api/curriculum/staff';
import type { CreateClassOfferingBody } from '@Api/curriculum/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StaffPageShell as NavigationPageShell } from '@features/staff/public/components/StaffPageShell';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { staffNavigationPreset } from '../home/navigation';
import { ClassForm } from './ClassForm';
import { RequestError } from './components';
import { useStaffMutation, useStaffQuery } from './hooks';
import { ClassProfessors } from './Professors';
import { ClassRoster } from './Roster';

export function StaffClassDetailsPage() {
	const id = Number(useParams().classId);
	const [editing, setEditing] = useState(false);
	const validId = Number.isInteger(id) && id > 0;
	const query = useStaffQuery(['class', id], () => staffCurriculum.classDetail(id), validId);
	const update = useStaffMutation(
		(input: CreateClassOfferingBody) =>
			staffCurriculum.update(id, { title: input.title, code: input.code, shift: input.shift }),
		'Turma atualizada',
		() => setEditing(false),
	);
	const offering = query.data;
	return (
		<NavigationPageShell preset={staffNavigationPreset}>
			<VStack align='stretch' gap={5}>
				<BaseButton asChild variant='subtle' alignSelf='start'>
					<NavLink to='/staff/classes'>← Voltar para turmas</NavLink>
				</BaseButton>
				{!validId ? (
					<RequestError error={{ message: 'Turma não encontrada.' }} />
				) : query.isPending ? (
					<Text role='status'>Carregando turma…</Text>
				) : query.isError ? (
					<RequestError error={query.error} retry={() => void query.refetch()} />
				) : offering ? (
					<>
						<HStack justify='space-between' flexWrap='wrap' gap={3}>
							<Box>
								<Text color='action.primary' fontWeight='semibold'>
									{offering.academicPeriod.code} · {offering.code}
								</Text>
								<Heading as='h1' fontSize='2xl' mt={1}>
									{offering.title}
								</Heading>
								<Text color='fg.muted' mt={1}>
									{offering.course.name} · {offering.activeEnrollments} matrículas ativas
								</Text>
							</Box>
							{!editing ? (
								<BaseButton variant='secondary' onClick={() => setEditing(true)}>
									Editar turma
								</BaseButton>
							) : null}
						</HStack>
						{editing ? (
							<Surface variant='panel'>
								<ClassForm
									initial={offering}
									courses={[offering.course]}
									periods={[offering.academicPeriod]}
									pending={update.isPending}
									error={update.error}
									onSave={(input) => update.mutate(input)}
									onCancel={() => {
										setEditing(false);
										update.reset();
									}}
								/>
							</Surface>
						) : null}
						<ClassProfessors offering={offering} />
						<ClassRoster offering={offering} />
					</>
				) : null}
			</VStack>
		</NavigationPageShell>
	);
}
