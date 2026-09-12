import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { HStack, Input, NativeSelect, SimpleGrid, Textarea, VStack } from '@chakra-ui/react';
import { interactiveStyles } from '@core/themes/motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';

import { EditorField } from '../../components/EditorField';
import { MutationFeedback, SectionHeading } from '../../components/TeachingUI';
import { formDate, formText, formTitle, optionalText } from './form-values';

export function ActivityForm({ classId }: { classId: number }) {
	const client = useQueryClient();
	const form = useRef<HTMLFormElement>(null);
	const [kind, setKind] = useState('activity');
	const mutation = useMutation({
		mutationFn: (data: FormData) =>
			teaching.saveActivity(classId, {
				title: formTitle(data, 'title'),
				description: optionalText(data, 'description'),
				kind,
				dueAt: formDate(data, 'dueAt'),
				appliesAt: kind === 'assessment' ? formDate(data, 'appliesAt', true) : null,
				maxGrade: formText(data, 'maxGrade') ? Number(formText(data, 'maxGrade')) : null,
				weight: null,
				assessmentType: null,
				allowLateSubmissions: formText(data, 'late') === 'yes',
			}),
		onSuccess: () => {
			form.current?.reset();
			setKind('activity');
			void client.invalidateQueries({ queryKey: ['teaching'] });
		},
	});
	return (
		<Surface variant='panel'>
			<SectionHeading
				title='Nova atividade ou avaliação'
				description='Apresente a proposta e defina as condições de entrega para a turma.'
			/>
			<form
				ref={form}
				onSubmit={(event) => {
					event.preventDefault();
					mutation.mutate(new FormData(event.currentTarget));
				}}
			>
				<fieldset disabled={mutation.isPending}>
					<VStack align='stretch' gap={4}>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<EditorField label='Título' required>
								<Input
									{...interactiveStyles.field}
									name='title'
									required
									minLength={3}
									maxLength={200}
									placeholder='Ex.: Projeto de conclusão da unidade'
								/>
							</EditorField>
							<EditorField label='Tipo'>
								<NativeSelect.Root>
									<NativeSelect.Field
										{...interactiveStyles.field}
										value={kind}
										onChange={(event) => setKind(event.target.value)}
									>
										<option value='activity'>Atividade</option>
										<option value='assessment'>Avaliação</option>
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</EditorField>
						</SimpleGrid>
						<EditorField label='Orientações'>
							<Textarea
								{...interactiveStyles.field}
								name='description'
								minH='110px'
								maxLength={5000}
								placeholder='Descreva a proposta e o que deve ser entregue.'
							/>
						</EditorField>
						<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
							<EditorField
								label='Prazo de entrega'
								hint='Opcional. Horário no fuso do seu dispositivo.'
							>
								<Input {...interactiveStyles.field} name='dueAt' type='datetime-local' />
							</EditorField>
							{kind === 'assessment' && (
								<EditorField label='Data de aplicação' required>
									<Input
										{...interactiveStyles.field}
										name='appliesAt'
										type='datetime-local'
										required
									/>
								</EditorField>
							)}
							<EditorField label='Pontuação máxima' required={kind === 'assessment'}>
								<Input
									{...interactiveStyles.field}
									name='maxGrade'
									type='number'
									min={0.01}
									max={999.99}
									step={0.01}
									defaultValue={10}
									required={kind === 'assessment'}
								/>
							</EditorField>
							<EditorField label='Entregas após o prazo'>
								<NativeSelect.Root>
									<NativeSelect.Field {...interactiveStyles.field} name='late' defaultValue='yes'>
										<option value='yes'>Permitir</option>
										<option value='no'>Não permitir</option>
									</NativeSelect.Field>
									<NativeSelect.Indicator />
								</NativeSelect.Root>
							</EditorField>
						</SimpleGrid>
						<MutationFeedback
							{...mutation}
							success='Proposta criada e adicionada às atividades da turma.'
						/>
						<HStack justify='end'>
							<BaseButton type='submit' loading={mutation.isPending}>
								<Plus size={16} aria-hidden='true' />
								{kind === 'assessment' ? 'Criar avaliação' : 'Criar atividade'}
							</BaseButton>
						</HStack>
					</VStack>
				</fieldset>
			</form>
		</Surface>
	);
}
