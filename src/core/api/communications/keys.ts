import { createQueryKeys } from '@Api/utils';

export const communicationsKeys = createQueryKeys({
	myAnnouncements: () => ['communications', 'announcements', 'me'] as const,
});
