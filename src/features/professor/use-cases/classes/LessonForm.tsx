import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { HStack, Input, SimpleGrid, VStack } from '@chakra-ui/react';
import { interactiveStyles } from '@core/themes/motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

import { EditorField } from '../../components/EditorField';
import { MutationFeedback, SectionHeading } from '../../components/TeachingUI';
import { formDate, formTitle, optionalText } from './form-values';

export function LessonForm({ classId }: { classId: number }) {
	const client = useQueryClient();
	const form = useRef<HTMLFormElement>(null);
	const mutation = useMutation({
		mutationFn: (data: FormData) => {
			const startsAt = formDate(data, 'startsAt', true)!;
			const endsAt = formDate(data, 'endsAt');
			if (endsAt && Date.parse(endsAt) <= Date.parse(startsAt))
				throw new Error('O término deve ser posterior ao início da aula.');
			return teaching.saveLesson(classId, {
				topic: formTitle(data, 'topic'),
				startsAt,
				endsAt,
				room: optionalText(data, 'room'),
				deliveredContent: null,
				publicNotes: null,
				status: 'scheduled',
				coursePlanTopicId: null,
			});
		},
		onSuccess: () => {
			form.current?.reset();
			void client.invalidateQueries({ queryKey: ['teaching'] });
		},
	});
	return (
		<Surface variant='panel'>
			<SectionHeading
				title='Nova aula'
				description='Defina o tema, o horário e o local. A aula aparecerá na agenda docente.'
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
							<EditorField label='Tema da aula' required>
								<Input
									{...interactiveStyles.field}
									name='topic'
									required
									minLength={3}
									maxLength={200}
									placeholder='Ex.: Introdução à programação'
								/>
							</EditorField>
							<EditorField label='Local' hint='Opcional. Ex.: Sala 204 ou laboratório.'>
								<Input {...interactiveStyles.field} name='room' maxLength={200} />
							</EditorField>
							<EditorField label='Início da aula' required>
								<Input
									{...interactiveStyles.field}
									name='startsAt'
									type='datetime-local'
									required
								/>
							</EditorField>
							<EditorField
								label='Término da aula'
								hint='Opcional. Horários no fuso do seu dispositivo.'
							>
								<Input {...interactiveStyles.field} name='endsAt' type='datetime-local' />
							</EditorField>
						</SimpleGrid>
						<MutationFeedback {...mutation} success='Aula registrada. Sua agenda foi atualizada.' />
						<HStack justify='end'>
							<BaseButton type='submit' loading={mutation.isPending}>
								<Plus size={16} aria-hidden='true' />
								Registrar aula
							</BaseButton>
						</HStack>
					</VStack>
				</fieldset>
			</form>
		</Surface>
	);
}
