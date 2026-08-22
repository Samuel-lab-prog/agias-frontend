import { createQueryKeys } from '@Api/utils';

export const scheduleKeys = createQueryKeys({
	byClassOffering: (classOfferingId: string) =>
		['schedule', 'class-offerings', classOfferingId, 'sessions'] as const,
});
