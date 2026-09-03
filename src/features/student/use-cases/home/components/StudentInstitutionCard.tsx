import type { StudentProfile } from '@Api/academic/types';
import { Flex, Text, VStack } from '@chakra-ui/react';
import { translateBackendStatus } from '@core/utils/backend-labels';
import { Building2 } from 'lucide-react';

import { StudentCard, StudentCardHeader } from './StudentCard';

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
		<StudentCard>
			<StudentCardHeader icon={<Building2 size={18} />} title='Dados institucionais' />
			<VStack align='stretch' gap={2}>
				{institutionData.map(([label, value]) => (
					<Flex key={label} justify='space-between' gap={3}>
						<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted' _dark={{ color: 'fg.muted' }}>
							{label}
						</Text>
						<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold' textAlign='right'>
							{value}
						</Text>
					</Flex>
				))}
			</VStack>
		</StudentCard>
	);
}
