import type { StudentProfile } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Badge, Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { translateBackendStatus } from '@core/utils/backend-labels';
import { FileText, GraduationCap, LogOut, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type StudentProfileCardProps = {
	profile?: StudentProfile;
	userName?: string;
};

export function StudentProfileCard({ profile, userName }: StudentProfileCardProps) {
	const initials = userName
		?.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');
	const academicId = profile?.academicId;
	const courseId = profile?.courseId !== null && profile?.courseId !== undefined ? String(profile.courseId) : null;
	const status = translateBackendStatus(profile?.status);

	return (
		<Surface id='student-profile' variant='panel' p={0} overflow='hidden'>
			<Box
				p={4}
				bg='linear-gradient(180deg, rgba(81, 53, 79, 0.98), rgba(58, 33, 56, 0.98))'
				borderBottom='1px solid'
				borderColor='border'
			>
				<HStack align='start' gap={4}>
					<Box
						boxSize={16}
						borderRadius='full'
						bg='rgba(18, 0, 17, 0.7)'
						display='grid'
						placeItems='center'
						color='white'
						fontWeight='bold'
						border='1px solid'
						borderColor='rgba(255,255,255,0.08)'
					>
						{initials ?? '?'}
					</Box>

					<VStack align='start' gap={0.5} color='white'>
						<Heading as='h3' textStyle='h6'>
							{userName ?? 'Nome não informado'}
						</Heading>
						<Text textStyle='smaller'>{academicId ?? 'Matrícula não informada'}</Text>
						<Text textStyle='smaller'>{courseId ? `Curso ${courseId}` : 'Curso não vinculado'}</Text>
						<Badge colorPalette='pink' variant='subtle'>
							{status}
						</Badge>
					</VStack>
				</HStack>
			</Box>

			<VStack align='stretch' gap={0} p={0}>
				<HStack
					px={4}
					py={3}
					justify='space-between'
					cursor='pointer'
					transition='all 0.2s ease'
					_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
				>
					<HStack gap={2}>
						<MessageSquare size={16} />
						<Text textStyle='smaller' fontWeight='semibold'>
							Mensagens
						</Text>
					</HStack>
					<Text textStyle='smaller' color='pink.100'>
						Dado não disponível
					</Text>
				</HStack>
				<HStack
					px={4}
					py={3}
					gap={2}
					cursor='pointer'
					transition='all 0.2s ease'
					_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
				>
					<FileText size={16} />
					<Text textStyle='smaller' fontWeight='semibold'>
						Atualizar Foto e Perfil
					</Text>
				</HStack>
				<HStack
					px={4}
					py={3}
					gap={2}
					cursor='pointer'
					transition='all 0.2s ease'
					_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
				>
					<GraduationCap size={16} />
					<Text textStyle='smaller' fontWeight='semibold'>
						Meus Dados Pessoais
					</Text>
				</HStack>
				<Box px={4} py={3}>
					<Button
						asChild
						w='full'
						variant='outline'
						size='sm'
						color='pink.100'
						borderColor='border'
						bg='transparent'
						_hover={{ bg: 'rgba(255,255,255,0.05)', borderColor: 'borderHover', color: 'pink.50' }}
					>
						<NavLink to='/login'>
							<HStack gap={2}>
								<LogOut size={16} />
								<Text textStyle='smaller' fontWeight='semibold'>
									Sair
								</Text>
							</HStack>
						</NavLink>
					</Button>
				</Box>

			</VStack>
		</Surface>
	);
}
