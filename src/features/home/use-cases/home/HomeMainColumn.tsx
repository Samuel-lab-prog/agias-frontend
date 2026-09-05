import { communications } from '@Api/communications/endpoints';
import { communicationsKeys } from '@Api/communications/keys';
import { BaseButton, Surface } from '@BaseComponents';
import { Badge, Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';
import { Bell, BookOpen, FileText } from 'lucide-react';

const updates = [
	{
		title: 'Tarefa avaliada',
		description: 'O professor de Design para Web avaliou a atividade de layout responsivo.',
		time: 'Hoje, 14:32',
	},
	{
		title: 'Data alterada',
		description: 'A prova de Redes de Computadores foi remarcada para 28/08/2026.',
		time: 'Hoje, 11:10',
	},
	{
		title: 'Nova orientação',
		description: 'Sociologia IV recebeu um novo material complementar na turma.',
		time: 'Ontem, 18:45',
	},
];

const todayClasses = [
	{ name: 'LÍNGUA PORTUGUESA E LITERATURA IV', time: '07:30 - 08:20' },
	{ name: 'ARTE EDUCAÇÃO', time: '08:20 - 09:10' },
	{ name: 'DESIGN PARA WEB', time: '09:30 - 10:20' },
	{ name: 'EMPREENDEDORISMO EM INFORMÁTICA', time: '10:20 - 11:10' },
	{ name: 'FILOSOFIA IV', time: '11:10 - 12:00' },
];

const activities = [
	{
		date: '17/08/2026',
		subject: 'LÍNGUA ESTRANGEIRA - ESPANHOL II',
		title: 'Atividade de leitura',
		due: 'Em 2 dias',
		status: 'Pendente',
	},
	{
		date: '18/08/2026',
		subject: 'DESIGN PARA WEB',
		title: 'Entrega do layout responsivo',
		due: 'Em 3 dias',
		status: 'Entregue',
	},
	{
		date: '21/08/2026',
		subject: 'REDES DE COMPUTADORES',
		title: 'Questionário da unidade 3',
		due: 'Em 6 dias',
		status: 'Avaliada',
	},
	{
		date: '24/08/2026',
		subject: 'SOCIOLOGIA IV',
		title: 'Resumo crítico',
		due: 'Em 9 dias',
		status: 'Pendente',
	},
	{
		date: '26/08/2026',
		subject: 'INGLÊS IV',
		title: 'Writing assignment',
		due: 'Em 11 dias',
		status: 'Entregue',
	},
];

export function HomeMainColumn() {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);
	const query = useQuery({
		queryKey: communicationsKeys.myAnnouncements(),
		enabled: !!clientId,
		staleTime: 60_000,
		queryFn: () => communications.getMyAnnouncements.query().queryFn(),
	});

	const visibleAnnouncements = (query.data ?? []).slice(0, 3);

	return (
		<VStack align='stretch' gap={4}>
			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex align='start' gap={3}>
					<Box boxSize={10} borderRadius='xl' display='grid' placeItems='center' bg='bg.surface'>
						<Bell size={20} />
					</Box>
					<Box flex='1'>
						<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
							{visibleAnnouncements.length > 0
								? 'Comunicados recentes'
								: 'Nenhum comunicado publicado'}
						</Heading>
						<VStack align='stretch' gap={1} mt={1.5}>
							{visibleAnnouncements.map((announcement) => (
								<Box key={announcement.id}>
									<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
										{announcement.title}
									</Text>
									<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
										{announcement.body}
									</Text>
								</Box>
							))}
							{visibleAnnouncements.length === 0 ? (
								<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
									Os comunicados publicados pela staff aparecerão aqui.
								</Text>
							) : null}
						</VStack>
					</Box>
					<BaseButton size='sm' variant='secondary' color='fg.muted'>
						Ver todos os comunicados
					</BaseButton>
				</Flex>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex justify='space-between' align='center' mb={3}>
					<HStack gap={2}>
						<Bell size={18} />
						<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
							Atualizações
						</Heading>
					</HStack>
					<BaseButton size='sm' variant='subtle' color='fg.muted'>
						Ver todas as atualizações
					</BaseButton>
				</Flex>

				<VStack align='stretch' gap={0}>
					{updates.map((update, index) => (
						<Flex
							key={`${update.title}-${update.time}`}
							align='center'
							justify='space-between'
							py={2.5}
							borderBottom={index === updates.length - 1 ? '0' : '1px solid'}
							borderColor='border.default'
							px={2}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
						>
							<Box>
								<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
									{update.title}
								</Text>
								<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
									{update.description}
								</Text>
							</Box>
							<Text fontSize='0.8125rem' lineHeight='1.25rem' color='status.warning'>
								{update.time}
							</Text>
						</Flex>
					))}
				</VStack>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex justify='space-between' align='center' mb={3}>
					<HStack gap={2}>
						<BookOpen size={18} />
						<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
							Componentes de hoje
						</Heading>
					</HStack>
					<BaseButton size='sm' variant='subtle' color='fg.muted'>
						Ver toda a agenda
					</BaseButton>
				</Flex>

				<VStack align='stretch' gap={0}>
					{todayClasses.map((component, index) => (
						<Flex
							key={component.name}
							align='center'
							justify='space-between'
							py={1.5}
							borderBottom={index === todayClasses.length - 1 ? '0' : '1px solid'}
							borderColor='border.default'
							px={2}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
						>
							<Box>
								<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
									{component.name}
								</Text>
							</Box>
							<Badge variant='subtle'>{component.time}</Badge>
						</Flex>
					))}
				</VStack>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex justify='space-between' align='center' mb={3}>
					<HStack gap={2}>
						<FileText size={18} />
						<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
							Minhas atividades
						</Heading>
					</HStack>
					<BaseButton size='sm' variant='subtle' color='fg.muted'>
						Ver todas as atividades
					</BaseButton>
				</Flex>

				<VStack align='stretch' gap={0}>
					{activities.map((activity, index) => (
						<Flex
							key={`${activity.date}-${activity.title}`}
							align='center'
							justify='space-between'
							py={2}
							borderBottom={index === activities.length - 1 ? '0' : '1px solid'}
							borderColor='border.default'
							px={2}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'bg.muted', transform: 'translateX(2px)' }}
						>
							<Box>
								<HStack gap={1} wrap='wrap' align='baseline'>
									<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
										{activity.subject} :
									</Text>
									<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
										{activity.title}
									</Text>
								</HStack>
								<Badge mt={1} variant='subtle'>
									{activity.status}
								</Badge>
							</Box>
							<VStack align='end' gap={0}>
								<Text fontSize='0.8125rem' lineHeight='1.25rem' color='fg.muted'>
									{activity.date}
								</Text>
								<Text fontSize='0.8125rem' lineHeight='1.25rem' color='status.warning'>
									{activity.due}
								</Text>
							</VStack>
						</Flex>
					))}
				</VStack>
			</Surface>
		</VStack>
	);
}
