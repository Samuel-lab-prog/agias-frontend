import { Surface } from '@BaseComponents';
import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { Bell, BookOpen, FileText } from 'lucide-react';

const notices = [
	'Não há notícias cadastradas.',
	'Fique atento aos avisos e comunicados da sua instituição.',
];

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
	return (
		<VStack align='stretch' gap={4}>
			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex align='start' gap={3}>
					<Box
						boxSize={10}
						borderRadius='xl'
						display='grid'
						placeItems='center'
						bg='rgba(255,255,255,0.05)'
					>
						<Bell size={20} />
					</Box>
					<Box flex='1'>
						<Heading as='h3' textStyle='h6'>
							{notices[0]}
						</Heading>
						<Text textStyle='smaller' color='pink.100' mt={1.5}>
							{notices[1]}
						</Text>
					</Box>
					<Button size='sm' variant='outline' color='pink.100' borderColor='border'>
						Ver todas as notícias
					</Button>
				</Flex>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex justify='space-between' align='center' mb={3}>
					<HStack gap={2}>
						<Bell size={18} />
						<Heading as='h3' textStyle='h6'>
							Atualizações
						</Heading>
					</HStack>
					<Button size='sm' variant='ghost' color='pink.100'>
						Ver todas as atualizações
					</Button>
				</Flex>

				<VStack align='stretch' gap={0}>
					{updates.map((update, index) => (
						<Flex
							key={`${update.title}-${update.time}`}
							align='center'
							justify='space-between'
							py={2.5}
							borderBottom={index === updates.length - 1 ? '0' : '1px solid'}
							borderColor='border'
							px={2}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
						>
							<Box>
								<Text textStyle='smaller' color='pink.100'>
									{update.title}
								</Text>
								<Text textStyle='smaller' fontWeight='semibold'>
									{update.description}
								</Text>
							</Box>
							<Text textStyle='smaller' color='orange.300'>
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
						<Heading as='h3' textStyle='h6'>
							Componentes de hoje
						</Heading>
					</HStack>
					<Button size='sm' variant='ghost' color='pink.100'>
						Ver toda a agenda
					</Button>
				</Flex>

				<VStack align='stretch' gap={0}>
					{todayClasses.map((component, index) => (
						<Flex
							key={component.name}
							align='center'
							justify='space-between'
							py={1.5}
							borderBottom={index === todayClasses.length - 1 ? '0' : '1px solid'}
							borderColor='border'
							px={2}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
						>
							<Box>
								<Text textStyle='smaller' fontWeight='semibold'>
									{component.name}
								</Text>
							</Box>
							<Badge colorPalette='purple' variant='subtle'>
								{component.time}
							</Badge>
						</Flex>
					))}
				</VStack>
			</Surface>

			<Surface variant='panel' p={{ base: 3.5, md: 4 }}>
				<Flex justify='space-between' align='center' mb={3}>
					<HStack gap={2}>
						<FileText size={18} />
						<Heading as='h3' textStyle='h6'>
							Minhas atividades
						</Heading>
					</HStack>
					<Button size='sm' variant='ghost' color='pink.100'>
						Ver todas as atividades
					</Button>
				</Flex>

				<VStack align='stretch' gap={0}>
					{activities.map((activity, index) => (
						<Flex
							key={`${activity.date}-${activity.title}`}
							align='center'
							justify='space-between'
							py={2}
							borderBottom={index === activities.length - 1 ? '0' : '1px solid'}
							borderColor='border'
							px={2}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{ bg: 'rgba(255,255,255,0.05)', transform: 'translateX(2px)' }}
						>
							<Box>
								<HStack gap={1} wrap='wrap' align='baseline'>
									<Text textStyle='smaller' color='pink.100'>
										{activity.subject} :
									</Text>
									<Text textStyle='smaller' fontWeight='semibold'>
										{activity.title}
									</Text>
								</HStack>
								<Badge
									mt={1}
									colorPalette={
										activity.status === 'Pendente'
											? 'orange'
											: activity.status === 'Entregue'
												? 'blue'
												: 'green'
									}
									variant='subtle'
								>
									{activity.status}
								</Badge>
							</Box>
							<VStack align='end' gap={0}>
								<Text textStyle='smaller' color='pink.100'>
									{activity.date}
								</Text>
								<Text textStyle='smaller' color='orange.300'>
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
