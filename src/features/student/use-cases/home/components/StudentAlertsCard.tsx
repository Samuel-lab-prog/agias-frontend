import { communications } from '@Api/communications/endpoints';
import { communicationsKeys } from '@Api/communications/keys';
import { Surface } from '@BaseComponents';
import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { translateBackendAudience } from '@core/utils/backend-labels';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';
import { Bell, Pin } from 'lucide-react';

export function StudentAlertsCard() {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);

	const query = useQuery({
		queryKey: communicationsKeys.myAnnouncements(),
		enabled: !!clientId,
		staleTime: 60_000,
		queryFn: () => communications.getMyAnnouncements.query().queryFn(),
	});

	const announcements = query.data ?? [];
	const visibleAnnouncements = announcements.slice(0, 3);
	const remainingAnnouncements = Math.max(0, announcements.length - visibleAnnouncements.length);

	return (
		<Surface variant='soft' p={{ base: 4, md: 5 }}>
			<Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
				<HStack gap={2}>
					<Bell size={18} />
					<Heading as='h3' textStyle='h6'>
						{visibleAnnouncements.length > 0
							? 'Comunicados recentes'
							: 'Nenhum comunicado publicado'}
					</Heading>
				</HStack>

				<Button
					size='sm'
					variant='outline'
					color='textMuted'
					borderColor='border'
					bg='transparent'
					_hover={{ bg: 'surface', borderColor: 'borderHover', color: 'text' }}
				>
					Ver todas as notícias
				</Button>
			</Flex>

			<VStack align='stretch' gap={0}>
				{visibleAnnouncements.length === 0 ? (
					<Box px={2} py={3}>
						<Text textStyle='smaller' color='textMuted'>
							Os comunicados publicados pela staff aparecerão aqui.
						</Text>
					</Box>
				) : (
					visibleAnnouncements.map((announcement, index) => (
						<Flex
							key={announcement.id}
							pl={2}
							pr={2}
							py={3}
							align='center'
							justify='space-between'
							borderTop={index === 0 ? '0' : '1px solid'}
							borderColor='border'
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{
								bg: 'rgba(255,255,255,0.03)',
								transform: 'translateX(2px)',
								'& .announcement-accent': { bg: 'gray.400' },
							}}
						>
							<HStack align='start' gap={3} flex='1' minW={0}>
								<Box
									className='announcement-accent'
									w='3px'
									minW='3px'
									alignSelf='stretch'
									borderRadius='full'
									bg={announcement.isPinned ? 'gray.500' : 'borderHover'}
									transition='background-color 0.2s ease'
								/>

								<Box minW={0}>
									<HStack gap={2} wrap='wrap'>
										<Text textStyle='smaller' fontWeight='bold'>
											{announcement.title}
										</Text>
										{announcement.isPinned ? (
											<Box color='accent' display='inline-flex' alignItems='center' gap={1}>
												<Pin size={12} />
												<Text textStyle='smaller' fontWeight='semibold'>
													Fixado
												</Text>
											</Box>
										) : null}
									</HStack>
									<Text textStyle='smaller' color='textMuted'>
										{announcement.body}
									</Text>
									<Text textStyle='smaller' color='textMuted' mt={1}>
										{announcement.publishedAt
											? `Publicado em ${new Intl.DateTimeFormat('pt-BR', {
													day: '2-digit',
													month: '2-digit',
												}).format(new Date(announcement.publishedAt))}`
											: 'Sem data de publicação'}
									</Text>
								</Box>
							</HStack>

							<Text textStyle='smaller' color='textMuted' flexShrink={0}>
								{translateBackendAudience(announcement.audience)}
							</Text>
						</Flex>
					))
				)}
			</VStack>

			{remainingAnnouncements > 0 ? (
				<Text textStyle='smaller' color='textMuted' mt={3}>
					Mais {remainingAnnouncements} comunicado{remainingAnnouncements > 1 ? 's' : ''}.
				</Text>
			) : null}
		</Surface>
	);
}
