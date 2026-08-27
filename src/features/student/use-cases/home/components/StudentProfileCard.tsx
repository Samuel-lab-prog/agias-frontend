import type { StudentProfile } from '@Api/academic/types';
import { Surface } from '@BaseComponents';
import { Badge, Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useColorModeValue } from '@core/components/ui/color-mode';
import { translateBackendStatus } from '@core/utils/backend-labels';
import { FileText, GraduationCap, LogOut, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type StudentProfileCardProps = {
	profile?: StudentProfile;
	userName?: string;
};

export function StudentProfileCard({ profile, userName }: StudentProfileCardProps) {
	const headerTextColor = useColorModeValue('text', 'white');
	const headerSubtextColor = useColorModeValue('textMuted', 'textMuted');
	const logoutHoverBg = useColorModeValue('accentSoft', 'rgba(255,255,255,0.05)');
	const logoutHoverColor = useColorModeValue('accentStrong', 'text');

	const initials = userName
		?.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');
	const academicId = profile?.academicId;
	const courseId =
		profile?.courseId !== null && profile?.courseId !== undefined ? String(profile.courseId) : null;
	const status = translateBackendStatus(profile?.status);

	return (
		<Surface id='student-profile' variant='panel' p={0} overflow='hidden'>
			<Box p={4} bg='surface' borderBottom='1px solid' borderColor='border'>
				<HStack align='start' gap={4}>
					<Box
						boxSize={16}
						borderRadius='full'
						bg='gray.900'
						display='grid'
						placeItems='center'
						color='white'
						fontWeight='bold'
						border='1px solid'
						borderColor='border'
					>
						{initials ?? '?'}
					</Box>

					<VStack align='start' gap={0.5} color={headerTextColor}>
						<Heading as='h3' textStyle='h6'>
							{userName ?? 'Nome não informado'}
						</Heading>
						<Text textStyle='smaller' color={headerSubtextColor}>
							{academicId ?? 'Matrícula não informada'}
						</Text>
						<Text textStyle='smaller' color={headerSubtextColor}>
							{courseId ? `Curso ${courseId}` : 'Curso não vinculado'}
						</Text>
						<Badge colorPalette='gray' variant='subtle'>
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
					<Text textStyle='smaller' color='textMuted'>
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
						color='textMuted'
						borderColor='border'
						bg='transparent'
						_hover={{ bg: logoutHoverBg, borderColor: 'borderHover', color: logoutHoverColor }}
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
