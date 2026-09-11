import { Surface } from '@BaseComponents';
import { Badge, Box, Heading, Text, VStack } from '@chakra-ui/react';

import { MaterialLinks } from '../../../components/MaterialLinks';
import type { SubjectActivityDetails } from '../types';

export function SubjectAssessments({ assessments }: { assessments: SubjectActivityDetails[] }) {
	return (
		<Surface variant='panel'>
			<Heading as='h2' fontSize='lg' mb={4}>
				Avaliações
			</Heading>
			{!assessments.length ? (
				<Text fontSize='sm' color='fg.muted'>
					Nenhuma avaliação publicada para esta disciplina.
				</Text>
			) : (
				<VStack align='stretch' gap={4}>
					{assessments.map((item) => (
						<Box key={item.id} p={3} bg='bg.muted' borderRadius='lg'>
							<Heading as='h3' fontSize='md'>
								{item.title}
							</Heading>
							<Badge my={2} colorPalette='purple'>
								{item.assessmentType ?? 'Tipo não informado'}
							</Badge>
							<Text fontSize='sm'>Aplicação: {item.dueLabel}</Text>
							<Text fontSize='sm'>
								Valor: {item.maxGrade ?? 'Não informado'} · Peso: {item.weight ?? 'Não informado'}
							</Text>
							<Text fontSize='sm' fontWeight='semibold' mt={1}>
								{item.grade !== null ? `Nota: ${item.grade}` : 'Nota não publicada'}
							</Text>
							{item.description ? (
								<Text fontSize='sm' my={2}>
									{item.description}
								</Text>
							) : null}
							<MaterialLinks
								materials={(item.attachments ?? []).map((file) => ({
									id: file.id,
									title: file.fileName,
									url: file.fileUrl,
								}))}
							/>
						</Box>
					))}
				</VStack>
			)}
		</Surface>
	);
}
