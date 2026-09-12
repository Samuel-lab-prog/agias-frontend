import { teaching } from '@Api/teaching/endpoints';
import { BaseButton, Surface } from '@BaseComponents';
import { Box, VStack } from '@chakra-ui/react';
import { SearchInput } from '@core/components/forms/search-input/SearchInput';

import { ActivityCard } from '../../components/ActivityCard';
import { ActionLink, PageHeader, Pagination, QueryState } from '../../components/TeachingUI';
import { usePagedSearch, useTeachingQuery } from '../../hooks';

export function ActivitiesPage() {
	const { search, setSearch, filters, applySearch, setPage } = usePagedSearch();
	const query = useTeachingQuery(['activities', filters], () => teaching.activities(filters));
	return (
		<VStack align='stretch' gap={5}>
			<PageHeader
				title='Atividades e avaliações'
				description='Acompanhe propostas, datas e entregas de todas as suas turmas.'
				action={<ActionLink to='/professor/classes'>Criar em uma turma</ActionLink>}
			/>
			<Surface variant='panel' py={4}>
				<Box maxW='480px'>
					<SearchInput
						label='Buscar atividades'
						placeholder='Digite o título da atividade ou avaliação'
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
						title: filters.q ? 'Nenhuma atividade encontrada' : 'Nenhuma atividade cadastrada',
						description: filters.q
							? 'Tente outro título ou limpe a busca.'
							: 'Acesse uma turma para criar sua primeira atividade ou avaliação.',
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
						) : (
							<ActionLink to='/professor/classes'>Acessar turmas</ActionLink>
						),
					}
				}
			>
				<VStack align='stretch' gap={4}>
					{query.data?.items.map((activity) => (
						<ActivityCard key={activity.id} activity={activity} />
					))}
				</VStack>
				{query.data && <Pagination {...query.data} onChange={setPage} />}
			</QueryState>
		</VStack>
	);
}
