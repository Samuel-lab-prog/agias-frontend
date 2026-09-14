import { projects } from '@Api/projects/endpoints';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { TextSearchCombobox } from './TextSearchCombobox';

export function ProjectCombobox({
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
		queryKey: ['project-suggestions', scope, search],
		queryFn: () => projects.list({ q: search, scope, ownership: 'all' }),
		enabled: Boolean(search),
	});
	const waiting = search !== value.trim() || query.isFetching;
	return (
		<TextSearchCombobox
			label='Buscar projeto'
			placeholder='Título, objetivos ou código'
			clearLabel='Limpar busca de projeto'
			triggerLabel='Abrir sugestões de projetos'
			value={value}
			onChange={onChange}
			options={
				waiting || !search
					? []
					: (query.data?.items ?? []).map((project) => ({
							value: project.code,
							label: `${project.code} — ${project.title}`,
						}))
			}
			emptyText={
				!value.trim()
					? 'Digite para pesquisar projetos.'
					: waiting
						? 'Buscando projetos…'
						: query.isError
							? 'Não foi possível carregar os projetos. Tente novamente.'
							: 'Nenhum projeto encontrado.'
			}
		/>
	);
}
