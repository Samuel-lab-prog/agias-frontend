import type {
	AcademicPeriod,
	ClassOffering,
	CourseOption,
	CreateClassOfferingBody,
} from '@Api/curriculum/types';
import { BaseButton } from '@BaseComponents';
import { Box, HStack, Input, NativeSelect, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { interactiveStyles } from '@core/themes/motion';

import { FieldLabel, RequestError } from './components';

const shifts = [
	['morning', 'Matutino'],
	['afternoon', 'Vespertino'],
	['evening', 'Noturno'],
	['integral', 'Integral'],
];
type Props = {
	initial?: ClassOffering;
	courses: CourseOption[];
	periods: AcademicPeriod[];
	pending: boolean;
	error: unknown;
	onSave: (input: CreateClassOfferingBody) => void;
	onCancel: () => void;
};
export function ClassForm({ initial, courses, periods, pending, error, onSave, onCancel }: Props) {
	return (
		<Box asChild>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					if (pending) return;
					const values = new FormData(event.currentTarget);
					const academicPeriodId =
						initial?.academicPeriodId ?? Number(values.get('academicPeriodId'));
					const period = periods.find((item) => item.id === academicPeriodId);
					onSave({
						title: String(values.get('title')).trim(),
						code: String(values.get('code')).trim(),
						shift: String(values.get('shift')) as ClassOffering['shift'],
						courseId: initial?.courseId ?? Number(values.get('courseId')),
						academicPeriodId,
						year: period?.year ?? initial!.year,
						term: String(period?.term ?? initial!.term),
					});
				}}
			>
				<VStack align='stretch' gap={4}>
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						<FieldLabel label='Nome da turma / disciplina' disabled={pending} required>
							<Input
								{...interactiveStyles.field}
								name='title'
								required
								minLength={3}
								maxLength={160}
								defaultValue={initial?.title}
								disabled={pending}
								placeholder='Ex.: Programação Web II — turma A'
							/>
						</FieldLabel>
						<FieldLabel label='Código da turma' disabled={pending} required>
							<Input
								{...interactiveStyles.field}
								name='code'
								required
								minLength={2}
								maxLength={60}
								defaultValue={initial?.code}
								disabled={pending}
								placeholder='Ex.: WEB-II-2026-2-A'
							/>
						</FieldLabel>
						<FieldLabel label='Curso' required disabled={pending || !!initial}>
							<NativeSelect.Root disabled={pending || !!initial}>
								<NativeSelect.Field
									{...interactiveStyles.field}
									name='courseId'
									defaultValue={initial?.courseId ?? ''}
								>
									<option value=''>Selecione o curso</option>
									{courses.map((course) => (
										<option key={course.id} value={course.id}>
											{course.name}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FieldLabel>
						<FieldLabel label='Período letivo' required disabled={pending || !!initial}>
							<NativeSelect.Root disabled={pending || !!initial}>
								<NativeSelect.Field
									{...interactiveStyles.field}
									name='academicPeriodId'
									defaultValue={initial?.academicPeriodId ?? ''}
								>
									<option value=''>Selecione o período</option>
									{periods.map((period) => (
										<option key={period.id} value={period.id}>
											{period.code}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FieldLabel>
						<FieldLabel label='Turno' disabled={pending}>
							<NativeSelect.Root disabled={pending}>
								<NativeSelect.Field
									{...interactiveStyles.field}
									name='shift'
									defaultValue={initial?.shift ?? 'morning'}
								>
									{shifts.map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</FieldLabel>
					</SimpleGrid>
					{initial ? (
						<Text fontSize='sm' color='fg.muted'>
							Curso e período identificam a oferta. Para outro curso ou período, cadastre uma nova
							turma.
						</Text>
					) : (
						<Text fontSize='sm' color='fg.muted'>
							Depois de criar a turma, vincule os professores e matricule os alunos.
						</Text>
					)}
					<RequestError error={error} />
					<HStack>
						<BaseButton type='submit' disabled={pending || !courses.length || !periods.length}>
							{pending ? 'Salvando…' : initial ? 'Salvar alterações' : 'Criar turma'}
						</BaseButton>
						<BaseButton type='button' variant='secondary' disabled={pending} onClick={onCancel}>
							Cancelar
						</BaseButton>
					</HStack>
				</VStack>
			</form>
		</Box>
	);
}
