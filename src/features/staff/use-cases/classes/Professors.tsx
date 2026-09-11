import { staffCurriculum } from '@Api/curriculum/staff';
import type { StaffClass } from '@Api/curriculum/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { RequestError } from './components';
import { useStaffMutation } from './hooks';
import { PeoplePicker } from './PeoplePicker';

export function ClassProfessors({ offering }: { offering: StaffClass }) {
	const [adding, setAdding] = useState(false);
	const assign = useStaffMutation(
		(id: number) => staffCurriculum.assign(offering.id, id),
		'Professor vinculado',
	);
	const remove = useStaffMutation(
		(id: number) => staffCurriculum.unassign(offering.id, id),
		'Professor desvinculado',
	);
	const pending = assign.isPending || remove.isPending;
	return (
		<Surface variant='panel'>
			<VStack align='stretch' gap={4}>
				<HStack justify='space-between' flexWrap='wrap'>
					<Heading as='h2' fontSize='lg'>
						Professores
					</Heading>
					<BaseButton variant='secondary' disabled={pending} onClick={() => setAdding(!adding)}>
						{adding ? 'Fechar busca de professores' : 'Vincular professor'}
					</BaseButton>
				</HStack>
				<RequestError error={remove.error} />
				{offering.professors.length ? (
					offering.professors.map((professor) => (
						<HStack key={professor.id} justify='space-between' gap={3}>
							<Text>{professor.name}</Text>
							<BaseButton
								size='sm'
								variant='subtle'
								disabled={pending}
								aria-label={`Desvincular ${professor.name}`}
								onClick={() => remove.mutate(professor.id)}
							>
								Desvincular
							</BaseButton>
						</HStack>
					))
				) : (
					<Text color='fg.muted'>Nenhum professor vinculado.</Text>
				)}
				{adding ? (
					<Box borderTopWidth='1px' borderColor='border.default' pt={4}>
						<PeoplePicker
							kind='professor'
							scope={offering.id}
							fetch={staffCurriculum.professors}
							onChoose={(id) => assign.mutate(id)}
							pending={pending}
							error={assign.error}
							linkedIds={offering.professors.map((item) => item.id)}
						/>
					</Box>
				) : null}
			</VStack>
		</Surface>
	);
}
