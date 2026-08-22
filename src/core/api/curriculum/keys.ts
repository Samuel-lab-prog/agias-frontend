import { createQueryKeys } from '@Api/utils';

export const curriculumKeys = createQueryKeys({
	all: () => ['curriculum'] as const,
});
