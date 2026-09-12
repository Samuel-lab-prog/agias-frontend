import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { SearchInput } from '@core/components/forms/search-input/SearchInput';
import { BookOpen, ExternalLink } from 'lucide-react';

import {
	ActionLink,
	IconTile,
	PageHeader,
	Pagination,
	QueryState,
	StatusPill,
} from '../../components/TeachingUI';
import { usePagedSearch, useTeachingQuery } from '../../hooks';
import { safeMaterialUrl } from '../../utils';

export function MaterialsPage() {
	const { search, setSearch, filters, applySearch, setPage } = usePagedSearch();
	const query = useTeachingQuery(['materials', filters], () => teaching.materials(filters));
	return (
		<VStack align='stretch' gap={5}>
			<PageHeader
				title='Materiais publicados'
				description='Referências e links das suas aulas, com o contexto de cada turma.'
			/>
			<Surface variant='panel' py={4}>
				<Box maxW='480px'>
					<SearchInput
						label='Buscar materiais'
						placeholder='Digite o título do material'
						value={search}
						onValueChange={setSearch}
						onDebouncedChange={applySearch}
					/>
				</Box>
			</Surface>
			<QueryState
				query={query}
				empty={
					query.data?.items.length === 0 && {
						title: filters.q ? 'Nenhum material encontrado' : 'Sua biblioteca começa aqui',
						description: filters.q
							? 'Tente outro título ou limpe a busca.'
							: 'Os materiais vinculados às suas aulas aparecerão nesta página.',
						action: filters.q ? (
							<BaseButton
								variant='secondary'
								onClick={() => {
									setSearch('');
									applySearch('');
								}}
							>
								Limpar busca
							</BaseButton>
						) : undefined,
					}
				}
			>
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					{query.data?.items.map((material) => {
						const url = safeMaterialUrl(material.url);
						return (
							<Surface key={material.id} variant='panel'>
								<VStack align='stretch' gap={3} h='full'>
									<HStack justify='space-between' gap={3}>
										<IconTile icon={BookOpen} />
										<StatusPill>Material de aula</StatusPill>
									</HStack>
									<Box flex='1'>
										<Text color='action.primary' fontSize='xs' fontWeight='semibold' mb={2}>
											{material.classSession.classOffering.title}
										</Text>
										<Heading as='h2' fontSize='lg' overflowWrap='anywhere'>
											{material.title}
										</Heading>
										<Text fontSize='sm' color='fg.muted' mt={2}>
											Aula: {material.classSession.topic || 'Tema não informado'}
										</Text>
										<Text fontSize='xs' color='fg.muted' mt={3} overflowWrap='anywhere'>
											{url?.hostname ?? 'Link indisponível'}
										</Text>
									</Box>
									<HStack
										justify='space-between'
										flexWrap='wrap'
										gap={2}
										pt={3}
										borderTopWidth='1px'
										borderColor='border.muted'
									>
										<ActionLink
											to={`/professor/classes/${material.classSession.classOfferingId}?tab=lessons`}
										>
											Ver aulas
										</ActionLink>
										{url && (
											<BaseButton variant='secondary' size='sm' asChild>
												<a
													href={url.href}
													target='_blank'
													rel='noreferrer'
													aria-label={`Abrir ${material.title} em nova aba`}
												>
													Abrir material
													<ExternalLink size={14} aria-hidden='true' />
												</a>
											</BaseButton>
										)}
									</HStack>
								</VStack>
							</Surface>
						);
					})}
				</SimpleGrid>
				{query.data && <Pagination {...query.data} onChange={setPage} />}
			</QueryState>
		</VStack>
	);
}
