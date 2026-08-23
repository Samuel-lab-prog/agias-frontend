import type { StudentProfile } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { FileText, GraduationCap, MessageSquare } from 'lucide-react';

type StudentProfileCardProps = {
	profile?: StudentProfile;
};

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
	const academicId = profile?.academicId ?? '...';
	const courseId = profile?.courseId !== null && profile?.courseId !== undefined ? String(profile.courseId) : 'Não vinculado';
	const admissionYear = profile?.admissionYear !== null && profile?.admissionYear !== undefined ? String(profile.admissionYear) : '...';
	const status = profile?.status ?? '...';

	return (
		<Surface variant='panel' p={0} overflow='hidden'>
			<Box p={4} bg='linear-gradient(180deg, rgba(18, 84, 186, 0.96), rgba(11, 66, 160, 0.96))'>
				<HStack align='start' gap={4}>
					<Box boxSize={16} borderRadius='full' bg='rgba(0,0,0,0.5)' display='grid' placeItems='center' color='white' fontWeight='bold'>
						S
					</Box>

					<VStack align='start' gap={0.5} color='white'>
						<Heading as='h3' textStyle='h6'>
							{profile ? `Aluno ${profile.academicId}` : 'Carregando perfil...'}
						</Heading>
						<Text textStyle='smaller'>{academicId}</Text>
						<Text textStyle='smaller'>Curso {courseId}</Text>
						<Badge colorPalette='green' variant='subtle'>
							{status}
						</Badge>
					</VStack>
				</HStack>
			</Box>

			<VStack align='stretch' gap={0} p={0}>
				<HStack px={4} py={3} justify='space-between' cursor='pointer' _hover={{ bg: 'rgba(255,255,255,0.05)' }}>
					<HStack gap={2}>
						<MessageSquare size={16} />
						<Text textStyle='smaller' fontWeight='semibold'>
							Mensagens
						</Text>
					</HStack>
					<Badge colorPalette='blue' variant='solid' borderRadius='full'>
						2
					</Badge>
				</HStack>
				<HStack px={4} py={3} gap={2} cursor='pointer' _hover={{ bg: 'rgba(255,255,255,0.05)' }}>
					<FileText size={16} />
					<Text textStyle='smaller' fontWeight='semibold'>
						Atualizar Foto e Perfil
					</Text>
				</HStack>
				<HStack px={4} py={3} gap={2} cursor='pointer' _hover={{ bg: 'rgba(255,255,255,0.05)' }}>
					<GraduationCap size={16} />
					<Text textStyle='smaller' fontWeight='semibold'>
						Meus Dados Pessoais
					</Text>
				</HStack>
				<Box px={4} pb={4} pt={2}>
					<Text textStyle='xs' color='pink.100'>
						Matrícula: {academicId}
					</Text>
					<Text textStyle='xs' color='pink.100'>
						Ingresso: {admissionYear}
					</Text>
				</Box>
			</VStack>
		</Surface>
	);
}
