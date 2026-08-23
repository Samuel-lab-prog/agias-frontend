import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { StudentProfile } from '@Api/academic/types';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';

export function useMyStudentProfile() {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);

	const query = useQuery({
		queryKey: academicKeys.myStudentProfile(),
		enabled: !!clientId,
		staleTime: Infinity,
		queryFn: () => academic.getMyStudentProfile.query().queryFn() as Promise<StudentProfile>,
	});

	return {
		profile: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		isMissingClient: !clientId,
		refetch: query.refetch,
	};
}
