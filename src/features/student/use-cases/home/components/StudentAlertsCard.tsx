import { communications } from '@Api/communications/endpoints';
import { communicationsKeys } from '@Api/communications/keys';
import { BaseButton, componentColors, componentRadii, Surface } from '@BaseComponents';
import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
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
					<Heading as='h3' fontSize='1rem' lineHeight='1.3' fontWeight='700'>
						{visibleAnnouncements.length > 0
							? 'Comunicados recentes'
							: 'Nenhum comunicado publicado'}
					</Heading>
				</HStack>

				<BaseButton
					size='sm'
					variant='outlinePurple'
					color={componentColors.light.textMuted}
					_dark={{ color: componentColors.dark.textMuted }}
				>
					Ver todas as notícias
				</BaseButton>
			</Flex>

			<VStack align='stretch' gap={0}>
				{visibleAnnouncements.length === 0 ? (
					<Box px={2} py={3}>
						<Text
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							color={componentColors.light.textMuted}
							_dark={{ color: componentColors.dark.textMuted }}
						>
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
							borderColor={componentColors.light.border}
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{
								bg: 'rgba(255,255,255,0.03)',
								transform: 'translateX(2px)',
								'& .announcement-accent': { bg: 'rgba(148, 163, 184, 0.9)' },
							}}
							_dark={{ borderColor: componentColors.dark.border }}
						>
							<HStack align='start' gap={3} flex='1' minW={0}>
								<Box
									className='announcement-accent'
									w='3px'
									minW='3px'
									alignSelf='stretch'
									borderRadius={componentRadii.full}
									bg={
										announcement.isPinned
											? 'rgba(100, 116, 139, 0.9)'
											: componentColors.light.borderHover
									}
									transition='background-color 0.2s ease'
									_dark={{
										bg: announcement.isPinned
											? 'rgba(148, 163, 184, 0.75)'
											: componentColors.dark.borderHover,
									}}
								/>

								<Box minW={0}>
									<HStack gap={2} wrap='wrap'>
										<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='bold'>
											{announcement.title}
										</Text>
										{announcement.isPinned ? (
											<Box
												color={componentColors.light.accent}
												display='inline-flex'
												alignItems='center'
												gap={1}
												_dark={{ color: componentColors.dark.accent }}
											>
												<Pin size={12} />
												<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='semibold'>
													Fixado
												</Text>
											</Box>
										) : null}
									</HStack>
									<Text
										fontSize='0.8125rem'
										lineHeight='1.25rem'
										color={componentColors.light.textMuted}
										_dark={{ color: componentColors.dark.textMuted }}
									>
										{announcement.body}
									</Text>
									<Text
										fontSize='0.8125rem'
										lineHeight='1.25rem'
										color={componentColors.light.textMuted}
										mt={1}
										_dark={{ color: componentColors.dark.textMuted }}
									>
										{announcement.publishedAt
											? `Publicado em ${new Intl.DateTimeFormat('pt-BR', {
													day: '2-digit',
													month: '2-digit',
												}).format(new Date(announcement.publishedAt))}`
											: 'Sem data de publicação'}
									</Text>
								</Box>
							</HStack>

							<Text
								fontSize='0.8125rem'
								lineHeight='1.25rem'
								color={componentColors.light.textMuted}
								flexShrink={0}
								_dark={{ color: componentColors.dark.textMuted }}
							>
								{translateBackendAudience(announcement.audience)}
							</Text>
						</Flex>
					))
				)}
			</VStack>

			{remainingAnnouncements > 0 ? (
				<Text
					fontSize='0.8125rem'
					lineHeight='1.25rem'
					color={componentColors.light.textMuted}
					mt={3}
					_dark={{ color: componentColors.dark.textMuted }}
				>
					Mais {remainingAnnouncements} comunicado{remainingAnnouncements > 1 ? 's' : ''}.
				</Text>
			) : null}
		</Surface>
	);
}
