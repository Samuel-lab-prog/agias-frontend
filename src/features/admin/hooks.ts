import { useQuery } from '@tanstack/react-query';

export function useAdminQuery<T>(key: unknown[], queryFn: () => Promise<T>, enabled = true) {
	return useQuery({ queryKey: ['administration', ...key], queryFn, enabled, staleTime: 30000 });
}
