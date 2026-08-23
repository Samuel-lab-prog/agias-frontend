import { Surface } from '@BaseComponents';
import {
	Avatar,
	Badge,
	Box,
	Grid,
	GridItem,
	Heading,
	HStack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FilePenLine, Mail, User } from 'lucide-react';

import type { HomeProps } from './types';

export function HomeSidebar({ authClient }: HomeProps) {
	const label =
		authClient?.role === 'student'
			? 'Estudante'
			: authClient?.role === 'professor'
				? 'Professor'
				: authClient?.role === 'staff'
					? 'Servidor'
					: authClient?.role === 'admin'
						? 'Administrador'
						: 'Usuário';

	return (
		<VStack align='stretch' gap={4}>
			<Surface variant='panel' p={0} overflow='hidden'>
				<Box p={4} bg='rgba(255,255,255,0.03)'>
					<HStack align='start' gap={4}>
						<Avatar.Root size='2xl' bg='purple.700' color='pink.50'>
							<Avatar.Fallback name='Usuário' />
						</Avatar.Root>

						<VStack align='start' gap={0.5}>
							<Heading as='h3' textStyle='h6'>
								Samuel Gomes Monni
							</Heading>
							<Text textStyle='smaller' color='pink.100'>
								2023326456
							</Text>
							<Text textStyle='smaller' color='pink.100'>
								{label}
							</Text>
							<Badge colorPalette='green' variant='subtle'>
								Ativo
							</Badge>
						</VStack>
					</HStack>
				</Box>

				<VStack align='stretch' gap={0} p={0}>
					<HStack
						as='button'
						type='button'
						px={4}
						py={3}
						justify='space-between'
						textAlign='left'
						cursor='pointer'
						transition='all 0.2s ease'
						_hover={{ bg: 'rgba(255,255,255,0.05)' }}
					>
						<HStack gap={2}>
							<Mail size={16} />
							<Text textStyle='smaller' fontWeight='semibold'>
								Mensagens
							</Text>
						</HStack>
						<Badge colorPalette='pink' variant='solid'>
							2
						</Badge>
					</HStack>
					<HStack
						as='button'
						type='button'
						px={4}
						py={3}
						align='center'
						gap={2}
						textAlign='left'
						cursor='pointer'
						transition='all 0.2s ease'
						_hover={{ bg: 'rgba(255,255,255,0.05)' }}
					>
						<FilePenLine size={16} />
						<Text textStyle='smaller' fontWeight='semibold'>
							Atualizar Foto e Perfil
						</Text>
					</HStack>
					<HStack
						as='button'
						type='button'
						px={4}
						py={3}
						align='center'
						gap={2}
						textAlign='left'
						cursor='pointer'
						transition='all 0.2s ease'
						_hover={{ bg: 'rgba(255,255,255,0.05)' }}
					>
						<User size={16} />
						<Text textStyle='smaller' fontWeight='semibold'>
							Meus Dados Pessoais
						</Text>
					</HStack>
				</VStack>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Heading as='h3' textStyle='h6' mb={3}>
					Dados institucionais
				</Heading>
				<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3}>
					<GridItem>
						<Box>
							<Text textStyle='smaller' color='pink.100'>
								Matrícula
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								2023326456
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text textStyle='smaller' color='pink.100'>
								Curso
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								Técnico Integrado
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text textStyle='smaller' color='pink.100'>
								Status
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								Ativo
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text textStyle='smaller' color='pink.100'>
								Frequência global
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								92%
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text textStyle='smaller' color='pink.100'>
								Ano de entrada
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								2023
							</Text>
						</Box>
					</GridItem>
					<GridItem colSpan={{ base: 1, md: 2 }}>
						<Box>
							<Text textStyle='smaller' color='pink.100'>
								E-mail institucional
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								2023326456@agias.edu.br
							</Text>
						</Box>
					</GridItem>
				</Grid>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Heading as='h3' textStyle='h6' mb={3}>
					Próximos eventos
				</Heading>
				<VStack align='stretch' gap={0}>
					{[
						{ date: '25/08/2026', title: 'Reunião da coordenação' },
						{ date: '27/08/2026', title: 'Prova de Redes de Computadores' },
						{ date: '28/08/2026', title: 'Prazo final para entrega de atividades' },
					].map((event, index, events) => (
						<Box
							key={`${event.date}-${event.title}`}
							py={2.5}
							px={2}
							borderBottom={index === events.length - 1 ? '0' : '1px solid'}
							borderColor='border'
							cursor='pointer'
							transition='all 0.2s ease'
							_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
						>
							<Text textStyle='smaller' color='pink.100'>
								{event.date}
							</Text>
							<Text textStyle='smaller' fontWeight='semibold'>
								{event.title}
							</Text>
						</Box>
					))}
				</VStack>
			</Surface>
		</VStack>
	);
}
