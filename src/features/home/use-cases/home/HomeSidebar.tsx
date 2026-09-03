import { BaseButton, Surface } from '@BaseComponents';
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
				<Box p={4} bg='bg.muted'>
					<HStack align='start' gap={4}>
						<Avatar.Root size='2xl' bg='purple.700' color='pink.50'>
							<Avatar.Fallback name='Usuário' />
						</Avatar.Root>

						<VStack align='start' gap={0.5}>
							<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
								Samuel Gomes Monni
							</Heading>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								2023326456
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								{label}
							</Text>
							<Badge variant='subtle'>Ativo</Badge>
						</VStack>
					</HStack>
				</Box>

				<VStack align='stretch' gap={0} p={0}>
					<BaseButton
						variant='subtle'
						px={4}
						py={3}
						justifyContent='space-between'
						textAlign='left'
						cursor='pointer'
						transition='all 0.2s ease'
						_hover={{ bg: 'bg.muted' }}
					>
						<HStack gap={2}>
							<Mail size={16} />
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								Mensagens
							</Text>
						</HStack>
						<Badge variant='solid'>2</Badge>
					</BaseButton>
					<BaseButton
						variant='subtle'
						px={4}
						py={3}
						alignItems='center'
						gap={2}
						textAlign='left'
						cursor='pointer'
						transition='all 0.2s ease'
						_hover={{ bg: 'bg.muted' }}
					>
						<FilePenLine size={16} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
							Atualizar Foto e Perfil
						</Text>
					</BaseButton>
					<BaseButton
						variant='subtle'
						px={4}
						py={3}
						alignItems='center'
						gap={2}
						textAlign='left'
						cursor='pointer'
						transition='all 0.2s ease'
						_hover={{ bg: 'bg.muted' }}
					>
						<User size={16} />
						<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
							Meus Dados Pessoais
						</Text>
					</BaseButton>
				</VStack>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700' mb={3}>
					Dados institucionais
				</Heading>
				<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3}>
					<GridItem>
						<Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								Matrícula
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								2023326456
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								Curso
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								Técnico Integrado
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								Status
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								Ativo
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								Frequência global
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								92%
							</Text>
						</Box>
					</GridItem>
					<GridItem>
						<Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								Ano de entrada
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								2023
							</Text>
						</Box>
					</GridItem>
					<GridItem colSpan={{ base: 1, md: 2 }}>
						<Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								E-mail institucional
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								2023326456@agias.edu.br
							</Text>
						</Box>
					</GridItem>
				</Grid>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700' mb={3}>
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
							borderColor='border.default'
							cursor='pointer'
							transition='all 0.2s ease'
							_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
						>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
								{event.date}
							</Text>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
								{event.title}
							</Text>
						</Box>
					))}
				</VStack>
			</Surface>
		</VStack>
	);
}
