import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { StaffProfile } from '@Api/academic/types';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';

export function useMyStaffProfile() {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);

	const query = useQuery({
		queryKey: academicKeys.myStaffProfile(),
		enabled: !!clientId,
		staleTime: Infinity,
		queryFn: () => academic.getMyStaffProfile.query().queryFn() as Promise<StaffProfile>,
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
