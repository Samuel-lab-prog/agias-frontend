import type { Paged, ProfessorOption, StudentOption } from '@Api/curriculum/types';
import { BaseButton } from '@BaseComponents';
import { Box, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { FieldLabel, Pagination, RequestError } from './components';
import { useSearch, useStaffQuery } from './hooks';

type Person = ProfessorOption | StudentOption;
type Props = {
	kind: 'student' | 'professor';
	scope: number;
	fetch: (query: { q: string; page: number }) => Promise<Paged<Person>>;
	onChoose: (id: number) => void;
	pending: boolean;
	error: unknown;
	linkedIds?: number[];
};
export function PeoplePicker({
	kind,
	scope,
	fetch,
	onChoose,
	pending,
	error,
	linkedIds = [],
}: Props) {
	const search = useSearch();
	const [page, setPage] = useState(1);
	const query = useStaffQuery([kind, scope, search.query, page], () =>
		fetch({ q: search.query, page }),
	);
	const label =
		kind === 'student' ? 'Buscar aluno por nome ou matrícula' : 'Buscar professor por nome';
	return (
		<VStack align='stretch' gap={3}>
			<FieldLabel label={label}>
				<Input
					value={search.text}
					onChange={(event) => {
						search.setText(event.target.value);
						setPage(1);
					}}
					placeholder='Digite para filtrar'
				/>
			</FieldLabel>
			<RequestError
				error={error || query.error}
				retry={query.isError ? () => void query.refetch() : undefined}
			/>
			{query.isPending ? (
				<Text role='status'>Buscando…</Text>
			) : query.data ? (
				<>
					{!query.data.items.length ? (
						<Text role='status'>
							Nenhum {kind === 'student' ? 'aluno elegível' : 'professor ativo'} encontrado.
						</Text>
					) : (
						query.data.items.map((person) => (
							<HStack
								key={person.id}
								justify='space-between'
								gap={3}
								borderBottomWidth='1px'
								borderColor='border.default'
								py={2}
							>
								<Box minW={0}>
									<Text fontWeight='medium' overflowWrap='anywhere'>
										{person.name}
									</Text>
									{'academicId' in person ? (
										<Text color='fg.muted' fontSize='sm'>
											{person.academicId}
											{person.courseId === null ? ' · Sem curso' : ''}
										</Text>
									) : null}
								</Box>
								<BaseButton
									size='sm'
									variant='secondary'
									disabled={pending || linkedIds.includes(person.id)}
									onClick={() => onChoose(person.id)}
									aria-label={`${kind === 'student' ? 'Matricular' : 'Vincular'} ${person.name}`}
								>
									{linkedIds.includes(person.id)
										? 'Vinculado'
										: kind === 'student'
											? 'Matricular'
											: 'Vincular'}
								</BaseButton>
							</HStack>
						))
					)}
					<Pagination {...query.data} onChange={setPage} disabled={query.isFetching || pending} />
				</>
			) : null}
		</VStack>
	);
}
