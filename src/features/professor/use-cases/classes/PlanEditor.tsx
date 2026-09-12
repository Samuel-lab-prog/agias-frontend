import { teaching } from '@Api/teaching/endpoints';
import type { Plan } from '@Api/teaching/types';
import { BaseButton, Surface } from '@BaseComponents';
import {
	Box,
	HStack,
	Input,
	NativeSelect,
	SimpleGrid,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import { interactiveStyles } from '@core/themes/motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';

import { EditorField } from '../../components/EditorField';
import { MutationFeedback, SectionHeading, StatusPill } from '../../components/TeachingUI';
import { formText, optionalText } from './form-values';

export function PlanEditor({ classId, plan }: { classId: number; plan: Plan | null }) {
	const client = useQueryClient();
	const mutation = useMutation({
		mutationFn: (data: FormData) => {
			const status = formText(data, 'status');
			const syllabus = optionalText(data, 'syllabus');
			if (status === 'published' && !syllabus)
				throw new Error('Preencha a ementa antes de publicar o plano.');
			return teaching.savePlan(classId, {
				syllabus,
				generalObjectives: optionalText(data, 'objectives'),
				methodology: optionalText(data, 'methodology'),
				assessmentCriteria: optionalText(data, 'criteria'),
				workloadMinutes: formText(data, 'workload') ? Number(formText(data, 'workload')) : null,
				status,
			});
		},
		onSuccess: () => {
			void client.invalidateQueries({ queryKey: ['teaching'] });
		},
	});
	return (
		<VStack align='stretch' gap={4}>
			<Surface variant='panel'>
				<SectionHeading
					title='Plano de ensino'
					description='Defina a proposta da disciplina e como o aprendizado será acompanhado.'
					action={
						<StatusPill tone={plan?.status === 'published' ? 'success' : 'neutral'}>
							{plan?.status === 'published'
								? 'Publicado'
								: plan?.status === 'archived'
									? 'Arquivado'
									: 'Rascunho'}
						</StatusPill>
					}
				/>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						mutation.mutate(new FormData(event.currentTarget));
					}}
				>
					<fieldset disabled={mutation.isPending}>
						<VStack align='stretch' gap={5}>
							<EditorField label='Ementa' hint='Descreva os temas e o escopo da disciplina.'>
								<Textarea
									{...interactiveStyles.field}
									name='syllabus'
									defaultValue={plan?.syllabus ?? ''}
									minH='140px'
									maxLength={5000}
								/>
							</EditorField>
							<EditorField label='Objetivos gerais'>
								<Textarea
									{...interactiveStyles.field}
									name='objectives'
									defaultValue={plan?.generalObjectives ?? ''}
									minH='120px'
									maxLength={5000}
								/>
							</EditorField>
							<SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
								<EditorField label='Metodologia'>
									<Textarea
										{...interactiveStyles.field}
										name='methodology'
										defaultValue={plan?.methodology ?? ''}
										minH='120px'
										maxLength={5000}
									/>
								</EditorField>
								<EditorField label='Critérios de avaliação'>
									<Textarea
										{...interactiveStyles.field}
										name='criteria'
										defaultValue={plan?.assessmentCriteria ?? ''}
										minH='120px'
										maxLength={5000}
									/>
								</EditorField>
							</SimpleGrid>
							<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
								<EditorField label='Carga horária em minutos' hint='Preenchimento opcional.'>
									<Input
										{...interactiveStyles.field}
										name='workload'
										type='number'
										min={0}
										max={100000}
										step={1}
										defaultValue={plan?.workloadMinutes ?? ''}
									/>
								</EditorField>
								<EditorField label='Situação do plano'>
									<NativeSelect.Root>
										<NativeSelect.Field
											{...interactiveStyles.field}
											name='status'
											defaultValue={plan?.status ?? 'draft'}
										>
											<option value='draft'>Rascunho</option>
											<option value='published'>Publicado</option>
											<option value='archived'>Arquivado</option>
										</NativeSelect.Field>
										<NativeSelect.Indicator />
									</NativeSelect.Root>
								</EditorField>
							</SimpleGrid>
							<MutationFeedback {...mutation} success='Plano de ensino salvo com sucesso.' />
							<HStack
								justify='space-between'
								align='start'
								flexWrap='wrap'
								gap={3}
								pt={3}
								borderTopWidth='1px'
								borderColor='border.muted'
							>
								<Text fontSize='sm' color='fg.muted' maxW='420px'>
									Revise a ementa antes de selecionar “Publicado”.
								</Text>
								<BaseButton type='submit' loading={mutation.isPending}>
									<Save size={16} aria-hidden='true' />
									Salvar plano
								</BaseButton>
							</HStack>
						</VStack>
					</fieldset>
				</form>
			</Surface>
			{!!plan?.units.length && (
				<Surface variant='panel'>
					<SectionHeading
						title='Unidades do plano'
						description='Conteúdos organizados para esta disciplina.'
					/>
					<VStack align='stretch' gap={4}>
						{plan.units.map((unit, index) => (
							<Box key={unit.id}>
								<Text fontWeight='semibold'>
									{index + 1}. {unit.title}
								</Text>
								{unit.topics.map((topic) => (
									<Text key={topic.id} fontSize='sm' color='fg.muted' mt={2} pl={4}>
										• {topic.title}
									</Text>
								))}
							</Box>
						))}
					</VStack>
				</Surface>
			)}
		</VStack>
	);
}
