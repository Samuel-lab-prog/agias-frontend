import type { StudentProfile } from '@Api/academic/types';
import { BaseButton, Surface } from '@BaseComponents';
import { Badge, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useColorModeValue } from '@core/components/ui/color-mode';
import { translateBackendStatus } from '@core/utils/backend-labels';
import { FileText, GraduationCap, LogOut, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type StudentProfileCardProps = {
	profile?: StudentProfile;
	userName?: string;
};

export function StudentProfileCard({ profile, userName }: StudentProfileCardProps) {
	const headerTextColor = useColorModeValue('fg.default', 'fg.default');
	const headerSubtextColor = useColorModeValue('fg.muted', 'fg.muted');

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
			<Box
				p={4}
				bg={'bg.surface'}
				borderBottom='1px solid'
				borderColor={'border.default'}
				_dark={{
					bg: 'bg.surface',
					borderColor: 'border.default',
				}}
			>
				<HStack align='start' gap={4}>
					<Box
						boxSize={16}
						borderRadius={'full'}
						bg='action.primaryStrong'
						display='grid'
						placeItems='center'
						color='fg.inverted'
						fontWeight='bold'
						border='1px solid'
						borderColor={'border.default'}
						_dark={{ borderColor: 'border.default' }}
					>
						{initials ?? '?'}
					</Box>

					<VStack align='start' gap={0.5} color={headerTextColor}>
						<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
							{userName ?? 'Nome não informado'}
						</Heading>
						<Text fontSize='0.8125rem' lineHeight='1.25rem' color={headerSubtextColor}>
							{academicId ?? 'Matrícula não informada'}
						</Text>
						<Text fontSize='0.8125rem' lineHeight='1.25rem' color={headerSubtextColor}>
							{courseId ? `Curso ${courseId}` : 'Curso não vinculado'}
						</Text>
						<Badge variant='subtle'>{status}</Badge>
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
					_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
				>
					<HStack gap={2}>
						<MessageSquare size={16} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
							Mensagens
						</Text>
					</HStack>
					<Text
						fontSize='0.8125rem'
						lineHeight='1.25rem'
						color={'fg.muted'}
						_dark={{ color: 'fg.muted' }}
					>
						Dado não disponível
					</Text>
				</HStack>
				<HStack
					px={4}
					py={3}
					gap={2}
					cursor='pointer'
					transition='all 0.2s ease'
					_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
				>
					<FileText size={16} />
					<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
						Atualizar Foto e Perfil
					</Text>
				</HStack>
				<HStack
					px={4}
					py={3}
					gap={2}
					cursor='pointer'
					transition='all 0.2s ease'
					_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
				>
					<GraduationCap size={16} />
					<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
						Meus Dados Pessoais
					</Text>
				</HStack>
				<Box px={4} py={3}>
					<BaseButton asChild w='full' variant='secondary' size='sm'>
						<NavLink to='/login'>
							<HStack gap={2}>
								<LogOut size={16} />
								<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
									Sair
								</Text>
							</HStack>
						</NavLink>
					</BaseButton>
				</Box>
			</VStack>
		</Surface>
	);
}
