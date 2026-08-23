import type { StudentProfile } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Flex, Heading, Text, VStack } from '@chakra-ui/react';

type StudentInstitutionCardProps = {
	profile?: StudentProfile;
};

export function StudentInstitutionCard({ profile }: StudentInstitutionCardProps) {
	const institutionData = [
		['Matrícula', profile?.academicId ?? '...'],
		['Curso', profile?.courseId ? String(profile.courseId) : 'Não vinculado'],
		['Nível', 'TÉCNICO INTEGRADO'],
		['Status', profile?.status ?? '...'],
		['Entrada', profile?.admissionYear ? String(profile.admissionYear) : '...'],
	];

	return (
		<Surface variant='panel' p={{ base: 4, md: 5 }}>
			<Heading as='h3' textStyle='h6' mb={4}>
				Dados institucionais
			</Heading>
			<VStack align='stretch' gap={2}>
				{institutionData.map(([label, value]) => (
					<Flex key={label} justify='space-between' gap={3}>
						<Text textStyle='smaller' color='pink.100'>
							{label}
						</Text>
						<Text textStyle='smaller' fontWeight='semibold' textAlign='right'>
							{value}
						</Text>
					</Flex>
				))}
			</VStack>
		</Surface>
	);
}
