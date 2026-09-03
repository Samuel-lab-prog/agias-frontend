import type { StudentProfile } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { translateBackendStatus } from '@core/utils/backend-labels';

type StudentInstitutionCardProps = {
	profile?: StudentProfile;
	courseLevel?: string | null;
	attendanceSummary?: {
		percentage: number;
	};
};

export function StudentInstitutionCard({
	profile,
	courseLevel,
	attendanceSummary,
}: StudentInstitutionCardProps) {
	const courseLabel =
		profile?.courseId !== null && profile?.courseId !== undefined
			? `Curso ${profile.courseId}`
			: 'Curso não vinculado';
	const institutionData = [
		['Matrícula', profile?.academicId ?? 'Não informado'],
		['Curso', courseLabel],
		['Nível', courseLevel ?? 'Não informado pelo backend'],
		['Frequência', attendanceSummary ? `${attendanceSummary.percentage}%` : 'Sem dados'],
		['Status', translateBackendStatus(profile?.status)],
		['Entrada', profile?.admissionYear ? String(profile.admissionYear) : 'Não informado'],
	];

	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700' mb={4}>
				Dados institucionais
			</Heading>
			<VStack align='stretch' gap={2}>
				{institutionData.map(([label, value]) => (
					<Flex key={label} justify='space-between' gap={3}>
						<Text
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							color={'fg.muted'}
							_dark={{ color: 'fg.muted' }}
						>
							{label}
						</Text>
						<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold' textAlign='right'>
							{value}
						</Text>
					</Flex>
				))}
			</VStack>
		</Surface>
	);
}
