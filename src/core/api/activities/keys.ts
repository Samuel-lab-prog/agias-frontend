import { createQueryKeys } from '@Api/utils';

export const activitiesKeys = createQueryKeys({
	byClassOffering: (classOfferingId: string) =>
		['activities', 'class-offerings', classOfferingId] as const,
	submissionsByStudentProfile: (studentProfileId: string) =>
		['activities', 'students', studentProfileId, 'submissions'] as const,
});
