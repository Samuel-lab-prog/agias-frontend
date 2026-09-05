import { communications } from '@Api/communications/endpoints';
import { communicationsKeys } from '@Api/communications/keys';
import { BaseButton, SearchInput } from '@BaseComponents';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { translateBackendAudience } from '@core/utils/backend-labels';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bell, Pin } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { StudentCard, StudentCardHeader } from './StudentCard';

export function StudentAlertsCard({
	limit = 3,
	showAllAction = true,
	searchable = false,
	title,
}: {
	limit?: number | null;
	showAllAction?: boolean;
	searchable?: boolean;
	title?: string;
}) {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);
	const [search, setSearch] = useState('');
	const reducedMotion = useReducedMotion();
	const resultMotion = {
		initial: { opacity: 0, height: 0 },
		animate: { opacity: 1, height: 'auto' },
		exit: { opacity: 0, height: 0 },
		transition: { duration: reducedMotion || !searchable ? 0 : 0.2 },
		style: { overflow: 'hidden' as const },
	};

	const query = useQuery({
		queryKey: communicationsKeys.myAnnouncements(),
		enabled: !!clientId,
		staleTime: 60_000,
		queryFn: () => communications.getMyAnnouncements.query().queryFn(),
	});

	const announcements = query.data ?? [];
	const publicationDateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	const normalizeSearch = (value: string) =>
		value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
	const searchTerms = searchable ? normalizeSearch(search).trim().split(/\s+/).filter(Boolean) : [];
	const filteredAnnouncements = announcements.filter((announcement) => {
		const content = normalizeSearch(`${announcement.title} ${announcement.body}`);
		return searchTerms.every((term) => content.includes(term));
	});
	const visibleAnnouncements = filteredAnnouncements.slice(0, limit ?? Number.MAX_SAFE_INTEGER);

	return (
		<StudentCard>
			<StudentCardHeader
				icon={<Bell size={18} />}
				title={
					title ??
					(visibleAnnouncements.length > 0 ? 'Comunicados recentes' : 'Nenhum comunicado publicado')
				}
				action={
					showAllAction ? (
						<BaseButton asChild size='sm' variant='secondary' color='fg.muted'>
							<NavLink to='/student/announcements'>Ver todos os comunicados</NavLink>
						</BaseButton>
					) : undefined
				}
			/>

			{searchable ? (
				<Box mb={4}>
					<SearchInput
						label='Buscar comunicados'
						placeholder='Pesquise por título ou conteúdo'
						value={search}
						onValueChange={setSearch}
					/>
				</Box>
			) : null}

			<VStack align='stretch' gap={0}>
				<AnimatePresence initial={false}>
				{visibleAnnouncements.length === 0 ? (
					<motion.div key='empty' {...resultMotion}>
					<Box px={2} py={3}>
						<Text
							fontSize='0.8125rem'
							lineHeight='1.25rem'
							color='fg.muted'
							_dark={{ color: 'fg.muted' }}
						>
							{searchTerms.length > 0
								? 'Nenhum comunicado encontrado. Tente buscar por outras palavras.'
								: 'Os comunicados publicados pela staff aparecerão aqui.'}
						</Text>
					</Box>
					</motion.div>
				) : (
					visibleAnnouncements.map((announcement, index) => (
						<motion.div key={announcement.id} {...resultMotion}>
						<Flex
							pl={2}
							pr={2}
							py={3}
							align='center'
							justify='space-between'
							borderTop={index === 0 ? '0' : '1px solid'}
							borderColor='border.default'
							transition='all 0.2s ease'
							cursor='pointer'
							_hover={{
								bg: 'bg.muted',
								transform: 'translateX(2px)',
								'& .announcement-accent': { bg: 'border.interactive' },
							}}
							_dark={{ borderColor: 'border.default' }}
						>
							<HStack align='start' gap={3} flex='1' minW={0}>
								<Box
									className='announcement-accent'
									w='3px'
									minW='3px'
									alignSelf='stretch'
									borderRadius='full'
									bg={announcement.isPinned ? 'fg.muted' : 'border.interactive'}
									transition='background-color 0.2s ease'
									_dark={{
										bg: announcement.isPinned ? 'fg.muted' : 'border.interactive',
									}}
								/>

								<Box minW={0}>
									<HStack gap={2} wrap='wrap'>
										<Text fontSize='0.8125rem' lineHeight='1.25rem' fontWeight='bold'>
											{announcement.title}
										</Text>
										{announcement.isPinned ? (
											<Box
												color='action.primary'
												display='inline-flex'
												alignItems='center'
												gap={1}
												_dark={{ color: 'action.primary' }}
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
										color='fg.muted'
										_dark={{ color: 'fg.muted' }}
									>
										{announcement.body}
									</Text>
									<Text
										fontSize='0.8125rem'
										lineHeight='1.25rem'
										color='fg.muted'
										mt={1}
										_dark={{ color: 'fg.muted' }}
									>
										{announcement.publishedAt
											? `Publicado em ${publicationDateTimeFormatter.format(new Date(announcement.publishedAt))}`
											: 'Sem data de publicação'}
									</Text>
								</Box>
							</HStack>

							<Text
								fontSize='0.8125rem'
								lineHeight='1.25rem'
								color='fg.muted'
								flexShrink={0}
								_dark={{ color: 'fg.muted' }}
							>
								{translateBackendAudience(announcement.audience)}
							</Text>
						</Flex>
						</motion.div>
					))
				)}
				</AnimatePresence>
			</VStack>
		</StudentCard>
	);
}
