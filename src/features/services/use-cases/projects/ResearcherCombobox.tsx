import { projects } from '@Api/projects/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { TextSearchCombobox } from './TextSearchCombobox';

export function ResearcherCombobox({
	value,
	onChange,
	scope,
}: {
	value: string;
	onChange: (value: string) => void;
	scope: 'campus' | 'institution';
}) {
	const [search, setSearch] = useState(value.trim());
	useEffect(() => {
		const timeout = setTimeout(() => setSearch(value.trim()), 250);
		return () => clearTimeout(timeout);
	}, [value]);
	const query = useQuery({
		queryKey: ['project-researchers', scope, search],
		queryFn: () => projects.researchers(search, scope),
		enabled: Boolean(search),
	});
	const waiting = search !== value.trim() || query.isFetching;
	return (
		<TextSearchCombobox
			label='Pesquisador'
			placeholder='Digite o nome do pesquisador'
			clearLabel='Limpar pesquisador'
			triggerLabel='Abrir sugestões de pesquisadores'
			value={value}
			onChange={onChange}
			options={
				waiting || !search
					? []
					: [...new Set(query.data?.map((person) => person.name))].map((name) => ({
							value: name,
							label: name,
						}))
			}
			emptyText={
				!value.trim()
					? 'Digite para pesquisar nomes.'
					: waiting
						? 'Buscando pesquisadores…'
						: query.isError
							? 'Não foi possível carregar os nomes. Tente novamente.'
							: 'Nenhum pesquisador encontrado.'
			}
		/>
	);
}
