import { academic } from '@Api/academic/endpoints';
import { academicKeys } from '@Api/academic/keys';
import type { AcademicCalendarEvent } from '@Api/academic/types';
import { useAuthClientStore } from '@features/auth/public/stores/useAuthClientStore';
import { useQuery } from '@tanstack/react-query';

export function useMyAcademicCalendarEvents(from: Date, to: Date) {
	const clientId = useAuthClientStore((state) => state.authClient?.id ?? null);
	const fromIso = from.toISOString();
	const toIso = to.toISOString();
	const query = useQuery({
		queryKey: academicKeys.myAcademicCalendarEvents(fromIso, toIso),
		enabled: !!clientId,
		staleTime: 60_000,
		queryFn: () => academic.getMyAcademicCalendarEvents.query(fromIso, toIso).queryFn() as Promise<AcademicCalendarEvent[]>,
	});
	return { events: query.data ?? [], isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}
