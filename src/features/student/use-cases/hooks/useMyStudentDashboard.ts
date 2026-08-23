import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { StudentDashboard } from '@Api/academic/types';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';

export function useMyStudentDashboard() {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);

	const query = useQuery({
		queryKey: academicKeys.myStudentDashboard(),
		enabled: !!clientId,
		staleTime: 60_000,
		queryFn: () => academic.getMyStudentDashboard.query().queryFn() as Promise<StudentDashboard>,
	});

	return {
		dashboard: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		isMissingClient: !clientId,
		refetch: query.refetch,
	};
}
