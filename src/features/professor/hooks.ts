import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export function useTeachingQuery<T>(key: unknown[], queryFn: () => Promise<T>, enabled = true) {
	return useQuery({ queryKey: ['teaching', ...key], queryFn, enabled, staleTime: 30_000 });
}

export function usePagedSearch() {
	const [search, setSearch] = useState('');
	const [filters, setFilters] = useState({ page: 1, q: '' });
	const applySearch = useCallback((value: string) => {
		setFilters({ page: 1, q: value.trim() });
	}, []);
	return {
		search,
		setSearch,
		filters,
		applySearch,
		setPage: (page: number) => setFilters((current) => ({ ...current, page })),
	};
}
