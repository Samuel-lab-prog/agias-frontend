import { staffCurriculum } from '@Api/curriculum/staff';
import type { EnrollmentStatus, StaffClass, StaffEnrollment } from '@Api/curriculum/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, Input, NativeSelect, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { FieldLabel, Pagination, RequestError } from './components';
import { useSearch, useStaffMutation, useStaffQuery } from './hooks';
import { PeoplePicker } from './PeoplePicker';

const statuses: Array<[EnrollmentStatus, string]> = [
	['active', 'Ativa'],
	['completed', 'Concluída'],
	['cancelled', 'Cancelada'],
	['inactive', 'Inativa'],
];
function StatusEditor({
	row,
	pending,
	onSave,
}: {
	row: StaffEnrollment;
	pending: boolean;
	onSave: (status: EnrollmentStatus) => void;
}) {
	const [status, setStatus] = useState(row.status);
	return (
		<HStack flexWrap='wrap' gap={2}>
			<NativeSelect.Root width='150px' disabled={pending}>
				<NativeSelect.Field
					aria-label={`Situação de ${row.student.name}`}
					value={status}
					onChange={(event) => setStatus(event.target.value as EnrollmentStatus)}
				>
					{statuses.map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</NativeSelect.Field>
				<NativeSelect.Indicator />
			</NativeSelect.Root>
			<BaseButton
				size='sm'
				variant='secondary'
				aria-label={`Salvar situação de ${row.student.name}`}
				disabled={pending || status === row.status}
				onClick={() => onSave(status)}
			>
				Salvar
			</BaseButton>
		</HStack>
	);
}
export function ClassRoster({ offering }: { offering: StaffClass }) {
	const search = useSearch();
	const [page, setPage] = useState(1);
	const [adding, setAdding] = useState(false);
	const query = useStaffQuery(['roster', offering.id, search.query, page], () =>
		staffCurriculum.roster(offering.id, { q: search.query, page }),
	);
	const enroll = useStaffMutation(
		(id: number) => staffCurriculum.enroll(offering.id, id),
		'Aluno matriculado',
	);
	const change = useStaffMutation(
		(input: { id: number; status: EnrollmentStatus }) =>
			staffCurriculum.status(offering.id, input.id, input.status),
		'Situação da matrícula atualizada',
	);
	const pending = enroll.isPending || change.isPending;
	return (
		<Surface variant='panel'>
			<VStack align='stretch' gap={4}>
				<HStack justify='space-between' flexWrap='wrap'>
					<Box>
						<Heading as='h2' fontSize='lg'>
							Matrículas
						</Heading>
						<Text color='fg.muted' fontSize='sm'>
							A situação controla a presença da turma na área do aluno. O histórico é preservado.
						</Text>
					</Box>
					<BaseButton
						variant={adding ? 'secondary' : 'primary'}
						onClick={() => setAdding(!adding)}
						disabled={pending}
					>
						{adding ? 'Fechar busca de alunos' : 'Matricular aluno'}
					</BaseButton>
				</HStack>
				{adding ? (
					<Box borderWidth='1px' borderColor='border.default' borderRadius='lg' p={4}>
						<Text color='fg.muted' fontSize='sm' mb={3}>
							Selecione um aluno deste curso. Alunos sem curso serão vinculados ao curso da turma ao
							matricular.
						</Text>
						<PeoplePicker
							kind='student'
							scope={offering.courseId}
							fetch={(filters) =>
								staffCurriculum.students({ ...filters, courseId: offering.courseId })
							}
							onChoose={(id) => enroll.mutate(id)}
							pending={pending}
							error={enroll.error}
							linkedIds={query.data?.items.map((item) => item.studentProfileId)}
						/>
					</Box>
				) : null}
				<FieldLabel label='Buscar matrícula na turma'>
					<Input
						value={search.text}
						onChange={(event) => {
							search.setText(event.target.value);
							setPage(1);
						}}
						placeholder='Nome do aluno ou matrícula'
					/>
				</FieldLabel>
				<RequestError
					error={change.error || query.error}
					retry={query.isError ? () => void query.refetch() : undefined}
				/>
				{query.isPending ? (
					<Text role='status'>Carregando matrículas…</Text>
				) : query.data ? (
					<>
						{!query.data.items.length ? (
							<Text role='status'>
								Nenhuma matrícula encontrada. Use “Matricular aluno” para adicionar alunos.
							</Text>
						) : (
							query.data.items.map((row) => (
								<HStack
									key={row.id}
									justify='space-between'
									flexWrap='wrap'
									gap={3}
									py={3}
									borderBottomWidth='1px'
									borderColor='border.default'
								>
									<Box>
										<Text fontWeight='semibold'>{row.student.name}</Text>
										<Text color='fg.muted' fontSize='sm'>
											{row.student.academicId}
										</Text>
									</Box>
									<StatusEditor
										key={`${row.id}-${row.status}`}
										row={row}
										pending={pending}
										onSave={(status) => change.mutate({ id: row.id, status })}
									/>
								</HStack>
							))
						)}
						<Pagination {...query.data} onChange={setPage} disabled={query.isFetching || pending} />
					</>
				) : null}
			</VStack>
		</Surface>
	);
}
